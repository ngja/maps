import { useState, useRef, useEffect } from 'react'

interface JoystickProps {
  onMove: (deltaLat: number, deltaLng: number) => void
  sensitivity?: number
}

export default function Joystick({ onMove, sensitivity = 0.001 }: JoystickProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const positionRef = useRef({ x: 0, y: 0 })

  const maxDistance = 40 // 조이스틱이 움직일 수 있는 최대 거리

  // 지속적인 이동을 위한 애니메이션 루프
  useEffect(() => {
    const animate = () => {
      if (isDragging && (positionRef.current.x !== 0 || positionRef.current.y !== 0)) {
        // 위도/경도 변화 계산 (y축이 위도, x축이 경도)
        const deltaLat = -positionRef.current.y * sensitivity
        const deltaLng = positionRef.current.x * sensitivity

        onMove(deltaLat, deltaLng)
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    if (isDragging) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isDragging, onMove, sensitivity])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const x = e.clientX - rect.left - centerX
      const y = e.clientY - rect.top - centerY

      const distance = Math.sqrt(x * x + y * y)
      const angle = Math.atan2(y, x)

      const constrainedDistance = Math.min(distance, maxDistance)
      const newX = constrainedDistance * Math.cos(angle)
      const newY = constrainedDistance * Math.sin(angle)

      setPosition({ x: newX, y: newY })
      positionRef.current = { x: newX, y: newY }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setPosition({ x: 0, y: 0 })
      positionRef.current = { x: 0, y: 0 }
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-sm font-medium text-gray-700">Coordinate Control</div>
      <div
        ref={containerRef}
        className="relative w-24 h-24 bg-gray-200 rounded-full shadow-inner cursor-pointer"
        onMouseDown={handleMouseDown}
      >
        {/* 중앙 십자선 */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gray-400 transform -translate-y-1/2" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-gray-400 transform -translate-x-1/2" />

        {/* 조이스틱 핸들 */}
        <div
          className="absolute w-8 h-8 bg-blue-500 rounded-full shadow-lg border-2 border-white transition-transform"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500">
        Drag to adjust coordinates
      </div>
    </div>
  )
}
