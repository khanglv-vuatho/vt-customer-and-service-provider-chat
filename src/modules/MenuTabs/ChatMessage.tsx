import { motion } from 'framer-motion'

import { MessageDetail } from '@/types'
import { Avatar, CircularProgress } from '@nextui-org/react'
import { useClickAway, useLongPress } from '@uidotdev/usehooks'
import { EmojiClickData } from 'emoji-picker-react'
import { lazy, memo, Suspense, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import ImageMessage from './ImageMessage'
const EmojiPicker = lazy(() => import('emoji-picker-react'))

const socket = io('192.168.1.23:3000')

type ChatMessageProps = {
  id: string
  msg: MessageDetail
  indexMsg: number
  isLassItemInGroup: boolean
  messageLength: number
  infoTyping: {
    isTyping: boolean
    username: string
  }
}

const ChatMessage = ({ msg, indexMsg, id, messageLength, infoTyping, isLassItemInGroup }: ChatMessageProps) => {
  const queryParams = new URLSearchParams(location.search)
  const room = queryParams.get('room')
  const username = queryParams.get('username') || 'username' + Date.now()
  console.log({ msg })

  const isCurrentUser = id === username

  const isTyping = infoTyping.isTyping

  const isLastMessage = indexMsg === messageLength - 1

  const isAnotherUserTyping = isTyping && isLassItemInGroup && isLastMessage
  const [isOpen, setIsOpen] = useState(false)
  const attrs = useLongPress(
    () => {
      setIsOpen(true)
    },
    {
      onFinish() {
        setIsOpen(true)
      },
      threshold: 300
    }
  )

  const ref = useClickAway(() => {
    setIsOpen(false)
  })

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

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setIsOpen(false)
    socket.emit('reactEmoji', { username, room, emoji: emojiData.emoji, messageId: msg.messageId })
  }

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
            {...attrs}
            variants={messageAnimation}
            initial='initial'
            animate='animate'
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className={`relative max-w-[80%] break-words rounded-lg p-2 px-3 ${isCurrentUser ? 'bg-green-100' : 'bg-blue-100'}`}
          >
            {msg.emoji && (
              <div onClick={() => console.log('asdssss')} className='absolute bottom-0 right-1 z-40 flex translate-y-1/2 scale-80 items-center justify-center rounded-full bg-slate-200 p-1 text-sm'>
                {msg.emoji}
              </div>
            )}
            <pre className='font-inter break-words' style={{ whiteSpace: 'pre-wrap' }}>
              {msg.message}
            </pre>
            {isOpen && (
              <div className={`absolute z-50 scale-75 ${isCurrentUser ? 'right-0' : 'left-0'}`} ref={ref as any}>
                <Suspense fallback={<CircularProgress className='w-5' />}>
                  <EmojiPicker onEmojiClick={handleEmojiClick} open={true} reactionsDefaultOpen={true} />
                </Suspense>
              </div>
            )}
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
          <motion.div className={`flex h-10 items-center gap-1 rounded-lg px-2 ${isAnotherUserTyping ? 'bg-blue-100' : 'bg-green-100'}`}>
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
