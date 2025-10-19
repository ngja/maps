import { useState, useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import GameMinimap from '../components/map/GameMinimap'

export const Route = createFileRoute('/game')({
  component: GameMap,
})

// 게임 프리셋 스타일 정의
export type GameStyle = {
  id: string
  name: string
  mapStyles: google.maps.MapTypeStyle[]
  icon: string
  description: string
}

const gameStyles: GameStyle[] = [
  {
    id: 'gta',
    name: 'GTA Style',
    icon: '🎮',
    description: 'Grand Theft Auto inspired minimap',
    mapStyles: [
      { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'administrative.country',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#4b6878' }],
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#334e87' }],
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{ color: '#023e58' }],
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#283d6a' }],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{ color: '#023e58' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#3C7680' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#304a7d' }],
      },
      {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#98a5be' }],
      },
      {
        featureType: 'road',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#1d2c4d' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#2c6675' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#255763' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#b0d5ce' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#023e58' }],
      },
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#0e1626' }],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#4e6d70' }],
      },
    ],
  },
  {
    id: 'minecraft',
    name: 'Minecraft Style',
    icon: '⛏️',
    description: 'Blocky pixelated world map',
    mapStyles: [
      { elementType: 'geometry', stylers: [{ color: '#7cb342' }] },
      { elementType: 'labels', stylers: [{ visibility: 'off' }] },
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#8d6e63' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#6d4c41' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#0277bd' }],
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry',
        stylers: [{ color: '#9e9e9e' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#558b2f' }],
      },
    ],
  },
  {
    id: 'fortnite',
    name: 'Fortnite Style',
    icon: '🪂',
    description: 'Vibrant battle royale map',
    mapStyles: [
      { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#c9b2a6' }],
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{ color: '#dfd2ae' }],
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#dfd2ae' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{ color: '#a5b076' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#447530' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#f5f1e6' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#f8c967' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#e9bc62' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{ color: '#19a0d8' }],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#92998d' }],
      },
    ],
  },
  {
    id: 'zelda',
    name: 'Zelda Style',
    icon: '⚔️',
    description: 'Fantasy adventure map',
    mapStyles: [
      { elementType: 'geometry', stylers: [{ color: '#c5e1a5' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#33691e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#f1f8e9' }] },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#aed581' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{ color: '#689f38' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#dce775' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#afb42b' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{ color: '#4fc3f7' }],
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry',
        stylers: [{ color: '#9ccc65' }],
      },
    ],
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    icon: '🌃',
    description: 'Neon-lit dystopian city',
    mapStyles: [
      { elementType: 'geometry', stylers: [{ color: '#212121' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#00ff00' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#000000' }] },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#263238' }],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#ff00ff' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#1a237e' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#ff1744' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{ color: '#0d47a1' }],
      },
    ],
  },
  {
    id: 'pokemon',
    name: 'Pokemon Go',
    icon: '🔴',
    description: 'AR game style map',
    mapStyles: [
      { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
      { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#eeeeee' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#4caf50' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }],
      },
      {
        featureType: 'road.arterial',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#757575' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#ffeb3b' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#2196f3' }],
      },
    ],
  },
]

function GameMap() {
  const [selectedGame, setSelectedGame] = useState<GameStyle>(gameStyles[0])
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 }) // 서울 시청
  const [zoom] = useState(15)
  const [rotation, setRotation] = useState(0) // 캐릭터 회전 각도 (도)
  const [moveSpeed, setMoveSpeed] = useState(0.0001) // 이동 속도
  const minimapRef = useRef<HTMLDivElement>(null)
  const keysPressed = useRef<Set<string>>(new Set())

  // 마우스 이동으로 캐릭터 회전 - 간단하게 직접 계산
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (minimapRef.current) {
        const rect = minimapRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const deltaX = e.clientX - centerX
        const deltaY = e.clientY - centerY

        // 마우스 위치에 따른 각도 계산
        // atan2(y, x)는 오른쪽이 0도, 반시계방향
        // 위쪽이 0도가 되도록 90도를 더함
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90

        setRotation(angle)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // WASD 키 입력 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (['w', 'a', 's', 'd'].includes(key)) {
        keysPressed.current.add(key)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      keysPressed.current.delete(key)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // 이동 처리 (애니메이션 프레임)
  useEffect(() => {
    let animationFrameId: number

    const updatePosition = () => {
      if (keysPressed.current.size > 0) {
        setCenter((prev) => {
          let deltaLat = 0
          let deltaLng = 0

          // rotation: 0도 = 위쪽(북), 90도 = 오른쪽(동), 180도 = 아래(남), 270도 = 왼쪽(서)
          // 지도 좌표계: lat+ = 북쪽, lng+ = 동쪽

          // 각 방향으로의 단위 벡터 계산
          const angleRad = (rotation * Math.PI) / 180

          // 전진 방향 (마우스 방향)
          const forwardLat = Math.cos(angleRad)   // 0도일 때 +1 (북쪽)
          const forwardLng = Math.sin(angleRad)   // 90도일 때 +1 (동쪽)

          // 왼쪽 방향 (마우스 방향 기준 -90도)
          const leftLat = -Math.sin(angleRad)     // 0도일 때 0, 270도일 때 +1
          const leftLng = Math.cos(angleRad)      // 0도일 때 +1, 90도일 때 0

          if (keysPressed.current.has('w')) {
            // W: 마우스 방향으로 전진
            deltaLat += forwardLat * moveSpeed
            deltaLng += forwardLng * moveSpeed
          }
          if (keysPressed.current.has('s')) {
            // S: 마우스 반대 방향으로 후진
            deltaLat -= forwardLat * moveSpeed
            deltaLng -= forwardLng * moveSpeed
          }
          if (keysPressed.current.has('a')) {
            // A: 마우스 방향 기준 왼쪽으로 이동
            deltaLat -= leftLat * moveSpeed
            deltaLng -= leftLng * moveSpeed
          }
          if (keysPressed.current.has('d')) {
            // D: 마우스 방향 기준 오른쪽으로 이동
            deltaLat += leftLat * moveSpeed
            deltaLng += leftLng * moveSpeed
          }

          return {
            lat: prev.lat + deltaLat,
            lng: prev.lng + deltaLng,
          }
        })
      }

      animationFrameId = requestAnimationFrame(updatePosition)
    }

    animationFrameId = requestAnimationFrame(updatePosition)

    return () => cancelAnimationFrame(animationFrameId)
  }, [rotation, moveSpeed])

  return (
    <div className="w-full h-screen pt-16 flex flex-col bg-gray-900">
      {/* 게임 선택 영역 */}
      <div className="flex-shrink-0 bg-gray-800 shadow-xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-bold">Choose Game Style</h2>

            {/* 이동 속도 조절 */}
            <div className="flex items-center gap-4 bg-gray-700 px-4 py-2 rounded-lg">
              <label className="text-white text-sm font-medium">Move Speed:</label>
              <input
                type="range"
                min="0.00001"
                max="0.0005"
                step="0.00001"
                value={moveSpeed}
                onChange={(e) => setMoveSpeed(parseFloat(e.target.value))}
                className="w-32 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-gray-300 text-xs font-mono w-16">
                {(moveSpeed * 10000).toFixed(1)}x
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {gameStyles.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedGame.id === game.id
                    ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/50'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-650'
                }`}
              >
                <div className="text-3xl mb-2">{game.icon}</div>
                <div className="text-white text-sm font-semibold">{game.name}</div>
                <div className="text-gray-400 text-xs mt-1">{game.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 미니맵 영역 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative">
          {/* 미니맵 타이틀 */}
          <div className="absolute -top-12 left-0 right-0 flex items-center justify-center gap-3 z-10">
            <div className="text-4xl">{selectedGame.icon}</div>
            <h3 className="text-white text-2xl font-bold drop-shadow-lg">
              {selectedGame.name}
            </h3>
          </div>

          {/* 미니맵 컨테이너 */}
          <div className="relative">
            {/* 미니맵 외곽 프레임 */}
            <div className="absolute -inset-4 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-2xl shadow-2xl"></div>
            <div className="absolute -inset-3 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl opacity-50"></div>

            {/* 미니맵 */}
            <div
              ref={minimapRef}
              className="relative w-[600px] h-[600px] rounded-lg overflow-hidden shadow-2xl border-4 border-gray-700"
            >
              <GameMinimap center={center} zoom={zoom} mapStyles={selectedGame.mapStyles} />

              {/* 중앙 플레이어 마커 */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <div
                  className="relative"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  {/* 외곽 펄스 효과 */}
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                  {/* 메인 마커 */}
                  <div className="relative w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  {/* 방향 표시 화살표 */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-blue-500 drop-shadow-lg"></div>
                  </div>
                </div>
              </div>

              {/* 미니맵 오버레이 UI */}
              <div className="absolute top-4 right-4 bg-black/70 px-3 py-2 rounded-lg">
                <div className="text-white text-xs font-mono">
                  <div>LAT: {center.lat.toFixed(4)}</div>
                  <div>LNG: {center.lng.toFixed(4)}</div>
                  <div>ZOOM: {zoom}</div>
                  <div>ROT: {rotation.toFixed(1)}°</div>
                </div>
              </div>

              {/* 조작 가이드 */}
              <div className="absolute bottom-4 right-4 bg-black/70 px-3 py-2 rounded-lg">
                <div className="text-white text-xs font-mono space-y-1">
                  <div className="font-bold mb-2">Controls:</div>
                  <div>🖱️ Mouse: Rotate</div>
                  <div>⌨️ WASD: Move</div>
                </div>
              </div>

              {/* 미니맵 스케일 */}
              <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded text-white text-xs font-mono">
                100m
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 정보 */}
      <div className="flex-shrink-0 bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          Interactive game-style minimap • Move your mouse to rotate • Use WASD to move around the real world
        </div>
      </div>
    </div>
  )
}
