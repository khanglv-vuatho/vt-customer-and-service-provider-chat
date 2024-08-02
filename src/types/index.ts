import { SVGProps } from 'react'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export type RatingTabType = { name: string; timeHour: string; timeDate: string; star: number; thumbnail: string; description: string }

export type GroupedMessage = {
  username: string
  messages: MessageDetail[]
  time: number
}

export type MessageDetail = {
  username: string
  message: string
  time: number
  type: string
  emoji?: string
  messageId?: string
}

export type Avatar = {
  url: string
  storage: string
}

export type User = {
  id: number
  avatar: Avatar | null
  full_name: string
  profile_picture: string
}

export type Message = {
  attachments?: TImageData[]
  by: User
  id: number
  seen: any[]
  type: 0 | 1
  content: string
  created_at: number
  first?: boolean // Added field
  last?: boolean // Added field
  status: 'sent' | 'pending' | 'failed'
}

export type MessageGroup = {
  userId: number
  messages: Message[]
}
export type MessageProps = {
  message: string
}

export type TPostMessage = { message: string; data?: any }

export type TFetchMessageOfCline = { orderId: number; worker_id: number }

export type TPayloadHandleSendMessageApi = {
  content: string
  worker_id?: number
  attachment?: any
  type: 0 | 1
  socket_id: string
}

export type TSendMessage = {
  orderId: number
  payload: TPayloadHandleSendMessageApi
}
type TImageData = {
  url: string
  type: number
  storage: string
}

export type THandleSendMessage = MessageProps & { type?: 0 | 1; attachment?: any }
