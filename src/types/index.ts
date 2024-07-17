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
