import { Avatar, user } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { AddCircle, TickCircle } from 'iconsax-react'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'

import { typeOfMessage, typeOfSocket } from '@/constants'
import { MessageGroup } from '@/types'
import { formatLocalHoursTime } from '@/utils'
import MessageImage from './MessageImage'
import { useSocket } from '@/context/SocketProvider'
import ToastComponent from '@/components/ToastComponent'

type ConversationProps = {
  conversation: MessageGroup[]
}

type TInfoTyping = {
  is_typing: boolean
  user_id: number
  socket_id: string
}
const Conversation: React.FC<ConversationProps> = ({ conversation }) => {
  const socket: any = useSocket()
  const [infoTyping, setInfoTyping] = useState<TInfoTyping | null>(null)

  const queryParams = new URLSearchParams(location.search)
  const currentId: any = Number(queryParams.get('currentId'))

  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const lastElementRef = useRef<HTMLDivElement>(null)

  const isAnotherUserTyping = infoTyping?.user_id === currentId

  const messageAnimation = useCallback(() => {
    return {
      initial: { x: -80, y: 10 },
      animate: {
        x: 0,
        y: 0,
        transition: {
          x: { delay: 0.1, type: 'tween', duration: 0.1 },
          y: { duration: 0.1 }
        }
      }
    }
  }, [])

  const shouldRenderIconStatus = (status: 'pending' | 'sent' | 'failed'): React.ReactNode => {
    let tickIcon
    switch (status) {
      case 'pending':
        tickIcon = <div className='size-4 rounded-full ring-1 ring-inset ring-primary-blue transition' />
        break
      case 'sent':
        tickIcon = <TickCircle className='size-4 text-primary-blue transition' />
        break
      case 'failed':
        tickIcon = <AddCircle className='size-4 rotate-45 text-primary-red transition' />
        break

      default:
        break
    }

    return tickIcon
  }

  useEffect(() => {
    if (lastElementRef.current) {
      lastElementRef.current.scrollIntoView({ behavior: 'instant' })
      const lastElementHeight = lastElementRef.current.offsetHeight
      console.log({ lastElementHeight })
    }
  }, [bottomRef, conversation, conversation.length, infoTyping, lastElementRef])

  useEffect(() => {
    socket.on(typeOfSocket.MESSAGE_TYPING, (data: TInfoTyping) => {
      if (socket.id === data?.socket_id) return
      setInfoTyping(data)
      setTimeout(() => {
        setInfoTyping(null)
      }, 7000)
    })
  }, [])

  return (
    <div ref={containerRef} className={`flex min-h-[calc(100dvh-216px)] flex-1 flex-col gap-4 overflow-auto px-4 py-3 pb-0`}>
      {conversation?.map((message, index) => {
        const isMe = message?.userId === currentId
        return (
          <div key={`message-${message?.userId}-${index}`} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
            <div className='flex w-full flex-col gap-1'>
              {!isMe && (
                <div className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
                  <Avatar size='sm' src={message?.messages?.[0]?.by?.profile_picture} />
                  <time className='text-xs text-primary-gray'>{formatLocalHoursTime(message?.messages?.[0]?.created_at)}</time>
                </div>
              )}
              <div className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'} `}>
                {message?.messages?.map((item) => {
                  return (
                    <div
                      ref={conversation.length === index + 1 ? lastElementRef : undefined}
                      key={`message-${item?.id}`}
                      className={`flex w-full items-end ${isMe ? 'justify-end' : 'justify-start'} gap-0.5`}
                    >
                      {Number(item.type) === typeOfMessage.TEXT ? (
                        <motion.div
                          variants={item?.status === 'pending' ? messageAnimation() : { initial: { x: 0, y: 0 } }}
                          initial='initial'
                          animate='animate'
                          transition={{ duration: 0.3 }}
                          viewport={{ once: true }}
                          className={`max-w-[80%] rounded-lg border-1 p-3.5 ${isMe ? 'border-transparent bg-primary-light-blue' : 'border-primary-yellow bg-transparent'}`}
                        >
                          <pre className='font-inter break-words text-sm' style={{ whiteSpace: 'pre-wrap' }}>
                            {item?.content}
                          </pre>
                        </motion.div>
                      ) : (
                        <MessageImage key={`message-${item?.attachments?.[0]?.url}`} url={item?.attachments?.[0]?.url as string} />
                      )}
                      {isMe && shouldRenderIconStatus(item?.status)}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
      {infoTyping?.is_typing && (
        <motion.div
          className={`-mt-3 flex min-h-10 w-fit items-center gap-1 rounded-lg border-1 px-2 ${isAnotherUserTyping ? 'border-transparent bg-primary-light-blue' : 'border-primary-yellow bg-transparent'}`}
        >
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <motion.div
                key={index}
                className='h-1.5 w-1.5 rounded-full bg-primary-black/40'
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
      )}
      <div ref={bottomRef} /> {/* Bottom reference for auto-scrolling */}
    </div>
  )
}

export default memo(Conversation)
