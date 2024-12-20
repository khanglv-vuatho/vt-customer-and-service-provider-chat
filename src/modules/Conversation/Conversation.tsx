import StatusOfMessage from '@/components/StatusOfMessage'
import { typeOfMessage, typeOfSocket } from '@/constants'
import { useSocket } from '@/context/SocketProvider'
import { Message, MessageGroup, TConversationInfo, TInfoTyping } from '@/types'
import { formatLocalHoursTime, getLastSeenMessage } from '@/utils'

import { Avatar } from '@nextui-org/react'
import { motion } from 'framer-motion'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import useSound from 'use-sound'
import typingSound from '../../../public/typingSound.mp4'
import MessageImage from './MessageImage'
import { Warning2 } from 'iconsax-react'

type ConversationProps = {
  conversation: MessageGroup[]
  conversationInfo: TConversationInfo | null
  handleScrollToBottom: () => void
}

const Conversation: React.FC<ConversationProps> = ({ conversation, conversationInfo, handleScrollToBottom }) => {
  const socket: any = useSocket()
  console.log({ conversation })
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

  const lastGroupInConversation = conversationClone?.[conversationClone?.length - 1]
  const lastMessageInLastGroupConversation = lastGroupInConversation?.messages?.[lastGroupInConversation?.messages?.length - 1]

  const lastMessageByMeInGroup = conversationCloneReverse.find((group) => group?.messages?.some((message) => message?.by?.id === currentId))
  const lastItemMessageByMeInGroup = lastMessageByMeInGroup?.messages?.[lastMessageByMeInGroup?.messages?.length - 1]
  const lastSeenMessage = getLastSeenMessage(conversationClone)

  const lastGroupInConversationReverse = conversationCloneReverse?.[conversationCloneReverse?.length - 1]
  const lastMessageInLastGroupConversatioReverse = lastGroupInConversationReverse?.messages?.[lastGroupInConversationReverse?.messages?.length - 1]
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
      handleScrollToBottom()
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
      handleScrollToBottom()
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
    handleScrollToBottom()
  }, [infoTyping])

  // show status when last message in last group

  console.log({ lastItemMessageByMeInGroup, lastSeenMessage, lastMessageInLastGroupConversation })
  const handleCheckConditionsToShowStatsus = (id: number) => {
    // return lastMessageInLastGroupConversatioReverse?.id === id
    const lastMessageInLastGroupConversationByMe = lastMessageInLastGroupConversation?.by?.id === currentId
    return lastMessageInLastGroupConversation?.id === id && lastMessageInLastGroupConversationByMe
    return (
      (lastMessageInLastGroupConversation?.id === id || lastItemMessageByMeInGroup?.id === id || (lastSeenMessage?.id === id && lastItemMessageByMeInGroup?.status !== 'seen')) &&
      lastMessageInLastGroupConversationByMe
    )
  }

  // show status when last message in last group is seen
  const handleGetLastMessageInLastGroup = (id: number) => {
    if (conversationCloneReverse?.length === 0 || !id) return { isCanShow: false, lastSeenMessage: null }
    const allMessages = conversationCloneReverse?.flatMap((group) => group?.messages)

    const lastMessage = allMessages?.[allMessages?.length - 1]

    // Filter out messages that have been seen
    const seenMessages = allMessages.filter((message) => message?.status === 'seen')

    // Get the last message that has been seen
    const lastSeenMessage = seenMessages?.[seenMessages?.length - 1]

    if (lastSeenMessage?.id === lastMessage?.id) return { isCanShow: false, lastSeenMessage, lastMessage }

    return { isCanShow: seenMessages?.length > 0 ? lastSeenMessage?.id === id : false, lastSeenMessage, lastMessage }
  }

  const renderMessageUI = (item: Message, isMe: boolean) => {
    switch (Number(item?.type)) {
      case typeOfMessage.TEXT:
        return (
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
        )

      case typeOfMessage.IMAGE:
        return <MessageImage key={`message-${item?.attachments?.[0]?.url}`} url={item?.attachments?.[0]?.url as string} />

      case typeOfMessage.WARNING:
        return (
          <div className='flex w-full flex-col gap-2 rounded-lg border border-primary-yellow bg-primary-yellow/10 p-2 px-3 shadow-sm'>
            <div className='flex items-center gap-2'>
              <Warning2 variant='Bold' color='#FFC107' />
              <p className='font-bold text-primary-yellow'>Đây là cảnh báo từ hệ thống!</p>
            </div>
            <pre className={`font-inter break-words text-center text-base`} style={{ whiteSpace: 'pre-wrap' }}>
              {item?.content}
            </pre>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      {conversation?.map((message, index) => {
        // last item in conversation, but has received array conversation so need to get isFirstItemInConversation
        const isMe = message?.userId === currentId
        const isWarning = message.messages.some((item) => item.type === typeOfMessage.WARNING)
        if (message.messages.length === 0) return
        return (
          <div key={`message-${message?.userId}-${index}`} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
            <div className='flex w-full gap-2'>
              {!isMe && !isWarning && (
                <div className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
                  <Avatar size='sm' src={message?.messages?.[0]?.by?.profile_picture} />
                </div>
              )}
              <div className={`flex w-full flex-col gap-1 ${isMe ? 'items-end' : 'items-start'} `}>
                {message?.messages?.map((item, indexGroup) => {
                  // const isEmoji = !isStringWithoutEmoji(item?.content) && item?.content?.length === 2
                  const isShowStatsus = handleCheckConditionsToShowStatsus(item?.id)
                  const { isCanShow } = handleGetLastMessageInLastGroup(item?.id)
                  return (
                    <div key={item?.id} className={`flex w-full flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                      <div ref={conversation.length === index + 1 ? lastElementRef : undefined} key={`message-${item?.id}`} className='flex w-full items-end justify-between'>
                        <div ref={indexGroup === 0 && index === 0 ? fristElementRef : undefined} className={`flex w-full items-end ${isMe ? 'justify-end' : 'justify-start'} gap-0.5`}>
                          {renderMessageUI(item, isMe)}
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
      {infoTyping?.is_typing && (
        <div className='mt-2 flex items-center gap-2'>
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
    </>
  )
}

export default memo(Conversation)
