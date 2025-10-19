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
      // 모든 라벨과 아이콘 완전히 숨기기
      { elementType: 'labels', stylers: [{ visibility: 'off' }] },
      { elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
      { elementType: 'labels.text.fill', stylers: [{ visibility: 'off' }] },
      { elementType: 'labels.text.stroke', stylers: [{ visibility: 'off' }] },
      { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },

      // 흑백 스타일 - 기본 배경
      { elementType: 'geometry', stylers: [{ color: '#2b2b2b' }] },

      // 행정구역 숨기기
      {
        featureType: 'administrative',
        stylers: [{ visibility: 'off' }],
      },

      // 자연 지형 - 진한 회색
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#1a1a1a' }],
      },

      // 건물 및 인공 구조물 - 중간 회색
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry',
        stylers: [{ color: '#252525' }],
      },

      // POI 숨기기
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }],
      },

      // 공원 - 약간 밝은 회색으로 구분
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{ color: '#2e2e2e' }, { visibility: 'on' }],
      },

      // 일반 도로 - 밝은 회색
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#3d3d3d' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f1f1f' }],
      },

      // 고속도로 - 가장 밝은 회색
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#4a4a4a' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#2a2a2a' }],
      },

      // 대중교통 숨기기
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }],
      },

      // 물 - 검은색
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#0a0a0a' }],
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
    id: 'pubg',
    name: 'PUBG Style',
    icon: '🎯',
    description: 'Battle royale tactical map',
    mapStyles: [
      // 모든 라벨 숨기기
      { elementType: 'labels', stylers: [{ visibility: 'off' }] },

      // 기본 배경 - 밝은 베이지/모래색
      { elementType: 'geometry', stylers: [{ color: '#e8dcc5' }] },

      // 자연 지형 - 연한 갈색
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#d9ceb0' }],
      },

      // 건물 및 인공 구조물 - 회색
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry',
        stylers: [{ color: '#c4b5a0' }],
      },

      // POI 숨기기
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }],
      },

      // 공원 - 올리브 그린
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{ color: '#9ba67a' }, { visibility: 'on' }],
      },

      // 일반 도로 - 연한 회색
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#d4c8b3' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#b0a490' }],
      },

      // 고속도로 - 진한 회색
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#b8ac98' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#998f7f' }],
      },

      // 대중교통 숨기기
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }],
      },

      // 물 - 푸른 회색
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#7a9cb5' }],
      },
    ],
  },
  {
    id: 'zelda',
    name: 'Zelda Style',
    icon: '⚔️',
    description: 'Fantasy adventure map',
    mapStyles: [
      // 모든 라벨 숨기기
      { elementType: 'labels', stylers: [{ visibility: 'off' }] },

      // 기본 배경 - 황토색에 투명도
      {
        elementType: 'geometry',
        stylers: [{ color: '#d4a574' }, { lightness: 20 }]
      },

      // 자연 지형 - 연한 황토색에 약간 투명
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#d9b991' }, { lightness: 30 }],
      },

      // 건물 및 인공 구조물 - 투명하게
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry',
        stylers: [{ color: '#c9a97a' }, { lightness: 40 }],
      },

      // POI 숨기기
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }],
      },

      // 공원 - 약간 어두운 황토색
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{ color: '#b89968' }, { visibility: 'on' }],
      },

      // 도로 - 밝은 황토색 (불투명하게)
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#e8d4b8' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#c4a882' }],
      },

      // 고속도로 - 더 밝은 황토색
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#f0dfc8' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#d4b896' }],
      },

      // 대중교통 숨기기
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }],
      },

      // 물 - 청록색
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#7eb5a6' }],
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
  const [zoom, setZoom] = useState(17) // 기본 줌 레벨 증가
  const [rotation, setRotation] = useState(0) // 캐릭터 회전 각도 (도)
  const [moveSpeed, setMoveSpeed] = useState(0.00001) // 이동 속도
  const [blueZoneTimer, setBlueZoneTimer] = useState(100) // PUBG 자기장 타이머 (0-100%)
  const minimapRef = useRef<HTMLDivElement>(null)
  const keysPressed = useRef<Set<string>>(new Set())

  // PUBG 자기장 타이머 자동 감소
  useEffect(() => {
    const interval = setInterval(() => {
      setBlueZoneTimer((prev) => {
        if (prev <= 0) return 100 // 0이 되면 다시 100으로 리셋
        return prev - 0.5 // 천천히 감소
      })
    }, 100) // 100ms마다 업데이트

    return () => clearInterval(interval)
  }, [])

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
    <div className="w-full h-screen pt-16 flex flex-col bg-zinc-950">
      {/* 게임 선택 영역 */}
      <div className="flex-shrink-0 bg-zinc-900 shadow-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-bold">Choose Game Style</h2>

            <div className="flex items-center gap-4">
              {/* 줌 레벨 조절 */}
              <div className="flex items-center gap-4 bg-zinc-800 px-4 py-2 rounded-lg">
                <label className="text-white text-sm font-medium">Zoom:</label>
                <button
                  onClick={() => setZoom((prev) => Math.max(prev - 1, 1))}
                  className="w-6 h-6 bg-zinc-700 hover:bg-zinc-600 text-white rounded flex items-center justify-center transition-colors"
                  aria-label="Zoom out"
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <span className="text-white text-sm font-mono w-8 text-center">{zoom}</span>
                <button
                  onClick={() => setZoom((prev) => Math.min(prev + 1, 20))}
                  className="w-6 h-6 bg-zinc-700 hover:bg-zinc-600 text-white rounded flex items-center justify-center transition-colors"
                  aria-label="Zoom in"
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* 이동 속도 조절 */}
              <div className="flex items-center gap-4 bg-zinc-800 px-4 py-2 rounded-lg">
                <label className="text-white text-sm font-medium">Move Speed:</label>
                <input
                  type="range"
                  min="0.000001"
                  max="0.00005"
                  step="0.000001"
                  value={moveSpeed}
                  onChange={(e) => setMoveSpeed(parseFloat(e.target.value))}
                  className="w-32 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-gray-300 text-xs font-mono w-16">
                  {(moveSpeed * 10000).toFixed(1)}x
                </span>
              </div>
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
                    : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600 hover:bg-zinc-750'
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
        <div className="flex flex-col gap-2 relative">
          {/* 북쪽 마커 (GTA 스타일일 때만 표시) - 미니맵 컨테이너 밖에 위치 */}
          {selectedGame.id === 'gta' && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-ㅡㅇ">N</span>
              </div>
            </div>
          )}

          {/* 미니맵 컨테이너 - GTA는 직사각형, Minecraft와 Zelda는 원형, PUBG는 정사각형 */}
          <div
            ref={minimapRef}
            className={`relative overflow-hidden ${
              selectedGame.id === 'minecraft'
                ? 'w-[500px] h-[500px] rounded-full border-4 border-blue-400'
                : selectedGame.id === 'zelda'
                ? 'w-[500px] h-[500px] rounded-full border-4 border-yellow-600'
                : selectedGame.id === 'pubg'
                ? 'w-[500px] h-[500px] border-4 border-gray-700'
                : 'w-[600px] h-[400px]'
            }`}
          >
            {/* PUBG 자기장 타이머 바 - 상단 */}
            {selectedGame.id === 'pubg' && (
              <div className="absolute top-0 left-0 right-0 h-6 bg-zinc-900/80 border-b-2 border-gray-700 z-40 flex items-center px-2">
                <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-100"
                    style={{ width: `${blueZoneTimer}%` }}
                  />
                </div>
              </div>
            )}

            {/* 실제 구글 지도 - 더 크게 렌더링하고 가운데 부분만 보이도록 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
              <GameMinimap center={center} zoom={zoom} mapStyles={selectedGame.mapStyles} gameId={selectedGame.id} />
            </div>

            {/* Minecraft 스타일 격자 오버레이 */}
            {selectedGame.id === 'minecraft' && (
              <div className="absolute inset-0 pointer-events-none z-20">
                <svg width="100%" height="100%" className="opacity-30">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#8B4513" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            )}

            {/* PUBG 스타일 격자 오버레이 */}
            {selectedGame.id === 'pubg' && (
              <div className="absolute inset-0 pointer-events-none z-20">
                <svg width="100%" height="100%" className="opacity-20">
                  <defs>
                    <pattern id="pubg-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#6b7280" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#pubg-grid)" />
                </svg>
              </div>
            )}

            {/* Zelda 스타일 시야 효과 - 45도 좌우 각도로 그라데이션 */}
            {selectedGame.id === 'zelda' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-15 pointer-events-none">
                <div
                  className="relative"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <svg
                    width="500"
                    height="500"
                    viewBox="0 0 500 500"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <radialGradient id="zelda-vision" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(255, 255, 150, 0.4)" />
                        <stop offset="50%" stopColor="rgba(255, 255, 150, 0.15)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 150, 0)" />
                      </radialGradient>
                    </defs>
                    {/* 45도 좌우 시야 부채꼴 */}
                    <path
                      d="M250 250 L130 0 L370 0 Z"
                      fill="url(#zelda-vision)"
                    />
                  </svg>
                </div>
              </div>
            )}


            {/* 중앙 플레이어 마커 - 게임별로 다른 모양 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
              <div
                className="relative"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {selectedGame.id === 'gta' ? (
                  // GTA 스타일 화살표
                  <svg
                    width="24"
                    height="32"
                    viewBox="0 0 24 32"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-lg"
                  >
                    <path
                      d="M12 2 L22 28 L12 24 L2 28 Z"
                      fill="none"
                      stroke="#000000"
                      strokeWidth="3"
                      strokeLinejoin="miter"
                    />
                    <path
                      d="M12 2 L12 24 L2 28 Z"
                      fill="#ffffff"
                      stroke="#ffffff"
                      strokeWidth="1"
                      strokeLinejoin="miter"
                    />
                    <path
                      d="M12 2 L22 28 L12 24 Z"
                      fill="#a0a0a0"
                      stroke="#a0a0a0"
                      strokeWidth="1"
                      strokeLinejoin="miter"
                    />
                  </svg>
                ) : selectedGame.id === 'minecraft' ? (
                  // Minecraft 스타일 물방울 마커
                  <svg
                    width="32"
                    height="40"
                    viewBox="0 0 32 40"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-lg"
                  >
                    {/* 물방울 외곽 */}
                    <path
                      d="M16 2 C16 2, 4 14, 4 24 C4 30, 9 36, 16 36 C23 36, 28 30, 28 24 C28 14, 16 2, 16 2 Z"
                      fill="#3B82F6"
                      stroke="#1E40AF"
                      strokeWidth="2"
                    />
                    {/* 내부 원 */}
                    <circle
                      cx="16"
                      cy="22"
                      r="6"
                      fill="#60A5FA"
                      stroke="#1E40AF"
                      strokeWidth="1.5"
                    />
                  </svg>
                ) : selectedGame.id === 'pubg' ? (
                  // PUBG 스타일 - 동그라미 + 시야 효과
                  <svg
                    width="80"
                    height="100"
                    viewBox="0 0 80 100"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-lg"
                  >
                    {/* 시야 효과 (부채꼴 모양) */}
                    <path
                      d="M40 40 L15 -20 L65 -20 Z"
                      fill="rgba(59, 130, 246, 0.2)"
                      stroke="rgba(59, 130, 246, 0.4)"
                      strokeWidth="1"
                    />
                    {/* 캐릭터 원 */}
                    <circle
                      cx="40"
                      cy="40"
                      r="8"
                      fill="#ffffff"
                      stroke="#1f2937"
                      strokeWidth="2"
                    />
                    {/* 방향 표시 선 */}
                    <line
                      x1="40"
                      y1="40"
                      x2="40"
                      y2="25"
                      stroke="#1f2937"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : selectedGame.id === 'zelda' ? (
                  // Zelda 스타일 - 노란색 삼각형 (뒤쪽 꼬리가 안쪽으로 들어간 형태)
                  <svg
                    width="32"
                    height="40"
                    viewBox="0 0 32 40"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-lg"
                  >
                    {/* 삼각형 캐릭터 (앞쪽 뾰족, 뒤쪽 꼬리가 안쪽으로 들어감) */}
                    <path
                      d="M16 4 L28 24 L16 20 L4 24 Z"
                      fill="#fbbf24"
                    />
                    {/* 내부 하이라이트 */}
                    <path
                      d="M16 8 L24 22 L16 19 L8 22 Z"
                      fill="#fcd34d"
                      opacity="0.7"
                    />
                  </svg>
                ) : (
                  // 기본 마커 (다른 게임용)
                  <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                )}
              </div>
            </div>

          </div>

          {/* GTA 스타일 상태바 - 미니맵 바깥 하단 (GTA 스타일일 때만 표시) */}
          {selectedGame.id === 'gta' && (
            <div className="w-[600px] flex gap-2">
              {/* 체력 바 (왼쪽 1/2 - 어두운 초록색) */}
              <div className="w-1/2 h-4 bg-gradient-to-r from-green-800 to-green-700"/>

              {/* 방탄복/방어력 바 (오른쪽 1/4 - 어두운 파란색) */}
              <div className="w-1/4 h-4 bg-gradient-to-r from-blue-800 to-blue-700"/>

              {/* 스태미나/특수 능력 바 (오른쪽 1/4 - 어두운 노란색) */}
              <div className="w-1/4 h-4 bg-gradient-to-r from-yellow-700 to-yellow-600"/>
            </div>
          )}

          {/* Minecraft 스타일 좌표 표시 - 미니맵 바깥 하단 (Minecraft 스타일일 때만 표시) */}
          {selectedGame.id === 'minecraft' && (
            <div className="w-[500px] bg-zinc-900/90 border-4 border-blue-400 rounded-lg px-6 py-3">
              <div className="flex justify-center gap-8 font-mono text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">X:</span>
                  <span className="text-white">{center.lng.toFixed(6)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold">Z:</span>
                  <span className="text-white">{center.lat.toFixed(6)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-bold">Y:</span>
                  <span className="text-white">{zoom}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 정보 */}
      <div className="flex-shrink-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          Interactive game-style minimap • Move your mouse to rotate • Use WASD to move around the real world
        </div>
      </div>
    </div>
  )
}
