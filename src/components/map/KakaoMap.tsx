import { useEffect, useRef } from 'react'

interface KakaoMapProps {
  center: { lat: number; lng: number }
  zoom?: number
  className?: string
}

declare global {
  interface Window {
    kakao: any
    initKakaoMap: (appKey: string) => Promise<any>
  }
}

export default function KakaoMap({
  center,
  zoom = 3,
  className = 'w-full h-full',
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const initMap = async () => {
      try {
        const appKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY

        if (!appKey) {
          console.error('Kakao Map App Key is not set')
          return
        }

        await window.initKakaoMap(appKey)

        if (window.kakao && window.kakao.maps) {
          // Convert Google/Naver zoom to Kakao level
          // Kakao level is inverted: lower = more zoomed in, higher = more zoomed out
          // Adjusted to match Google/Naver scale better
          const kakaoLevel = Math.max(1, Math.min(14, 20 - zoom))
          const mapOptions = {
            center: new window.kakao.maps.LatLng(center.lat, center.lng),
            level: kakaoLevel,
          }

          mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, mapOptions)
        }
      } catch (error) {
        console.error('Failed to initialize Kakao Map:', error)
      }
    }

    initMap()
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current && window.kakao && window.kakao.maps) {
      const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng)
      mapInstanceRef.current.setCenter(newCenter)
    }
  }, [center])

  useEffect(() => {
    if (mapInstanceRef.current && window.kakao && window.kakao.maps) {
      // Kakao Map uses 'level' instead of 'zoom', and it's inverted
      // Lower level = more zoomed in, higher level = more zoomed out
      // Convert Google/Naver zoom (1-20) to Kakao level
      const kakaoLevel = Math.max(1, Math.min(14, 20 - zoom))
      mapInstanceRef.current.setLevel(kakaoLevel)
    }
  }, [zoom])

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}
