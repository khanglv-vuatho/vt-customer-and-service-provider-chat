import { fetchMessage, handlePostMessage } from '@/apis'
import ToastComponent from '@/components/ToastComponent'
import { typeOfRule, typeOfSocket } from '@/constants'
import ConverstaionsSkeleton from '@/modules/ConversationsSkeleton'
import { Message, TConversationInfo, THandleSendMessage, THandleSendMessageApi, TPayloadHandleSendMessageApi } from '@/types'
import { useVisibilityChange, useNetworkState } from '@uidotdev/usehooks'
import { groupConsecutiveMessages } from '@/utils'
import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useState } from 'react'

const Header = lazy(() => import('@/modules/Header/Header'))
const FooterInput = lazy(() => import('@/modules/FooterInput/FooterInput'))
const Conversation = lazy(() => import('@/modules/Conversation/Conversation'))

import { useSocket } from '@/context/SocketProvider'
import { CircularProgress } from '@nextui-org/react'

const HomePage = () => {
  const queryParams = new URLSearchParams(location.search)
  const socket: any = useSocket()
  const orderId = Number(queryParams.get('orderId'))
  const currentId = Number(queryParams.get('currentId'))
  const worker_id = Number(queryParams.get('worker_id'))

  const isClient = !!worker_id

  const [onFetchingMessage, setOnFetchingMessage] = useState<boolean>(false)
  const [conversation, setConversation] = useState<Message[]>([])
  const [conversationInfo, setConversationInfo] = useState<TConversationInfo | null>(null)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [onReloadMessage, setOnReloadMessage] = useState<boolean>(false)

  const groupedMessages = useMemo(() => groupConsecutiveMessages(conversation), [conversation])

  const documentVisible = useVisibilityChange()
  const network = useNetworkState()
  const handleSendMessage = useCallback(
    async ({ message, type = 0, attachment }: THandleSendMessage) => {
      // await handleGetMessage()
      const newMessage: Message = {
        content: message.trim(),
        // id: `${orderId}-${conversationInfo?.worker_id}-${conversation?.length}`,
        id: Date.now(),
        seen: null,
        type,
        by: {
          id: currentId,
          profile_picture: '',
          avatar: null,
          full_name: ''
        },
        created_at: Date.now(),
        status: 'pending'
      }

      console.log({ messageId: newMessage.id })

      // turn off typing
      socket.emit(typeOfSocket.MESSAGE_TYPING, {
        socketId: socket.id,
        message: '',
        orderId: conversationInfo?.order_id,
        workerId: conversationInfo?.worker_id,
        currentId
      })

      if (attachment) {
        newMessage.attachments = [{ url: URL.createObjectURL(attachment) }] as any
      }

      setConversation((prevConversation) => [...prevConversation, newMessage])

      try {
        await handleSendMessageApi({ message, messageId: newMessage.id, type, attachment, socket_id: socket.id })
      } catch (error) {
        console.error(error)
      }
    },
    [currentId, conversation, conversationInfo, socket]
  )

  const handleSendMessageApi = async ({ message, messageId, type = 0, attachment, socket_id }: THandleSendMessageApi) => {
    let timer
    try {
      const payload: TPayloadHandleSendMessageApi = isClient
        ? { content: message, worker_id, type, socket_id, conversationId: conversationInfo?.conversation_id as number, messageId }
        : { content: message, type, socket_id, conversationId: conversationInfo?.conversation_id as number, messageId }

      if (type === 1) {
        payload.attachment = attachment
      }

      setIsSendingMessage(true)
      await handlePostMessage({ orderId, payload, rule: isClient ? typeOfRule.CLIENT : typeOfRule.WORKER })
      clearTimeout(timer)

      setIsSendingMessage(false)

      setConversation((prevConversation) => prevConversation.map((msg) => (msg.id === messageId && msg.status !== typeOfSocket.SEEN ? { ...msg, status: 'sent' } : msg)))
    } catch (error) {
      console.error(error)
      setIsSendingMessage(false)
      setTimeout(() => {
        setConversation((prevConversation) => prevConversation.map((msg) => (msg.id === messageId ? { ...msg, status: 'failed' } : msg)))
      }, 300)
    }
  }

  const handleGetMessage = async () => {
    try {
      const data = await fetchMessage({ orderId, ...(isClient && { worker_id }) })

      setConversationInfo(data)

      if (!data?.worker_id || !data?.order_id) {
        return ToastComponent({
          type: 'error',
          message: 'Lỗi mạng vui lòng kiểm tra lại'
        })
      }

      setConversation(data?.data)
    } catch (error) {
      console.error(error)
    } finally {
      setOnFetchingMessage(false)
      setOnReloadMessage(false)
    }
  }

  useEffect(() => {
    if (onFetchingMessage) {
      handleGetMessage()
    }
  }, [onFetchingMessage])

  useEffect(() => {
    setOnFetchingMessage(true)
  }, [])

  useEffect(() => {
    if (!conversationInfo?.order_id || !conversationInfo?.worker_id || conversationInfo == null || network.online === false || documentVisible === false) return

    socket.emit(typeOfSocket.JOIN_CONVERSATION_ROOM, { workerId: conversationInfo?.worker_id, orderId: conversationInfo?.order_id })

    socket.on(typeOfSocket.MESSAGE_SEEN, (data: any) => {
      // seen all message in conversation when user get message
      if (data.status === 'SEEN MESSAGE') {
        console.log('123', data)
        setConversation((prev) =>
          prev.map((message) => ({
            ...message,
            status: 'seen'
          }))
        )
      } else {
        console.log('123123', data)
      }
    })

    socket.on(typeOfSocket.SEEN, (data: any) => {
      ToastComponent({ type: 'success', message: data?.data?.messageId })
      // setConversation((prevConversation) => prevConversation.map((msg) => (msg.id == data?.data?.messageId ? { ...msg, status: 'seen' } : msg)))
      setConversation((prev) =>
        prev.map((message) => ({
          ...message,
          status: 'seen'
        }))
      )
    })

    socket.on(typeOfSocket.MESSAGE_ARRIVE, (data: any) => {
      console.log({ data })
      if (data?.socket_id == socket?.id) {
        console.log({ data })
        console.log('chay vao day')
      } else {
        console.log({ data123: data })
        setConversation((prevConversation) => [...prevConversation, data?.message])
        socket.emit(typeOfSocket.SEEN, { messageId: data?.message?.id, conversationId: conversationInfo?.conversation_id, orderId: conversationInfo?.order_id, workerId: conversationInfo?.worker_id })
        console.log({ messageId: data?.message?.id, conversationId: conversationInfo?.conversation_id, orderId: conversationInfo?.order_id, workerId: conversationInfo?.worker_id })

        socket.emit(typeOfSocket.MESSAGE_SEEN, {
          workerId: conversationInfo?.worker_id,
          orderId: conversationInfo?.order_id,
          currentId,
          message_id: data?.message?.id,
          conversationId: conversationInfo?.conversation_id
        })
      }
    })

    return () => {
      socket.emit(typeOfSocket.LEAVE_CONVERSATION_ROOM, { workerId: conversationInfo?.worker_id, orderId: conversationInfo?.order_id })
      socket.off(typeOfSocket.MESSAGE_ARRIVE)
      socket.off(typeOfSocket.MESSAGE_SEEN)
      socket.off(typeOfSocket.SEEN)
    }
  }, [conversationInfo, conversation, socket])

  useEffect(() => {
    if (documentVisible) {
      setOnReloadMessage(true)
      const handleVisibilityChange = async () => {
        console.log({ workerId: conversationInfo?.worker_id, orderId: conversationInfo?.order_id })
        ToastComponent({ type: 'info', message: 'khang dep trai' })
        socket?.emit(typeOfSocket.JOIN_CONVERSATION_ROOM, { workerId: conversationInfo?.worker_id, orderId: conversationInfo?.order_id })
      }
      handleVisibilityChange()
    }
  }, [documentVisible, network])

  useEffect(() => {
    if (onFetchingMessage) return
    onReloadMessage && handleGetMessage()
  }, [onReloadMessage])

  return (
    <div className={`relative flex h-dvh flex-col`}>
      <Suspense fallback={null}>
        <Header workerId={Number(conversationInfo?.worker_id)} conversationInfo={conversationInfo} />
      </Suspense>
      <Suspense fallback={null}>{onFetchingMessage || onReloadMessage ? <ConverstaionsSkeleton /> : <Conversation conversation={groupedMessages} conversationInfo={conversationInfo} />}</Suspense>
      <Suspense fallback={null}>
        <FooterInput handleSendMessage={handleSendMessage} isSendingMessage={isSendingMessage} onFetchingMessage={onFetchingMessage} conversationInfo={conversationInfo} />
      </Suspense>
    </div>
  )
}

export default memo(HomePage)
