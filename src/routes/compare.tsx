import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Map } from '@vis.gl/react-google-maps'
import NaverMap from '../components/map/NaverMap'
import KakaoMap from '../components/map/KakaoMap'
import Joystick from '../components/map/Joystick'

export const Route = createFileRoute('/compare')({
  component: MapComparison,
})

function MapComparison() {
  // 서울 시청 기본 좌표
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 })
  const [sensitivity, setSensitivity] = useState(0.000001)
  const [zoom, setZoom] = useState(13)

  const handleJoystickMove = (deltaLat: number, deltaLng: number) => {
    setCenter((prev) => ({
      lat: prev.lat + deltaLat,
      lng: prev.lng + deltaLng,
    }))
  }

  const handleCoordinateChange = (newCenter: { lat: number; lng: number }) => {
    setCenter(newCenter)
  }

  return (
    <div className="w-full h-screen pt-16 flex flex-col bg-gray-50">
      {/* 컨트롤 영역 */}
      <div className="flex-shrink-0 bg-white shadow-md p-6 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-8">
          <Joystick onMove={handleJoystickMove} sensitivity={sensitivity} />

          <div className="flex flex-col gap-4">
            {/* 좌표 입력 */}
            <div className="flex gap-4 items-center">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={center.lat.toFixed(4)}
                  onChange={(e) =>
                    handleCoordinateChange({
                      ...center,
                      lat: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={center.lng.toFixed(4)}
                  onChange={(e) =>
                    handleCoordinateChange({
                      ...center,
                      lng: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 감도 조절 */}
            <div className="flex flex-col gap-2 border-t pt-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-600">Joystick Sensitivity</label>
                <span className="text-xs text-gray-500">{sensitivity.toFixed(6)}</span>
              </div>
              <input
                type="range"
                min="0.000001"
                max="0.001"
                step="0.000001"
                value={sensitivity}
                onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Slow</span>
                <span>Fast</span>
              </div>
            </div>

            {/* 줌 레벨 조절 */}
            <div className="flex flex-col gap-2 border-t pt-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-600">Zoom Level (All Maps)</label>
                <span className="text-xs text-gray-500">{zoom}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={zoom}
                onChange={(e) => setZoom(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Far</span>
                <span>Close</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 지도 영역 - 3분할 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden">
        {/* Google Maps */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h3 className="text-gray-800 font-semibold text-base">Google Maps</h3>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
            <Map
              defaultCenter={center}
              center={center}
              zoom={zoom}
              className="w-full h-full"
              gestureHandling="greedy"
              disableDefaultUI={false}
            />
          </div>
        </div>

        {/* Naver Map */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h3 className="text-gray-800 font-semibold text-base">Naver Map</h3>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
            <NaverMap center={center} zoom={zoom} />
          </div>
        </div>

        {/* Kakao Map */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <h3 className="text-gray-800 font-semibold text-base">Kakao Map</h3>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
            <KakaoMap center={center} zoom={zoom} />
          </div>
        </div>
      </div>
    </div>
  )
}
