import { useState, useEffect, useRef, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Play, Pause, RotateCcw, MapPin, X } from 'lucide-react'

export const Route = createFileRoute('/simulation')({
  component: MovementSimulation,
})

declare global {
  interface Window {
    naver: any
    initNaverMaps: (clientId: string) => Promise<any>
  }
}

interface Location {
  lat: number
  lng: number
}

interface RouteSegment {
  lat: number
  lng: number
  distance: number // cumulative distance in meters
}

function MovementSimulation() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const startMarkerRef = useRef<any>(null)
  const endMarkerRef = useRef<any>(null)
  const currentMarkerRef = useRef<any>(null)
  const polylineRef = useRef<any>(null)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef<boolean>(false)

  const [startPoint, setStartPoint] = useState<Location | null>(null)
  const [endPoint, setEndPoint] = useState<Location | null>(null)
  const [speed, setSpeed] = useState<number>(60) // km/h
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<Location | null>(null)
  const [progress, setProgress] = useState(0) // 0-100
  const [elapsedTime, setElapsedTime] = useState(0) // seconds
  const [mode, setMode] = useState<'start' | 'end' | 'none'>('none')
  const [routePath, setRoutePath] = useState<RouteSegment[]>([])
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)
  const [routeError, setRouteError] = useState<string | null>(null)
  const modeRef = useRef<'start' | 'end' | 'none'>('none')

  // Sync mode state with ref
  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  // Fetch route from Naver Directions API via proxy
  const fetchRoute = useCallback(async (start: Location, end: Location) => {
    setIsLoadingRoute(true)
    setRouteError(null)

    try {
      // Naver Directions API expects coordinates in "lng,lat" format
      const startCoord = `${start.lng},${start.lat}`
      const endCoord = `${end.lng},${end.lat}`

      // Use proxy server to avoid CORS issues
      // In development: use localhost:3003
      // In production: use relative path (works with Netlify/Vercel serverless functions)
      const isDev = import.meta.env.DEV
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ||
        (isDev ? 'http://localhost:3003' : '')

      const response = await fetch(
        `${apiBaseUrl}/api/directions?start=${startCoord}&goal=${endCoord}&option=trafast`,
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `API request failed: ${response.status}`)
      }

      const data = await response.json()

      if (data.code !== 0 || !data.route || !data.route.trafast) {
        throw new Error('No route found')
      }

      // Extract path coordinates from the route
      const route = data.route.trafast[0]
      const pathCoords: RouteSegment[] = []
      let cumulativeDistance = 0

      route.path.forEach((coord: number[], index: number) => {
        if (index > 0) {
          const prev = route.path[index - 1]
          const segmentDistance = calculateDistance(
            { lat: prev[1], lng: prev[0] },
            { lat: coord[1], lng: coord[0] },
          )
          cumulativeDistance += segmentDistance * 1000 // convert to meters
        }

        pathCoords.push({
          lng: coord[0],
          lat: coord[1],
          distance: cumulativeDistance,
        })
      })

      setRoutePath(pathCoords)
      setIsLoadingRoute(false)
    } catch (error) {
      console.error('Failed to fetch route:', error)
      setRouteError(error instanceof Error ? error.message : 'Failed to fetch route')
      setIsLoadingRoute(false)
      // Fallback to straight line
      setRoutePath([
        { ...start, distance: 0 },
        { ...end, distance: calculateDistance(start, end) * 1000 },
      ])
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return

    const initMap = async () => {
      try {
        const clientId = import.meta.env.VITE_NAVER_MAPS_CLIENT_ID

        if (!clientId) {
          console.error('Naver Maps Client ID is not set')
          return
        }

        await window.initNaverMaps(clientId)

        if (window.naver && window.naver.maps) {
          const mapOptions = {
            center: new window.naver.maps.LatLng(37.5665, 126.978),
            zoom: 13,
          }

          mapInstanceRef.current = new window.naver.maps.Map(
            mapRef.current,
            mapOptions,
          )

          // Add click listener to set start/end points
          window.naver.maps.Event.addListener(
            mapInstanceRef.current,
            'click',
            (e: any) => {
              const lat = e.coord.lat()
              const lng = e.coord.lng()

              if (modeRef.current === 'start') {
                setStartPoint({ lat, lng })
                setMode('none')
              } else if (modeRef.current === 'end') {
                setEndPoint({ lat, lng })
                setMode('none')
              }
            },
          )
        }
      } catch (error) {
        console.error('Failed to initialize Naver Map:', error)
      }
    }

    initMap()
  }, [])

  // Update start marker
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver) return

    if (startMarkerRef.current) {
      startMarkerRef.current.setMap(null)
    }

    if (startPoint) {
      startMarkerRef.current = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(startPoint.lat, startPoint.lng),
        map: mapInstanceRef.current,
        title: 'Start Point',
        icon: {
          content: `
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; white-space: nowrap; margin-bottom: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                시작점
              </div>
              <div style="background: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
            </div>
          `,
          anchor: new window.naver.maps.Point(12, 48),
        },
      })
    }
  }, [startPoint])

  // Update end marker
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver) return

    if (endMarkerRef.current) {
      endMarkerRef.current.setMap(null)
    }

    if (endPoint) {
      endMarkerRef.current = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(endPoint.lat, endPoint.lng),
        map: mapInstanceRef.current,
        title: 'End Point',
        icon: {
          content: `
            <div style="display: flex; flex-direction: column; align-items: center;">
              <div style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; white-space: nowrap; margin-bottom: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                도착점
              </div>
              <div style="background: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
            </div>
          `,
          anchor: new window.naver.maps.Point(12, 48),
        },
      })
    }
  }, [endPoint])

  // Fetch route when both points are set
  useEffect(() => {
    if (!startPoint || !endPoint) return

    fetchRoute(startPoint, endPoint)
  }, [startPoint, endPoint, fetchRoute])

  // Draw path when route is loaded
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver || routePath.length === 0)
      return

    if (polylineRef.current) {
      polylineRef.current.setMap(null)
    }

    const path = routePath.map(
      (point) => new window.naver.maps.LatLng(point.lat, point.lng),
    )

    polylineRef.current = new window.naver.maps.Polyline({
      map: mapInstanceRef.current,
      path: path,
      strokeColor: '#3b82f6',
      strokeWeight: 4,
      strokeOpacity: 0.7,
      strokeStyle: 'solid',
    })
  }, [routePath])

  // Calculate distance in km using Haversine formula
  const calculateDistance = useCallback((p1: Location, p2: Location): number => {
    const R = 6371 // Earth's radius in km
    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180
    const dLng = ((p2.lng - p1.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((p1.lat * Math.PI) / 180) *
        Math.cos((p2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }, [])

  // Calculate position at given distance along route
  const interpolatePosition = useCallback(
    (targetDistance: number): Location | null => {
      if (routePath.length === 0) return null

      // Find the segment where the target distance falls
      for (let i = 0; i < routePath.length - 1; i++) {
        const current = routePath[i]
        const next = routePath[i + 1]

        if (targetDistance >= current.distance && targetDistance <= next.distance) {
          // Interpolate between current and next point
          const segmentDistance = next.distance - current.distance
          const segmentProgress = (targetDistance - current.distance) / segmentDistance

          const lat = current.lat + (next.lat - current.lat) * segmentProgress
          const lng = current.lng + (next.lng - current.lng) * segmentProgress

          return { lat, lng }
        }
      }

      // Return the last point if we've reached the end
      const lastPoint = routePath[routePath.length - 1]
      return { lat: lastPoint.lat, lng: lastPoint.lng }
    },
    [routePath],
  )

  // Update current position marker
  useEffect(() => {
    if (!mapInstanceRef.current || !window.naver || !currentPosition) return

    if (currentMarkerRef.current) {
      currentMarkerRef.current.setPosition(
        new window.naver.maps.LatLng(currentPosition.lat, currentPosition.lng),
      )
    } else {
      currentMarkerRef.current = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(
          currentPosition.lat,
          currentPosition.lng,
        ),
        map: mapInstanceRef.current,
        title: 'Current Position',
        icon: {
          content: `<div style="background: #f59e0b; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>`,
          anchor: new window.naver.maps.Point(10, 10),
        },
      })
    }
  }, [currentPosition])

  // Animation logic
  useEffect(() => {
    if (!isPlaying || routePath.length === 0) {
      return
    }

    const totalDistance = routePath[routePath.length - 1].distance // in meters
    const totalTime = (totalDistance / 1000 / speed) * 3600 // total time in seconds

    // When starting or resuming, set the start time based on paused time
    startTimeRef.current = Date.now() - pausedTimeRef.current

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current // elapsed in milliseconds
      const currentTime = elapsed / 1000 // elapsed in seconds
      const newProgress = Math.min((currentTime / totalTime) * 100, 100)

      setProgress(newProgress)
      setElapsedTime(currentTime)

      // Calculate distance traveled in meters
      const traveledDistance = (totalDistance * newProgress) / 100
      const position = interpolatePosition(traveledDistance)
      if (position) {
        setCurrentPosition(position)
      }

      if (newProgress < 100) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsPlaying(false)
        pausedTimeRef.current = totalTime * 1000 // Mark as completed
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isPlaying, routePath, speed, interpolatePosition])

  // Save paused time when stopping
  useEffect(() => {
    if (!isPlaying && startTimeRef.current > 0) {
      pausedTimeRef.current = Date.now() - startTimeRef.current
    }
  }, [isPlaying])

  const handlePlayPause = () => {
    if (!startPoint || !endPoint || routePath.length === 0) return

    if (progress >= 100) {
      // Reset and replay if completed
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      setProgress(0)
      setElapsedTime(0)
      setCurrentPosition(startPoint)
      pausedTimeRef.current = 0
      startTimeRef.current = 0
      // Use setTimeout to ensure state updates before playing
      setTimeout(() => {
        setIsPlaying(true)
      }, 0)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const handleReset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    setIsPlaying(false)
    setProgress(0)
    setElapsedTime(0)
    setCurrentPosition(startPoint)
    pausedTimeRef.current = 0
    startTimeRef.current = 0
  }

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`
    } else if (mins > 0) {
      return `${mins}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  // Handle progress bar seek
  const seekToProgress = useCallback((newProgress: number) => {
    if (routePath.length === 0) return

    const totalDistance = routePath[routePath.length - 1].distance
    const totalTime = (totalDistance / 1000 / speed) * 3600

    // Update progress and time
    setProgress(newProgress)
    const newElapsedTime = (newProgress / 100) * totalTime
    setElapsedTime(newElapsedTime)

    // Update paused time ref
    pausedTimeRef.current = newElapsedTime * 1000

    // Update position
    const traveledDistance = (totalDistance * newProgress) / 100
    const position = interpolatePosition(traveledDistance)
    if (position) {
      setCurrentPosition(position)
    }
  }, [routePath, speed, interpolatePosition])

  const handleProgressBarClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || routePath.length === 0) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newProgress = Math.max(0, Math.min(100, (clickX / rect.width) * 100))

    const wasPlaying = isPlaying
    if (wasPlaying) {
      setIsPlaying(false)
    }

    seekToProgress(newProgress)

    if (wasPlaying) {
      setTimeout(() => setIsPlaying(true), 0)
    }
  }, [routePath, isPlaying, seekToProgress])

  const handleProgressBarMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (routePath.length === 0) return

    isDraggingRef.current = true
    const wasPlaying = isPlaying
    if (wasPlaying) {
      setIsPlaying(false)
    }

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current || !progressBarRef.current) return

      const rect = progressBarRef.current.getBoundingClientRect()
      const moveX = moveEvent.clientX - rect.left
      const newProgress = Math.max(0, Math.min(100, (moveX / rect.width) * 100))

      seekToProgress(newProgress)
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

      if (wasPlaying) {
        setTimeout(() => setIsPlaying(true), 0)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    handleMouseMove(e.nativeEvent)
  }, [routePath, isPlaying, seekToProgress])

  const handleResetPoints = () => {
    // Stop animation
    setIsPlaying(false)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    // Clear all points and markers
    setStartPoint(null)
    setEndPoint(null)
    setCurrentPosition(null)
    setRoutePath([])
    setProgress(0)
    setElapsedTime(0)
    setRouteError(null)
    pausedTimeRef.current = 0
    startTimeRef.current = 0

    // Remove markers from map
    if (startMarkerRef.current) {
      startMarkerRef.current.setMap(null)
      startMarkerRef.current = null
    }
    if (endMarkerRef.current) {
      endMarkerRef.current.setMap(null)
      endMarkerRef.current = null
    }
    if (currentMarkerRef.current) {
      currentMarkerRef.current.setMap(null)
      currentMarkerRef.current = null
    }
    if (polylineRef.current) {
      polylineRef.current.setMap(null)
      polylineRef.current = null
    }
  }

  const totalDistance = routePath.length > 0 ? routePath[routePath.length - 1].distance / 1000 : 0 // in km
  const totalTime = speed > 0 ? (totalDistance / speed) * 3600 : 0
  const traveledDistance = (totalDistance * progress) / 100

  return (
    <div className="w-full h-screen pt-16 flex flex-col bg-gray-50">
      {/* Control Panel */}
      <div className="flex-shrink-0 bg-white shadow-md p-6 border-b">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Movement Simulation
          </h2>

          {/* Point Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">1. Set Points</h3>
                {(startPoint || endPoint) && (
                  <button
                    onClick={handleResetPoints}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md font-medium transition-all flex items-center gap-1"
                  >
                    <X size={14} />
                    Reset Points
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode(mode === 'start' ? 'none' : 'start')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    mode === 'start'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <MapPin size={16} />
                    {mode === 'start' ? 'Click on Map' : 'Set Start'}
                  </div>
                </button>
                <button
                  onClick={() => setMode(mode === 'end' ? 'none' : 'end')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    mode === 'end'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <MapPin size={16} />
                    {mode === 'end' ? 'Click on Map' : 'Set End'}
                  </div>
                </button>
              </div>
              {startPoint && (
                <p className="text-xs text-gray-600">
                  Start: {startPoint.lat.toFixed(6)}, {startPoint.lng.toFixed(6)}
                </p>
              )}
              {endPoint && (
                <p className="text-xs text-gray-600">
                  End: {endPoint.lat.toFixed(6)}, {endPoint.lng.toFixed(6)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">2. Set Speed</h3>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={speed}
                  onChange={(e) => setSpeed(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-sm font-medium text-gray-700 w-16">km/h</span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          {/* Loading/Error Messages */}
          {isLoadingRoute && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium">경로를 불러오는 중...</span>
              </div>
            </div>
          )}
          {routeError && (
            <div className="border-t pt-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ 경로 검색 실패: {routeError}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  직선 경로로 대체되었습니다.
                </p>
              </div>
            </div>
          )}

          {/* Simulation Controls */}
          {startPoint && endPoint && routePath.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlayPause}
                  disabled={!startPoint || !endPoint}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause size={20} />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      {progress >= 100 ? 'Replay' : progress > 0 ? 'Resume' : 'Play'}
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  disabled={progress === 0}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <RotateCcw size={20} />
                  Reset
                </button>

                <div className="flex-1 ml-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress: {progress.toFixed(1)}%</span>
                    <span>
                      {formatTime(elapsedTime)} / {formatTime(totalTime)}
                    </span>
                  </div>
                  <div
                    ref={progressBarRef}
                    className="w-full bg-gray-200 rounded-full h-3 overflow-hidden cursor-pointer hover:bg-gray-300 transition-colors"
                    onClick={handleProgressBarClick}
                    onMouseDown={handleProgressBarMouseDown}
                  >
                    <div
                      className="bg-blue-600 h-full rounded-full pointer-events-none"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Total Distance</p>
                  <p className="text-lg font-bold text-gray-800">
                    {totalDistance.toFixed(2)} km
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Traveled</p>
                  <p className="text-lg font-bold text-blue-600">
                    {traveledDistance.toFixed(2)} km
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Remaining</p>
                  <p className="text-lg font-bold text-gray-800">
                    {(totalDistance - traveledDistance).toFixed(2)} km
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 p-4">
        <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div ref={mapRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  )
}
