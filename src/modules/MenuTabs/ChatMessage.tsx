import { motion } from 'framer-motion'

import { MessageDetail } from '@/types'
import { Avatar } from '@nextui-org/react'
import { memo, useMemo } from 'react'
import ImageMessage from './ImageMessage'

type ChatMessageProps = {
  id: string
  msg: MessageDetail
  indexMsg: number
  isLassItemInGroup: boolean
  messageLength: number
  username: string
  infoTyping: {
    isTyping: boolean
    username: string
  }
}

const ChatMessage = ({ msg, indexMsg, id, messageLength, username, infoTyping, isLassItemInGroup }: ChatMessageProps) => {
  const isCurrentUser = id === username

  const isTyping = infoTyping.isTyping

  const isLastMessage = indexMsg === messageLength - 1

  const isAnotherUserTyping = isTyping && isLassItemInGroup && isLastMessage

  const messageAnimation = useMemo(() => {
    return {
      initial: { x: isCurrentUser ? -80 : 0, y: 10 },
      animate: {
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
  }, [isCurrentUser])

  // if (!msg) return null

  return (
    <>
      <div className={`flex items-end gap-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        {!isCurrentUser && (
          <motion.div
            initial={{
              y: isLastMessage ? 5 : 0
            }}
            animate={{
              y: 0
            }}
            transition={{
              duration: 0.1,
              ease: 'easeInOut',
              type: 'spring'
            }}
            viewport={{ once: true }}
            className={`shrink-0 ${isLastMessage ? 'opacity-100' : 'opacity-0'}`}
          >
            <Avatar name='K' size='sm' className={`shrink-0 ${isAnotherUserTyping ? 'opacity-0' : 'opacity-100'}`} />
          </motion.div>
        )}
        {msg.type === 'text' ? (
          <motion.div
            variants={messageAnimation}
            initial='initial'
            animate='animate'
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className={`max-w-[80%] break-words rounded-lg p-2 px-3 ${isCurrentUser ? 'bg-green-100' : 'relative bg-blue-100'}`}
          >
            <pre className='font-inter break-words' style={{ whiteSpace: 'pre-wrap' }}>
              {msg.message}
            </pre>
          </motion.div>
        ) : (
          <ImageMessage messageAnimation={messageAnimation} msg={msg} />
        )}
      </div>
      {isAnotherUserTyping && (
        <div className={`flex items-end ${!isCurrentUser ? 'justify-start' : ''} gap-1`}>
          <div className='flex items-center gap-1'>
            <motion.div
              initial={{
                y: isLastMessage ? 5 : 0
              }}
              animate={{
                y: 0
              }}
              transition={{
                duration: 0.1,
                ease: 'easeInOut',
                type: 'spring'
              }}
              viewport={{ once: true }}
              className={`block shrink-0`}
            >
              <Avatar name='K' size='sm' className={`shrink-0`} />
            </motion.div>
          </div>
          <motion.div className={`flex h-10 items-center gap-1 rounded-lg px-2 ${isCurrentUser ? 'bg-green-100' : 'bg-blue-100'}`}>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <motion.div
                  key={index}
                  className='h-1.5 w-1.5 rounded-full bg-primary-black'
                  animate={{
                    y: [0, -4, 0],
                    transition: {
                      delay: index * 0.1,
                      duration: 0.3,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatDelay: 1
                    }
                  }}
                />
              ))}
          </motion.div>
        </div>
      )}
    </>
  )
}

export default memo(ChatMessage)
