import { SVGProps } from 'react'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export type RatingTabType = { name: string; timeHour: string; timeDate: string; star: number; thumbnail: string; description: string }

export type Message = {
  id: string
  message: string
  time: number
}

export type GroupedMessage = {
  id: string
  messages: string[]
  time: number
}
