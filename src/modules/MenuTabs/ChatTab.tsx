import { motion } from 'framer-motion'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import InputChat from './InputChat'
import { Avatar } from '@nextui-org/react'
import { groupMessages } from '@/utils'

type TMessages = {
  id: string
  message: string
  time: number
}
const ChatTab = () => {
  const [conversation, setConversation] = useState<TMessages[]>([])
  const [message, setMessage] = useState('')

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const grouped = groupMessages(conversation)

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('first', e.target.value)
    setMessage(e.target.value)
  }

  const handleSendMessage = useCallback(() => {
    console.log({ message })
    if (message.trim() === '') return

    const newMessage: TMessages = {
      id: 'user',
      message,
      time: Date.now()
    }

    setConversation((prevConversation) => [...prevConversation, newMessage])
    setMessage('')
    inputRef?.current?.focus()

    // Simulate bot response after user message
    setTimeout(() => {
      const botResponse: TMessages = {
        id: 'bot',
        message: `Bot response to "${newMessage.message}"`,
        time: Date.now()
      }
      setConversation((prevConversation) => [...prevConversation, botResponse])
    }, 1000)
  }, [])

  useEffect(() => {
    // Scroll to bottom when new message is added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [conversation])

  return (
    <div className='flex flex-col overflow-hidden rounded-2xl bg-white'>
      <div ref={chatContainerRef} className='flex max-h-[400px] min-h-[400px] flex-col gap-4 overflow-y-auto px-4'>
        {grouped.map((item, index) => (
          <div key={index} className={`flex flex-col gap-1`}>
            {item.messages.map((msg, index) => (
              <ChatMessage id={item.id} messageLength={item?.messages?.length} index={index} key={index} msg={msg} />
            ))}
          </div>
        ))}
      </div>
      <InputChat handleChangeValue={handleChangeValue} handleSendMessage={handleSendMessage} ref={inputRef} message={message} />
    </div>
  )
}

const ChatMessage = ({ msg, index, id, messageLength }: { id: string; msg: string; index: number; messageLength: number }) => {
  return (
    <div className={`flex items-end gap-1 ${id === 'bot' ? 'justify-start' : 'justify-end'}`}>
      {id === 'bot' && <Avatar name='K' size='sm' className={`shrink-0 ${index === messageLength - 1 ? 'block' : 'opacity-0'}`} />}
      <motion.div
        initial={{ opacity: 0, x: id === 'bot' ? 0 : -100, y: id === 'bot' ? 0 : 10 }}
        animate={{
          opacity: 1,
          x: 0,
          y: 0,
          transition:
            id === 'bot'
              ? {
                  duration: 0.1
                }
              : {
                  x: {
                    delay: 0.1,
                    type: 'tween',
                    stiffness: 100
                  },

                  y: {
                    duration: 0.1
                  }
                }
        }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className={`max-w-[80%] break-words rounded-lg p-2 px-3 ${id === 'bot' ? 'relative bg-blue-100' : 'bg-green-100'}`}
      >
        {msg}
      </motion.div>
    </div>
  )
}

export default ChatTab
