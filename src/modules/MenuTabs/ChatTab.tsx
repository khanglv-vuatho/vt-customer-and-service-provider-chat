import { motion } from 'framer-motion'
import { ChangeEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import InputChat from './InputChat'
import { Avatar } from '@nextui-org/react'
import { groupMessages } from '@/utils'
import { useLocation } from 'react-router-dom'
import { io } from 'socket.io-client'
import ChatMessage from './ChatMessage'
import { MessageDetail } from '@/types'

const socket = io('192.168.1.23:3000')

const ChatTab = () => {
  const [conversation, setConversation] = useState<MessageDetail[]>([])
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
  const username = queryParams.get('username') || 'username' + Date.now()

  const grouped = useMemo(() => groupMessages(conversation), [conversation])

  const info = {
    room,
    username
  }

  const handleChangeUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0] as any
    if (file) {
      console.log(URL.createObjectURL(file))
      setFile(file)
      socket.emit('message', { ...info, message: URL.createObjectURL(file), type: 'image', messageId: Date.now().toString() })
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
    socket.emit('message', { ...info, message: message.trim(), type: 'text', messageId: Date.now().toString() })
    socket.emit('typing', { ...info, message: '' })

    setMessage('')
    inputRef?.current?.focus()
  }, [message])

  useEffect(() => {
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
    socket.on('reactEmoji', (data) => {
      console.log({ data })

      setConversation((prevConversation) => {
        const updatedConversation = prevConversation.map((item) => {
          if (item.messageId === data.messageId) {
            //exits emoji in message will toggle emoji
            if (item.emoji === data.emoji)
              return {
                ...item,
                emoji: ''
              }
            return {
              ...item,
              emoji: data?.emoji
            }
          }
          return item
        })
        return updatedConversation
      })
    })

    return () => {
      socket.off('message')
      socket.off('typing')
      socket.off('reactEmoji')
    }
  }, [])

  return (
    <div className='flex flex-1 flex-col overflow-hidden rounded-2xl bg-white'>
      <div ref={chatContainerRef} className='flex h-[calc(100dvh-400px)] flex-col gap-4 overflow-y-auto p-4'>
        {grouped.map((item, index) => {
          // if (item.type === 'typing') return
          return (
            <div key={index} className={`flex flex-col gap-1`}>
              {item.messages.map((msg, indexMsg) => (
                <ChatMessage
                  isLassItemInGroup={index === grouped?.length - 1}
                  infoTyping={infoTyping}
                  id={item.username}
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
