import { motion } from 'framer-motion'
import { Button, Textarea } from '@nextui-org/react'
import { Send2 } from 'iconsax-react'
import { ChangeEvent, memo, useEffect, useRef, useState } from 'react'

type InputChatType = {
  handleChangeValue: (value: ChangeEvent<HTMLInputElement>) => void
  handleSendMessage: () => void
}

const InputChat: React.FC<InputChatType> = ({ handleSendMessage }) => {
  const [message, setMessage] = useState('')

  const sendRef: any = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const isHasMessage = message.length > 0

  const handleSend = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isHasMessage) return
    e.stopPropagation()
    handleSendMessage()
  }

  const handleChangeValue: (value: ChangeEvent<HTMLInputElement>) => void = (e) => {
    setMessage(e.target.value)
  }

  useEffect(() => {
    const inputEl: any = inputRef.current

    const handleBlur = (e: any) => {
      if (!sendRef?.current.contains(e.relatedTarget)) {
        inputRef?.current?.blur()
      } else {
        inputEl.focus() // Focus lại vào input nếu không phải click vào sendRef
      }
    }

    inputEl?.addEventListener('blur', handleBlur)

    return () => {
      inputEl?.removeEventListener('blur', handleBlur)
    }
  }, [sendRef, inputRef])

  return (
    <div className='flex items-end gap-2'>
      <Textarea
        minRows={1}
        maxRows={3}
        autoFocus
        ref={inputRef}
        value={message}
        onChange={handleChangeValue}
        radius='none'
        placeholder='Bắt đầu trò chuyện'
        endContent={
          <Button ref={sendRef} isIconOnly radius='full' className='flex items-center justify-center bg-transparent' onClick={handleSend}>
            <Send2 variant='Bold' className={`${isHasMessage ? 'text-primary-green' : 'text-primary-gray'} rotate-45 transition`} />
          </Button>
        }
        classNames={{
          base: 'px-4 pr-3',
          innerWrapper: 'items-end',
          input: 'text-sm text-primary-base placeholder:pl-1 p-1 pl-0 mb-1.5',
          inputWrapper:
            'p-0 !min-h-14 border-none bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-0 group-data-[focus-visible=true]:ring-offset-background shadow-none'
        }}
      />
    </div>
  )
}

export default memo(InputChat)
