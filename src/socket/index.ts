import { io } from 'socket.io-client'

const socket = (token: string) => {
  return io('192.168.1.10:7001', {
    transports: ['websocket'],
    forceNew: true,
    query: {
      token
    }
  })
}

export default socket
