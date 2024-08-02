import { lazy, memo, Suspense, useEffect, useState } from 'react'
import ConverstaionsSkeleton from '@/modules/ConversationsSkeleton'
// import Header from '@/modules/Header/Header'
const Header = lazy(() => import('@/modules/Header/Header'))
const FooterInput = lazy(() => import('@/modules/FooterInput/FooterInput'))
const Conversation = lazy(() => import('@/modules/Conversation/Conversation'))
import { Message, MessageProps, THandleSendMessage, TPayloadHandleSendMessageApi } from '@/types'
import { groupConsecutiveMessages } from '@/utils'
import { fetchMessageOfCline, fetchMessageOfWorker, sendMessageOfClient, sendMessageOfWorker } from '@/apis'
import ToastComponent from '@/components/ToastComponent'
import socket from '@/socket'

const HomePage = () => {
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token') as string

  const orderId = Number(queryParams.get('orderId'))
  const currentId: any = Number(queryParams.get('currentId'))
  const worker_id: any = Number(queryParams.get('worker_id'))

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
      await handleSendMessageApi({ message, messageId: newMessage.id, type, attachment })
    } catch (error) {
      console.error(error)
    }
  }

  const handleSendMessageApi = async ({ message, messageId, type = 0, attachment }: MessageProps & { messageId: number; type: 0 | 1; attachment?: any }) => {
    try {
      const payload: TPayloadHandleSendMessageApi = isClient ? { content: message, worker_id, type } : { content: message, type }

      if (type === 1) {
        payload.attachment = attachment
      }

      isClient ? await sendMessageOfClient({ orderId, payload }) : await sendMessageOfWorker({ orderId, payload })
      setConversation((prevConversation) => prevConversation.map((msg) => (msg.id === messageId ? { ...msg, status: 'sent' } : msg)))
    } catch (error) {
      console.error(error)
      setConversation((prevConversation) => prevConversation.map((msg) => (msg.id === messageId ? { ...msg, status: 'failed' } : msg)))
    }
  }

  const handleGetMessage = async () => {
    try {
      const data = isClient ? await fetchMessageOfCline({ orderId, worker_id }) : await fetchMessageOfWorker({ orderId })
      //transform data to add status sent for each message in conversation to render tickIcon
      const transformedData: Message[] = data.data.map((item: Message) => {
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

      socket(token).emit('conversation', { workerId: data?.worker_id, orderId: data?.order_id })
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
    const socketInstance = socket(token)

    socketInstance.on('conversation', (data) => {
      console.log({ data1123: data })
    })

    return () => {
      socketInstance.off('conversation')
    }
  }, [socket, token])

  return (
    <div className={`relative flex h-dvh flex-col`}>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <Suspense fallback={null}>{onFetchingMessage ? <ConverstaionsSkeleton /> : <Conversation isAnimateChat={isAnimateChat} conversation={groupConsecutiveMessages(conversation)} />}</Suspense>
      <Suspense fallback={null}>
        <FooterInput handleSendMessage={handleSendMessage} />
      </Suspense>
    </div>
  )
}

export default memo(HomePage)
