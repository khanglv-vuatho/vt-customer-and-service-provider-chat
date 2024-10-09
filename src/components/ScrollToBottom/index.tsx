import { AnimatePresence } from 'framer-motion'
import React, { memo } from 'react'
import { ButtonOnlyIcon } from '../Buttons'
import { ArrowDown } from 'iconsax-react'

type TScrollToBottom = {
  showScrollToBottom: boolean
}

const ScrollToBottom: React.FC<TScrollToBottom> = ({ showScrollToBottom }) => {
  return (
    <AnimatePresence>
      <ButtonOnlyIcon
        onClick={() => {
          const scrollableDiv = document.getElementById('scrollableDiv')
          scrollableDiv?.scrollTo({
            top: scrollableDiv.scrollHeight,
            behavior: 'smooth'
          })
        }}
        className={`absolute bottom-20 left-1/2 flex size-8 max-h-8 min-h-8 min-w-8 max-w-8 flex-shrink-0 -translate-x-1/2 transition-all duration-300 ${showScrollToBottom ? 'z-[100] translate-y-0 opacity-100' : 'translate-y-[200%]'} rounded-full bg-white p-2 text-primary-black shadow-lg`}
      >
        <ArrowDown className='size-4' />
      </ButtonOnlyIcon>
    </AnimatePresence>
  )
}

export default memo(ScrollToBottom)
