import Conversation from '@/modules/Conversation/Conversation'
import FooterInput from '@/modules/FooterInput/FooterInput'
import Header from '@/modules/Header/Header'
import instance from '@/services/axiosConfig'
import { Message } from '@/types'
import { useEffect, useState } from 'react'

const HomePage = () => {
  const orderId = 3310
  const worker_id = 429
  const user_id = 570

  const isWorker = true

  const [onFetchingMessage, setOnFetchingMessage] = useState<boolean>(false)
  const [converstaion, setConverstaion] = useState<Message[]>([])
  const [message, setMessage] = useState<string>('')

  const handleSend = () => {
    console.log({ message })
  }

  const handleGetMessage = async () => {
    try {
      const { data }: any = await instance.get(`/booking/conversations/${orderId}`, {
        params: {
          worker_id: 429
        }
      })

      setConverstaion(data)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetchingMessage(false)
    }
  }

  useEffect(() => {
    onFetchingMessage && handleGetMessage()
  }, [onFetchingMessage])

  useEffect(() => {
    setOnFetchingMessage(true)
  }, [])

  return (
    <div className={`relative flex h-dvh flex-col`}>
      <Header />
      <Conversation conversation={converstaion} />
      <FooterInput message={message} setMessage={setMessage} />
    </div>
  )
}

export default HomePage
