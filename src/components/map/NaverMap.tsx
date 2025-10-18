import { useEffect, useRef } from 'react'

interface NaverMapProps {
  center: { lat: number; lng: number }
  zoom?: number
  className?: string
}

declare global {
  interface Window {
    naver: any
    initNaverMaps: (clientId: string) => Promise<any>
  }
}

export default function NaverMap({
  center,
  zoom = 13,
  className = 'w-full h-full',
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

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
            center: new window.naver.maps.LatLng(center.lat, center.lng),
            zoom: zoom,
          }

          mapInstanceRef.current = new window.naver.maps.Map(mapRef.current, mapOptions)
        }
      } catch (error) {
        console.error('Failed to initialize Naver Map:', error)
      }
    }

    initMap()
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current && window.naver && window.naver.maps) {
      const newCenter = new window.naver.maps.LatLng(center.lat, center.lng)
      mapInstanceRef.current.setCenter(newCenter)
    }
  }, [center])

  useEffect(() => {
    if (mapInstanceRef.current && window.naver && window.naver.maps) {
      mapInstanceRef.current.setZoom(zoom)
    }
  }, [zoom])

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}
