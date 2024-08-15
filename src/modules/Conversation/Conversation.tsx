import { Avatar } from '@nextui-org/react'
import { AnimatePresence, motion } from 'framer-motion'
import { AddCircle, ArrowDown, TickCircle } from 'iconsax-react'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'

import { ButtonOnlyIcon } from '@/components/Buttons'
import { typeOfMessage, typeOfSocket } from '@/constants'
import { useSocket } from '@/context/SocketProvider'
import { Message, MessageGroup, TConversationInfo, TInfoTyping } from '@/types'
import { formatLocalHoursTime, getLastSeenId, isStringWithoutEmoji } from '@/utils'
import MessageImage from './MessageImage'
import ImageFallback from '@/components/ImageFallback'

type ConversationProps = {
  conversation: MessageGroup[]
  conversationInfo: TConversationInfo | null
}

const Conversation: React.FC<ConversationProps> = ({ conversation, conversationInfo }) => {
  const socket: any = useSocket()
  const [infoTyping, setInfoTyping] = useState<TInfoTyping | null>(null)
  const [showScrollToBottom, setShowScrollToBottom] = useState<boolean>(false)

  const queryParams = new URLSearchParams(location.search)
  const currentId: any = Number(queryParams.get('currentId'))
  const worker_id = Number(queryParams.get('worker_id'))
  const isClient = !!worker_id

  const containerRef = useRef<HTMLDivElement>(null)
  const lastElementRef = useRef<HTMLDivElement>(null)

  const isAnotherUserTyping = infoTyping?.user_id === currentId

  const handleScrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' })
    }
    // call api seen here
  }

  const messageAnimation = useCallback(() => {
    return {
      initial: { x: -80, y: 40 },
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

  const shouldRenderIconStatus = (status: 'pending' | 'sent' | 'failed' | 'seen', display: boolean): React.ReactNode => {
    let tickIcon
    const avatar = isClient ? conversationInfo?.client_picture : conversationInfo?.worker_picture
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
      case 'seen':
        tickIcon = <Avatar src={avatar} alt={avatar} className={`size-4 max-h-4 max-w-4 duration-0 ${display ? 'opacity-100' : 'opacity-0'}`} />
        break

      default:
        break
    }

    return tickIcon
  }

  useEffect(() => {
    socket.on(typeOfSocket.MESSAGE_TYPING, (data: TInfoTyping) => {
      if (socket.id === data?.socket_id) return
      setInfoTyping(data)
    })
    return () => {
      socket.off(typeOfSocket.MESSAGE_TYPING)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        if (containerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = containerRef.current
          const distanceFromBottom = scrollHeight - (scrollTop + clientHeight)
          setShowScrollToBottom(distanceFromBottom > 200)
        }
      }
    }

    const refCurrent = containerRef.current
    if (refCurrent) {
      refCurrent.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (refCurrent) {
        refCurrent.removeEventListener('scroll', handleScroll)
      }
    }
  }, [containerRef])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'instant' })
    }
  }, [conversation, infoTyping, isAnotherUserTyping])

  useEffect(() => {
    let timer: any
    socket.on(typeOfSocket.MESSAGE_TYPING, (data: TInfoTyping) => {
      if (socket.id === data?.socket_id) return
      setInfoTyping(data)

      // Xóa timer cũ trước khi đặt timer mới
      clearTimeout(timer)
      timer = setTimeout(() => {
        setInfoTyping(null)
      }, 7000)
    })
    return () => {
      clearTimeout(timer)
      socket.off(typeOfSocket.MESSAGE_TYPING)
    }
  }, [])
  return (
    <div ref={containerRef} className={`flex min-h-[calc(100dvh-216px)] flex-1 flex-col gap-4 overflow-auto p-2`}>
      {conversation?.map((message, index) => {
        // last item in conversation
        const isLastItemInConversation = index === conversation.length - 1
        const isMe = message?.userId === currentId
        const isLastSeenMessageId = getLastSeenId(conversation?.[conversation.length - 1]?.messages)
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
                  const isLastMessage = item?.id === message?.messages?.[message?.messages?.length - 1]?.id

                  const isLastMesageByMe = isMe && isLastMessage && isLastItemInConversation
                  return (
                    <div key={`message-${item?.id}`} className='flex w-full items-end justify-between'>
                      <div
                        ref={conversation.length === index + 1 ? lastElementRef : undefined}
                        key={`message-${item?.id}`}
                        className={`flex w-full items-end ${isMe ? 'justify-end' : 'justify-start'} gap-0.5`}
                      >
                        {Number(item.type) === typeOfMessage.TEXT ? (
                          // only text
                          isStringWithoutEmoji(item.content) ? (
                            <motion.div
                              variants={item?.status === 'pending' ? messageAnimation() : { initial: { x: 0, y: 0 } }}
                              initial='initial'
                              animate='animate'
                              transition={{ duration: 0.2 }}
                              viewport={{ once: true }}
                              className={`max-w-[80%] rounded-lg border-1 p-3.5 ${isMe ? 'border-transparent bg-primary-light-blue' : 'border-primary-yellow bg-transparent'}`}
                            >
                              <pre className='font-inter break-words text-sm' style={{ whiteSpace: 'pre-wrap' }}>
                                {item?.content}
                              </pre>
                            </motion.div>
                          ) : (
                            <motion.div
                              variants={item?.status === 'pending' ? messageAnimation() : { initial: { x: 0, y: 0 } }}
                              initial='initial'
                              animate='animate'
                              transition={{ duration: 0.2 }}
                              viewport={{ once: true }}
                              className={`max-w-[80%] p-3.5`}
                            >
                              <pre className='font-inter scale-[2.5] break-words text-sm' style={{ whiteSpace: 'pre-wrap' }}>
                                {item?.content}
                              </pre>
                            </motion.div>
                          )
                        ) : (
                          <MessageImage key={`message-${item?.attachments?.[0]?.url}`} url={item?.attachments?.[0]?.url as string} />
                        )}
                        {/* {isMe && shouldRenderIconStatus(item?.status)} */}
                        {/* hiển thị seen cuối cùng trong messages[] */}
                        {isMe && shouldRenderIconStatus(item.status, !!isLastSeenMessageId && item.id === isLastSeenMessageId)}
                      </div>
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
      <AnimatePresence>
        <motion.div className='absolute bottom-20 left-1/2 -translate-x-1/2' initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
          <ButtonOnlyIcon
            onClick={handleScrollToBottom}
            className={`flex size-8 max-h-8 min-h-8 min-w-8 max-w-8 flex-shrink-0 rounded-full bg-white p-2 text-primary-black shadow-lg ${showScrollToBottom ? 'translate-y-0' : 'translate-y-20'}`}
          >
            <ArrowDown className='size-4' />
          </ButtonOnlyIcon>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default memo(Conversation)
