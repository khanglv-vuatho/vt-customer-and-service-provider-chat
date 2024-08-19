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
      reconnection: true,
      autoConnect: true
    })

    setSocket(newSocket)
    const handleConnectSocket = () => {
      newSocket.connect()
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && socket?.disconnected) {
        handleConnectSocket()
        ToastComponent({ type: 'error', message: 'newSocket.connect()' })
      }
    }

    document.addEventListener('visibilitychange', () => handleVisibilityChange())
    window.addEventListener('blur', () => handleVisibilityChange())
    window.addEventListener('focus', () => handleConnectSocket())

    return () => {
      newSocket.disconnect()
      ToastComponent({ type: 'error', message: 'newSocket.disconnect()' })
      document.removeEventListener('visibilitychange', () => handleVisibilityChange())
      window.removeEventListener('blur', () => handleVisibilityChange())
      window.addEventListener('focus', () => handleConnectSocket())
    }
  }, [token])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}
