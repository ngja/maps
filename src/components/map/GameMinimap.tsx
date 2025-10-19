import { Map } from '@vis.gl/react-google-maps'

interface GameMinimapProps {
  center: { lat: number; lng: number }
  zoom: number
  mapStyles: google.maps.MapTypeStyle[]
  gameId?: string
}

export default function GameMinimap({ center, zoom, mapStyles, gameId }: GameMinimapProps) {
  // 게임별 지도 타입 설정
  // PUBG: 위성 이미지, Zelda: 지형(등고선), 나머지: 일반 도로
  const mapTypeId =
    gameId === 'pubg' ? 'satellite' :
    gameId === 'zelda' ? 'terrain' :
    'roadmap'

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
