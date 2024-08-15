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

    return () => {
      newSocket.disconnect()
    }
  }, [token])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}
