import StatusOfMessage from '@/components/StatusOfMessage'
import { typeOfMessage, typeOfSocket } from '@/constants'
import { useSocket } from '@/context/SocketProvider'
import { MessageGroup, TConversationInfo, TInfoTyping } from '@/types'
import { formatLocalHoursTime } from '@/utils'

import { Avatar } from '@nextui-org/react'
import { motion } from 'framer-motion'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import useSound from 'use-sound'
import typingSound from '../../../public/typingSound.mp4'
import MessageImage from './MessageImage'

type ConversationProps = {
  conversation: MessageGroup[]
  conversationInfo: TConversationInfo | null
}

const Conversation: React.FC<ConversationProps> = ({ conversation, conversationInfo }) => {
  const socket: any = useSocket()

  const queryParams = new URLSearchParams(location.search)
  const currentId: any = Number(queryParams.get('currentId'))
  const worker_id = Number(queryParams.get('worker_id'))
  const isClient = !!worker_id

  const [infoTyping, setInfoTyping] = useState<TInfoTyping | null>(null)
  //store current message id when user click message

  const lastElementRef = useRef<HTMLDivElement>(null)
  const fristElementRef = useRef<HTMLDivElement>(null)

  const conversationClone = [...conversation]
  const conversationCloneReverse = [...conversationClone].reverse()

  const lastGroupInConversatioReverse = conversationCloneReverse?.[conversationCloneReverse?.length - 1]
  const lastMessageInLastGroupConversatioReverse = lastGroupInConversatioReverse?.messages?.[lastGroupInConversatioReverse?.messages?.length - 1]
  const [play] = useSound(typingSound)

  const isAnotherUserTyping = infoTyping?.user_id === currentId

  const messageAnimation = useCallback(() => {
    return {
      initial: { x: -80, y: 20 },
      animate: {
        x: 0,
        y: 0,
        transition: {
          x: { delay: 0.05, type: 'tween', duration: 0.05 },
          y: { duration: 0.1 }
        }
      }
    }
  }, [])

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
    let timer: any

    socket.on(typeOfSocket.MESSAGE_TYPING, (data: TInfoTyping) => {
      if (socket?.id === data?.socket_id) return
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

  useEffect(() => {
    if (isAnotherUserTyping && infoTyping?.is_typing) {
      play()
    }
  }, [infoTyping])

  // show status when last message in last group
  const handleCheckConditionsToShowStatsus = (id: number) => {
    return lastMessageInLastGroupConversatioReverse?.id === id
  }

  // show status when last message in last group is seen
  const handleGetLastMessageInLastGroup = (id: number) => {
    if (conversationCloneReverse?.length === 0 || !id) return { isCanShow: false, lastSeenMessage: null }
    const allMessages = conversationCloneReverse?.flatMap((group) => group?.messages)

    const lastMessage = allMessages?.[allMessages?.length - 1]

    // Filter out messages that have been seen
    const seenMessages = allMessages.filter((message) => message.status === 'seen')

    // Get the last message that has been seen
    const lastSeenMessage = seenMessages?.[seenMessages?.length - 1]

    if (lastSeenMessage?.id === lastMessage?.id) return { isCanShow: false, lastSeenMessage, lastMessage }

    return { isCanShow: seenMessages?.length > 0 ? lastSeenMessage?.id === id : false, lastSeenMessage, lastMessage }
  }
  console.log({ conversation })
  return (
    <>
      {infoTyping?.is_typing && (
        <div className='flex items-center gap-2'>
          <Avatar size='sm' src={conversationInfo?.profile_picture} />
          <motion.div className={`-mt-1 flex min-h-10 w-fit items-center gap-1 rounded-2xl bg-white px-2 text-primary-black`}>
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
        </div>
      )}
      {conversation?.map((message, index) => {
        // last item in conversation, but has received array conversation so need to get isFirstItemInConversation
        const isMe = message?.userId === currentId
        return (
          <div key={`message-${message?.userId}-${index}`} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
            <div className='flex w-full gap-2'>
              {!isMe && (
                <div className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
                  <Avatar size='sm' src={message?.messages?.[0]?.by?.profile_picture} />
                </div>
              )}
              <div className={`flex w-full flex-col gap-1 ${isMe ? 'items-end' : 'items-start'} `}>
                {message?.messages?.map((item, indexGroup) => {
                  // const isEmoji = !isStringWithoutEmoji(item?.content) && item?.content?.length === 2
                  const isShowStatsus = handleCheckConditionsToShowStatsus(item?.id)
                  const { isCanShow } = handleGetLastMessageInLastGroup(item?.id)
                  const isLastOrFristMessage = !!item?.first || !!item?.last
                  return (
                    <div key={item?.id} className={`flex w-full flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                      <div ref={conversation.length === index + 1 ? lastElementRef : undefined} key={`message-${item?.id}`} className='flex w-full items-end justify-between'>
                        <div ref={indexGroup === 0 && index === 0 ? fristElementRef : undefined} className={`flex w-full items-end ${isMe ? 'justify-end' : 'justify-start'} gap-0.5`}>
                          {Number(item?.type) === typeOfMessage.TEXT ? (
                            <motion.div
                              variants={item?.status === 'pending' ? messageAnimation() : { initial: { x: 0, y: 0 } }}
                              initial='initial'
                              animate='animate'
                              transition={{ duration: 0.2 }}
                              viewport={{ once: true }}
                              className={`max-w-[80%] rounded-2xl p-4 text-primary-black ${isMe ? (isClient ? 'bg-primary-yellow/80 text-primary-black' : 'bg-[#2367EC] text-white') : 'bg-white'}`}
                              style={
                                isMe
                                  ? {
                                      borderTopRightRadius: item?.first ? '16px' : '4px',
                                      borderBottomRightRadius: item?.last ? '16px' : '4px'
                                    }
                                  : {
                                      borderTopLeftRadius: item?.first ? '16px' : '4px',
                                      borderBottomLeftRadius: item?.last ? '16px' : '4px'
                                    }
                              }
                            >
                              <pre className={`font-inter break-words text-base ${isMe ? 'text-right' : 'text-left'}`} style={{ whiteSpace: 'pre-wrap' }}>
                                {item?.content}
                              </pre>
                              <div className={`mt-1 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <time className={`text-xs ${isMe ? (isClient ? 'text-primary-black' : 'text-white') : 'text-primary-gray'}`}>{formatLocalHoursTime(item?.created_at)}</time>
                              </div>
                            </motion.div>
                          ) : (
                            <MessageImage key={`message-${item?.attachments?.[0]?.url}`} url={item?.attachments?.[0]?.url as string} />
                          )}
                        </div>
                      </div>
                      {isMe && (isShowStatsus || isCanShow) && <StatusOfMessage status={item?.status} conversationInfo={conversationInfo} isClient={isClient} />}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default memo(Conversation)
