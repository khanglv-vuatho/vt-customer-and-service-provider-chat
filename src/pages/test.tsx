import React, { useState, useEffect, useRef } from 'react'

const TestPage: React.FC = () => {
  const totalDuration = 120 * 60 // 120 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(totalDuration)
  const [isActive, setIsActive] = useState(false)
  const circleRef = useRef<SVGCircleElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Calculate percentage of time passed
  const timePercentage = (timeLeft / totalDuration) * 100

  // Circle properties
  const circleRadius = 50
  const circleCircumference = 2 * Math.PI * circleRadius
  const strokeDashoffset = circleCircumference - (timePercentage / 100) * circleCircumference

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [isActive, timeLeft])

  // Calculate angle and convert it to time
  const calculateTimeFromAngle = (x: number, y: number) => {
    const rect = circleRef.current?.getBoundingClientRect()
    if (rect) {
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = x - centerX
      const deltaY = y - centerY
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)

      // Map angle (-180 to 180) to (0 to 360)
      const normalizedAngle = angle < 0 ? 360 + angle : angle

      // Map 0° to 360° to time (0 seconds to totalDuration)
      const newTime = (normalizedAngle / 360) * totalDuration
      setTimeLeft(Math.round(newTime))
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      calculateTimeFromAngle(e.clientX, e.clientY)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    calculateTimeFromAngle(e.clientX, e.clientY)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const handleStartPause = () => {
    setIsActive(!isActive)
  }

  const handleReset = () => {
    setIsActive(false)
    setTimeLeft(totalDuration)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <div className='relative'>
        <svg className='h-full w-full -rotate-90 transform' viewBox='0 0 256 256'>
          <circle cx='128' cy='128' r={128} stroke='#E2E8F0' strokeWidth='8' fill='none' />
          <circle cx='128' cy='128' r={128} stroke='#10B981' strokeWidth='8' fill='none' strokeDasharray={circleCircumference} strokeDashoffset={strokeDashoffset} strokeLinecap='round' />
        </svg>
        <div className='absolute inset-0 flex items-center justify-center text-2xl'>{formatTime(timeLeft)}</div>
      </div>

      <div className='mt-4'>
        <button className='mr-2 rounded-lg bg-blue-500 px-4 py-2 text-white' onClick={handleStartPause}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button className='rounded-lg bg-gray-500 px-4 py-2 text-white' onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default TestPage
