import { motion } from 'framer-motion'
import { ChangeEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import InputChat from './InputChat'
import { Avatar } from '@nextui-org/react'
import { groupMessages } from '@/utils'
import { useLocation } from 'react-router-dom'
import { io } from 'socket.io-client'
import ChatMessage from './ChatMessage'

const socket = io('192.168.1.25:3000')

type TMessages = {
  id: string
  message: string
  time: number
  type: string
}

const ChatTab = () => {
  const [conversation, setConversation] = useState<TMessages[]>([])
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<any>('')
  const [infoTyping, setInfoTyping] = useState<{ isTyping: boolean; username: string }>({
    isTyping: false,
    username: ''
  })

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const room = queryParams.get('room')
  const username = queryParams.get('username') || 'username'

  const grouped = groupMessages(conversation)

  const info = {
    room,
    username
  }

  const handleChangeUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0] as any
    if (file) {
      console.log(URL.createObjectURL(file))
      setFile(file)
      socket.emit('message', { ...info, message: URL.createObjectURL(file), type: 'image' })
    }

    e.target.value = ''
  }

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMessage(value)
    if (value.trim() === '') {
      socket.emit('typing', { ...info, message: '' })
    } else {
      socket.emit('typing', { ...info, message: value })
    }
  }

  const handleSendMessage = useCallback(() => {
    if (message.trim() === '') return
    socket.emit('message', { ...info, message: message.trim(), type: 'text' })
    socket.emit('typing', { ...info, message: '' })

    setMessage('')
    inputRef?.current?.focus()
  }, [message])

  useEffect(() => {
    // Scroll to bottom when new message is added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [conversation, infoTyping])

  useEffect(() => {
    if (!room) return
    socket.emit('joinRoom', info)

    socket.on('message', (msg) => {
      setConversation((prevConversation) => {
        return [...prevConversation, msg]
      })
    })

    socket.on('typing', (data) => {
      setInfoTyping(data)
    })

    return () => {
      socket.off('message')
      socket.off('typing')
    }
  }, [])

  return (
    <div className='flex flex-1 flex-col overflow-hidden rounded-2xl bg-white'>
      <div ref={chatContainerRef} className='flex h-[calc(100dvh-380px)] flex-col gap-4 overflow-y-auto p-4'>
        {grouped.map((item, index) => {
          if (item.type === 'typing') return
          return (
            <div key={index} className={`flex flex-col gap-1`}>
              {item.messages.map((msg, indexMsg) => (
                <ChatMessage
                  isLassItemInGroup={index === grouped?.length - 1}
                  infoTyping={infoTyping}
                  username={username}
                  id={item.id}
                  messageLength={item?.messages?.length}
                  indexMsg={indexMsg}
                  key={indexMsg}
                  msg={msg}
                />
              ))}
            </div>
          )
        })}
        <div ref={bottomRef} className='hidden' />
      </div>
      <InputChat file={file} handleChangeUpload={handleChangeUpload} handleChangeValue={handleChangeValue} handleSendMessage={handleSendMessage} ref={inputRef} message={message} />
    </div>
  )
}

export default memo(ChatTab)
