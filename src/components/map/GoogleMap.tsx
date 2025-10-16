import { Map } from '@vis.gl/react-google-maps'

interface GoogleMapProps {
  defaultCenter?: { lat: number; lng: number }
  defaultZoom?: number
  className?: string
}

export default function GoogleMap({
  defaultCenter = { lat: 37.5665, lng: 126.978 }, // 서울 시청 기본 좌표
  defaultZoom = 13,
  className = 'w-full h-screen',
}: GoogleMapProps) {
  return (
    <Map
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom}
      className={className}
      gestureHandling="greedy"
      disableDefaultUI={false}
    />
  )
}
