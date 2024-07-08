import { useCallback } from 'react'
import InputChat from './InputChat'

const ChatTab = () => {
  const handleChangeValue = useCallback(() => {}, [])
  const handleSendMessage = useCallback(() => {}, [])

  return (
    <div className='flex flex-col overflow-hidden rounded-2xl bg-white'>
      <div className='min-h-[168px]'>123</div>
      <InputChat handleChangeValue={handleChangeValue} handleSendMessage={handleSendMessage} />
    </div>
  )
}

export default ChatTab
