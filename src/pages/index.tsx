import { fetchMessage, handlePostMessage } from '@/apis'
import ToastComponent from '@/components/ToastComponent'
import { typeOfRule, typeOfSocket } from '@/constants'
import ConverstaionsSkeleton from '@/modules/ConversationsSkeleton'
import { Message, MessageProps, THandleSendMessage, TPayloadHandleSendMessageApi } from '@/types'
import { groupConsecutiveMessages } from '@/utils'
import { lazy, memo, Suspense, useEffect, useState } from 'react'

const Header = lazy(() => import('@/modules/Header/Header'))
const FooterInput = lazy(() => import('@/modules/FooterInput/FooterInput'))
const Conversation = lazy(() => import('@/modules/Conversation/Conversation'))

import { useSocket } from '@/context/SocketProvider'

const HomePage = () => {
  const queryParams = new URLSearchParams(location.search)
  const [conversationInfo, setConversationInfo] = useState<any>(null)
  const socket: any = useSocket()

  const orderId = Number(queryParams.get('orderId'))
  const currentId = Number(queryParams.get('currentId'))
  const worker_id = Number(queryParams.get('worker_id'))

  const isClient = !!worker_id

  const [onFetchingMessage, setOnFetchingMessage] = useState<boolean>(false)
  const [isAnimateChat, setIsAnimateChat] = useState<boolean>(false)
  const [conversation, setConversation] = useState<Message[]>([])

  const handleSendMessage = async ({ message, type = 0, attachment }: THandleSendMessage) => {
    const newMessage: Message = {
      content: message,
      id: Date.now(),
      seen: [],
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
    if (attachment) {
      newMessage.attachments = [{ url: URL.createObjectURL(attachment) }] as any
    }

    console.log({ newMessage })
    setIsAnimateChat(true)
    setConversation((prevConversation) => [...prevConversation, newMessage])

    try {
      await handleSendMessageApi({ message, messageId: newMessage.id, type, attachment, socket_id: socket.id })
    } catch (error) {
      console.error(error)
    } finally {
      setIsAnimateChat(false)
    }
  }

  const handleSendMessageApi = async ({ message, messageId, type = 0, attachment, socket_id }: MessageProps & { messageId: number; type: 0 | 1; attachment?: any; socket_id: string }) => {
    try {
      const payload: TPayloadHandleSendMessageApi = isClient ? { content: message, worker_id, type, socket_id } : { content: message, type, socket_id }

      if (type === 1) {
        payload.attachment = attachment
      }

      await handlePostMessage({ orderId, payload, rule: isClient ? typeOfRule.CLIENT : typeOfRule.WORKER })
      setConversation((prevConversation) => prevConversation.map((msg) => (msg.id === messageId ? { ...msg, status: 'sent' } : msg)))
    } catch (error) {
      console.error(error)
      setConversation((prevConversation) => prevConversation.map((msg) => (msg.id === messageId ? { ...msg, status: 'failed' } : msg)))
    }
  }

  const handleGetMessage = async () => {
    try {
      const data = await fetchMessage({ orderId, ...(isClient && { worker_id }) })
      setConversationInfo(data)

      //transform data to add status sent for each message in conversation to render tickIcon
      const transformedData: Message[] = data?.data?.map((item: Message) => {
        return {
          ...item,
          status: 'sent'
        }
      })

      if (!data?.worker_id || !data?.order_id) {
        return ToastComponent({
          type: 'error',
          message: 'Lỗi mạng vui lòng kiểm tra lại'
        })
      }

      setConversation(transformedData)
    } catch (error) {
      console.error(error)
    } finally {
      setOnFetchingMessage(false)
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
    if (!conversationInfo) return

    console.log({ conversationInfo })

    socket.emit(typeOfSocket.JOIN_CONVERSATION_ROOM, { workerId: conversationInfo?.worker_id, orderId: conversationInfo?.order_id })

    socket.on(typeOfSocket.MESSAGE_ARRIVE, (data: any) => {
      if (data?.socket_id == socket?.id) return
      setConversation((prevConversation) => [...prevConversation, data?.message])
    })

    return () => {
      socket.emit(typeOfSocket.LEAVE_CONVERSATION_ROOM, { workerId: conversationInfo?.worker_id, orderId: conversationInfo?.order_id })
      socket.off(typeOfSocket.MESSAGE_ARRIVE)
    }
  }, [conversationInfo])

  return (
    <div className={`relative flex h-dvh flex-col`}>
      <Suspense fallback={null}>
        <Header workerId={conversationInfo?.worker_id} />
      </Suspense>
      <Suspense fallback={null}>{onFetchingMessage ? <ConverstaionsSkeleton /> : <Conversation isAnimateChat={isAnimateChat} conversation={groupConsecutiveMessages(conversation)} />}</Suspense>
      <Suspense fallback={null}>
        <FooterInput handleSendMessage={handleSendMessage} />
      </Suspense>
    </div>
  )
}

export default memo(HomePage)
