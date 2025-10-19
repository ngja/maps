import { Map } from '@vis.gl/react-google-maps'

interface GameMinimapProps {
  center: { lat: number; lng: number }
  zoom: number
  mapStyles: google.maps.MapTypeStyle[]
}

export default function GameMinimap({ center, zoom, mapStyles }: GameMinimapProps) {
  return (
    <Map
      defaultCenter={center}
      center={center}
      zoom={zoom}
      className="w-full h-full"
      gestureHandling="greedy"
      disableDefaultUI={true}
      styles={mapStyles}
      mapTypeId="roadmap"
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
