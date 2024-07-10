import { motion } from 'framer-motion'

import { Avatar } from '@nextui-org/react'
import { memo, useEffect, useMemo } from 'react'
import ImageFallback from '@/components/ImageFallback'
import { MessageDetail } from '@/types'

type ChatMessageProps = {
  id: string
  msg: MessageDetail
  index: number
  messageLength: number
  username: string
  infoTyping: {
    isTyping: boolean
    username: string
  }
}

const ChatMessage = ({ msg, index, id, messageLength, username, infoTyping }: ChatMessageProps) => {
  const isCurrentUser = id === username

  useEffect(() => {
    if (id === 'typing') console.log(id)
  }, [id])

  const isTyping = infoTyping.isTyping && !isCurrentUser && infoTyping.username === id
  if (!msg) return null

  const isLastMessage = index === messageLength - 1

  const messageAnimation = {
    initial: { opacity: 0, x: isCurrentUser ? -100 : 0, y: isCurrentUser ? 10 : 0 },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition:
        id === username
          ? {
              x: {
                delay: 0.1,
                type: 'tween',
                stiffness: 100
              },

              y: {
                duration: 0.1
              }
            }
          : {
              duration: 0.1
            }
    }
  }

  return (
    <div className={`flex items-end gap-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUser && <Avatar name='K' size='sm' className={`shrink-0 ${isLastMessage ? 'block' : 'opacity-0'}`} />}
      {msg.type === 'text' ? (
        <motion.div
          variants={messageAnimation}
          initial='initial'
          animate='animate'
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
          className={`max-w-[80%] break-words rounded-lg p-2 px-3 ${isCurrentUser ? 'bg-green-100' : 'relative bg-blue-100'}`}
        >
          {msg.message}
        </motion.div>
      ) : (
        <motion.div variants={messageAnimation} initial='initial' animate='animate' transition={{ duration: 0.3 }} viewport={{ once: true }} className={`max-w-[80%]`}>
          <ImageFallback src={msg.message} alt={msg.message} className='h-auto w-[200px] rounded-lg' />
        </motion.div>
      )}
      {/* {isTyping && isLastMessage ? <div className='h-3 w-3 rounded-full bg-green-600' /> : null} */}
    </div>
  )
}

export default memo(ChatMessage)
