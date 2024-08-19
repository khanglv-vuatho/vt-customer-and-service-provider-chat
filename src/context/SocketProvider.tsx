import ToastComponent from '@/components/ToastComponent'
import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = createContext({})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children, token }: { children: React.ReactNode; token: string }) => {
  const [socket, setSocket] = useState<any>(null)

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_WEBSOCKET_URL, {
      query: { token, platform: 'webview' },
      reconnection: true
    })

    setSocket(newSocket)

    const handleVisibilityChange = () => {
      newSocket.connect()
      ToastComponent({ type: 'error', message: window as any })
    }

    window.addEventListener('focus', handleVisibilityChange)

    return () => {
      newSocket.disconnect()
      window.removeEventListener('focus', handleVisibilityChange)
    }
  }, [token])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}
