import { useEffect, useState } from 'react'
import Conversation from '@/modules/Conversation/Conversation'
import FooterInput from '@/modules/FooterInput/FooterInput'
import ConverstaionsSkeleton from '@/modules/ConversationsSkeleton'
import Header from '@/modules/Header/Header'
import instance from '@/services/axiosConfig'
import { Message, MessageProps } from '@/types'
import { groupConsecutiveMessages, handleAddLangInUrl } from '@/utils'
import { io } from 'socket.io-client'

const HomePage = () => {
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')
  const [conversationId, setConversationId] = useState<number>(0)

  const socket = io('192.168.1.22:7001', {
    transports: ['websocket'],
    forceNew: true,
    query: {
      token
    }
  })

  const orderId = Number(queryParams.get('orderId'))
  const currentId: any = Number(queryParams.get('currentId'))
  const worker_id: any = Number(queryParams.get('worker_id'))

  const isClient = !!worker_id

  const [onFetchingMessage, setOnFetchingMessage] = useState<boolean>(false)
  const [isAnimateChat, setIsAnimateChat] = useState<boolean>(false)
  const [conversation, setConversation] = useState<Message[]>([])

  const handleSendMessage = async ({ message }: MessageProps) => {
    if (message === '') return
    const newMessage: Message = {
      content: message,
      id: Date.now(),
      seen: [],
      type: 0,
      by: {
        id: currentId,
        profile_picture: '',
        avatar: null,
        full_name: ''
      },
      created_at: Date.now(),
      status: 'pending'
    }
    setIsAnimateChat(true)
    setConversation((prevConversation) => [...prevConversation, newMessage])

    try {
      await handleSendMessageApi({ message, messageId: newMessage.id })
    } catch (error) {
      console.error(error)
    }
  }

  const handleSendMessageApi = async ({ message, messageId }: MessageProps & { messageId: number }) => {
    try {
      const payload = isClient ? { content: message, worker_id } : { content: message }

      const endpoint = isClient ? `/webview/conversations/${orderId}` : `/webview-worker/conversations/${orderId}`

      await instance.post(endpoint, payload)
      setConversation((prevConversation) => prevConversation.map((msg) => (msg.id === messageId ? { ...msg, status: 'sent' } : msg)))
    } catch (error) {
      console.error(error)
      setConversation((prevConversation) => prevConversation.map((msg) => (msg.id === messageId ? { ...msg, status: 'failed' } : msg)))
    }
  }
  console.log({ conversation })

  const handleGetMessage = async () => {
    try {
      const { data }: any = isClient
        ? await instance.get(`/webview/conversations/${orderId}`, {
            params: {
              worker_id
            }
          })
        : await instance.get(`/webview-worker/conversations/${orderId}`)

      const transformedData: Message[] = data.data.map((item: Message) => {
        return {
          ...item,
          status: 'sent'
        }
      })

      setConversation(transformedData)
      setConversationId(data.conversation_id)
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

  // useEffect(() => {
  //   // socket.emit('joinRoom', { conversationId })
  //   // socket.emit(conversationId.toString(), {})
  //   // socket.on(`conversation-ii-${conversationId.toString()}`, (data: any) => {
  //   //   console.log(data)
  //   // })
  //   console.log(`self-khangdeptrai-${conversationId.toString()}`)
  //   socket.on(`self-khangdeptrai-${conversationId.toString()}`, (data: any) => {
  //     console.log('dasdasds')

  //     console.log(data)
  //   })
  //   return () => {
  //     socket.off('message')
  //   }
  // }, [conversation])

  return (
    <div className={`relative flex h-dvh flex-col`}>
      <Header />
      {location.href}
      {onFetchingMessage ? <ConverstaionsSkeleton /> : <Conversation isAnimateChat={isAnimateChat} conversation={groupConsecutiveMessages(conversation)} />}
      <FooterInput handleSendMessage={handleSendMessage} />
    </div>
  )
}

export default HomePage
