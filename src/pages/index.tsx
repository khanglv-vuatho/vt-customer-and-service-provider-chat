import { useEffect, useState } from 'react'
import Conversation from '@/modules/Conversation/Conversation'
import FooterInput from '@/modules/FooterInput/FooterInput'
import ConverstaionsSkeleton from '@/modules/ConversationsSkeleton'
import Header from '@/modules/Header/Header'
import instance from '@/services/axiosConfig'
import { Message, MessageProps } from '@/types'
import { groupConsecutiveMessages, handleAddLangInUrl } from '@/utils'
import { useLocation } from 'react-router-dom'

const HomePage = () => {
  const queryParams = new URLSearchParams(location.search)

  const orderId = Number(queryParams.get('orderId'))
  const currentId: any = Number(queryParams.get('currentId'))
  const worker_id: any = Number(queryParams.get('worker_id'))

  const isClient = !!worker_id

  console.log({ isClient })

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
      await handleSendMessageApi({ message })
      setConversation((prevConversation) => prevConversation.map((msg) => (msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg)))
    } catch (error) {
      console.error(error)
    }
  }

  const handleSendMessageApi = async ({ message }: MessageProps) => {
    try {
      const payload = isClient ? { content: message, worker_id } : { content: message }

      const endpoint = isClient ? `/booking/conversations/${orderId}` : `/booking-worker/conversations/${orderId}`

      const { data } = await instance.post(endpoint, payload)

      console.log({ data })
    } catch (error) {
      console.error(error)
    }
  }

  const handleGetMessage = async () => {
    try {
      const { data }: any = isClient
        ? await instance.get(`/booking/conversations/${orderId}`, {
            params: {
              worker_id
            }
          })
        : await instance.get(`/booking-worker/conversations/${orderId}`)
      setConversation(data)
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
