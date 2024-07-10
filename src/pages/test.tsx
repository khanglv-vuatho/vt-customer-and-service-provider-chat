import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { io } from 'socket.io-client'

const socket = io('192.168.1.19:3000')

function App() {
  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState<any[]>([])

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const room = queryParams.get('room')
  const username = queryParams.get('username')

  const info = {
    room,
    username
  }

  useEffect(() => {
    if (!room) return
    socket.emit('joinRoom', info)

    socket.on('message', (msg) => {
      console.log({ msg })
      setConversation((prevConversation) => [...prevConversation, msg])
    })

    return () => {
      socket.off('message')
    }
  }, [])

  const sendMessage = () => {
    if (message !== '' && room !== '') {
      socket.emit('message', { ...info, message })
      setMessage('')
    }
  }

  return (
    <div>
      <h1>Chat Room: {room}</h1>
      <div>
        <input type='text' placeholder='Message' value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send Message</button>
      </div>
      <div>
        <h2>Messages:</h2>
        {conversation.map((msg, index) => (
          <p key={index}>
            {msg.id}:{msg.message}
          </p>
        ))}
      </div>
    </div>
  )
}

export default App
