import { AnimatePresence } from 'framer-motion'
import React, { memo, useCallback } from 'react'
import { ButtonOnlyIcon } from '../Buttons'
import { ArrowDown } from 'iconsax-react'

type TScrollToBottom = {
  showScrollToBottom: boolean
}

const ScrollToBottom: React.FC<TScrollToBottom> = ({ showScrollToBottom }) => {
  const handleScrollToBottom = useCallback(() => {
    const scrollableDiv = document.getElementById('scrollableDiv')
    if (scrollableDiv) {
      const start = scrollableDiv.scrollTop
      const end = scrollableDiv.scrollHeight - scrollableDiv.clientHeight
      const duration = 300 // Adjust this value to control the speed (lower = faster)
      const startTime = performance.now()

      const animateScroll = (currentTime: number) => {
        const elapsedTime = currentTime - startTime
        const progress = Math.min(elapsedTime / duration, 1)
        const easeInOutCubic = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

        scrollableDiv.scrollTop = start + (end - start) * easeInOutCubic

        if (progress < 1) {
          requestAnimationFrame(animateScroll)
        }
      }

      requestAnimationFrame(animateScroll)
    }
  }, [])

  return (
    <AnimatePresence>
      <ButtonOnlyIcon
        onClick={handleScrollToBottom}
        className={`absolute bottom-20 left-1/2 flex size-8 max-h-8 min-h-8 min-w-8 max-w-8 flex-shrink-0 -translate-x-1/2 transition-all duration-300 ${showScrollToBottom ? 'z-[100] translate-y-0 opacity-100' : 'translate-y-[200%]'} rounded-full bg-white p-2 text-primary-black shadow-lg`}
      >
        <ArrowDown className='size-4' />
      </ButtonOnlyIcon>
    </AnimatePresence>
  )
}

export default memo(ScrollToBottom)
