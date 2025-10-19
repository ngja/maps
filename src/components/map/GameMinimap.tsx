import { Map } from '@vis.gl/react-google-maps'

interface GameMinimapProps {
  center: { lat: number; lng: number }
  zoom: number
  mapStyles: google.maps.MapTypeStyle[]
  gameId?: string
}

export default function GameMinimap({ center, zoom, mapStyles, gameId }: GameMinimapProps) {
  // PUBG 스타일일 때는 위성 이미지 사용
  const mapTypeId = gameId === 'pubg' ? 'satellite' : 'roadmap'

  return (
    <Map
      defaultCenter={center}
      center={center}
      zoom={zoom}
      className="w-full h-full"
      gestureHandling="greedy"
      disableDefaultUI={true}
      styles={mapStyles}
      mapTypeId={mapTypeId}
      options={{
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        keyboardShortcuts: false,
      }}
    />
  )
}
