import ToastComponent from '@/components/ToastComponent'
import { GroupedMessage, Message } from '@/types'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'

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
  return `${mainUrl}?lang=${lang}&token=${token}`
}

const formatLocalTime = (time: string) => {
  const utcMoment = moment.utc(time, 'HH:mm:ss')
  const localTime = utcMoment.local().format('HH:mm:ss')
  return localTime
}

const formatDDMMYYYY = (time: string) => {
  return moment(time).format('DD/MM/YYYY')
}

const postMessageCustom = ({ message }: { message: string }) => {
  //@ts-ignore
  if (window?.vuatho) {
    //@ts-ignore
    window?.vuatho?.postMessage(message)
  } else {
    ToastComponent({ message: message || 'has bug here', type: 'error' })
  }
}

const groupMessages = (messages: Message[]): GroupedMessage[] => {
  if (messages.length === 0) return []

  const groupedMessages: GroupedMessage[] = []
  let currentGroup: GroupedMessage = { id: messages[0].id, messages: [], time: messages[0].time }

  messages.forEach((msg, index) => {
    if (msg.id === currentGroup.id) {
      currentGroup.messages.push(msg.message)
    } else {
      groupedMessages.push({ ...currentGroup })
      currentGroup = { id: msg.id, messages: [msg.message], time: msg.time }
    }

    if (index === messages.length - 1) {
      groupedMessages.push({ ...currentGroup })
    }
  })

  return groupedMessages
}

export { useUnfocusItem, capitalizeWords, useDebounce, handleAddLangInUrl, formatLocalTime, formatDDMMYYYY, postMessageCustom, groupMessages }
