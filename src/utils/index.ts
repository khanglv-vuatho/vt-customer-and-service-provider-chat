import ToastComponent from '@/components/ToastComponent'
import { Message, MessageGroup, TPostMessage } from '@/types'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
const useUnfocusItem = (callback: () => void, exclusionRef?: React.RefObject<HTMLElement | null>): React.RefObject<any> => {
  const itemRef = useRef<any>(null)

  useEffect(() => {
    const handleBlur = (event: Event) => {
      const clickedOutside = itemRef.current && !itemRef.current.contains(event.target as Node)

      const clickedOnExclusion = exclusionRef && exclusionRef.current && exclusionRef.current.contains(event.target as Node)

      if (clickedOutside && !clickedOnExclusion) {
        callback()
      }
    }

    document.addEventListener('click', handleBlur)

    return () => {
      document.removeEventListener('click', handleBlur)
    }
  }, [callback, exclusionRef])

  return itemRef
}

function capitalizeWords(string: string) {
  if (!string) return ''
  return string
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const handler: any = useRef(null)

  useEffect(() => {
    // Clear the timeout if value changes (cleanup function)
    if (handler.current) {
      clearTimeout(handler.current)
    }

    // Set the timeout to update debouncedValue after the specified delay
    handler.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup function to clear timeout if component unmounts or value changes
    return () => {
      if (handler.current) {
        clearTimeout(handler.current)
      }
    }
  }, [value, delay])

  return debouncedValue
}

const handleAddLangInUrl = ({ mainUrl, lang, token }: { mainUrl: string; lang: string; token: string }) => {
  return `${mainUrl}&lang=${lang}&token=${token}`
}

const formatLocalTime = (time: string) => {
  const utcMoment = moment.utc(time, 'HH:mm:ss')
  const localTime = utcMoment.local().format('HH:mm:ss')
  return localTime
}

const formatDDMMYYYY = (time: string) => {
  return moment(time).format('DD/MM/YYYY')
}

const formatLocalHoursTime = (time: number) => {
  const utcDate = moment.utc(time)

  // Convert the UTC date to local time
  const localDate = utcDate.local()

  // Format the local date to hh:mm format
  return localDate.format('HH:mm')
}

const formatTimestamp = (timestamp: number) => {
  // Chuyển đổi timestamp sang đối tượng Date
  const date = new Date(timestamp)

  // Lấy thời gian local dạng chuỗi
  const localDateString = date.toLocaleString()

  return localDateString
}

const postMessageCustom = ({ message, data = {} }: TPostMessage) => {
  //@ts-ignore
  if (window?.vuatho) {
    //@ts-ignore
    window?.vuatho?.postMessage(
      JSON.stringify({
        message,
        data
      })
    )
  } else {
    ToastComponent({ message: message || 'has bug here', type: 'error' })
  }
}

const objectToFormData = (obj: any) => {
  const formData = new FormData()

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      const valueIsFile = value instanceof File

      const isArrayData = Array.isArray(value)
      const initialValue = typeof value === 'number' ? Number(value) : ''

      if (isArrayData) {
        const isFile = value.some((item) => item instanceof File)
        if (isFile) {
          Array.prototype.forEach.call(value, (item) => {
            formData.append(key, item)
          })
        } else {
          formData.append(key, value ? JSON.stringify(value) : '')
        }
      } else {
        if (typeof value === 'object' && !isArrayData && !valueIsFile) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value || initialValue)
        }
      }
    }
  }

  return formData
}

const handleToastNoNetwork = () => {
  ToastComponent({ type: 'error', message: 'Không có kết nối mạng, vui lòng kiểm tra lại!' })
}

const groupConsecutiveMessages = (messages: Message[]): MessageGroup[] => {
  if (messages.length === 0) return []

  const groupedMessages: MessageGroup[] = []
  let currentGroup: Message[] = [messages[0]]
  let currentUserId = messages[0].by.id

  for (let i = 1; i < messages.length; i++) {
    if (messages[i].by.id === currentUserId) {
      currentGroup.push(messages[i])
    } else {
      // Mark first and last messages in the current group if there are 2 or more messages
      if (currentGroup.length >= 2) {
        currentGroup[0].first = true
        currentGroup[currentGroup.length - 1].last = true
      }
      groupedMessages.push({ userId: currentUserId, messages: currentGroup })
      currentGroup = [messages[i]]
      currentUserId = messages[i].by.id
    }
  }

  // Mark first and last messages in the last group if there are 2 or more messages
  if (currentGroup.length >= 2) {
    currentGroup[0].first = true
    currentGroup[currentGroup.length - 1].last = true
  }
  groupedMessages.push({ userId: currentUserId, messages: currentGroup })

  return groupedMessages
}

const getLastSeenId = (data: Message[]) => {
  const lastSeenItem = data
    .slice()
    .reverse()
    .find((item) => item.status === 'seen')

  return lastSeenItem ? lastSeenItem.id : null
}
function isStringWithoutEmoji(value: string) {
  if (typeof value !== 'string') {
    return false
  }

  // Biểu thức chính quy để kiểm tra emoji
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u

  return !emojiRegex.test(value)
}

const handle = () => {
  //
}

export {
  capitalizeWords,
  formatDDMMYYYY,
  formatLocalHoursTime,
  formatLocalTime,
  groupConsecutiveMessages,
  handleAddLangInUrl,
  handleToastNoNetwork,
  objectToFormData,
  postMessageCustom,
  useDebounce,
  useUnfocusItem,
  formatTimestamp,
  getLastSeenId,
  isStringWithoutEmoji
}
