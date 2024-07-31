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
  by: User
  id: number
  seen: any[]
  type: number
  content: string
  created_at: number
  first?: boolean // Added field
  last?: boolean // Added field
  status: string
}

export type MessageGroup = {
  userId: number
  messages: Message[]
}
export type MessageProps = {
  message: string
}
export type TPostMessage = { message: string; data?: any }
