import { Button, Textarea } from '@nextui-org/react'
import { Send2 } from 'iconsax-react'
import { ChangeEvent, forwardRef, memo, RefObject, useEffect, useMemo, useRef, useState } from 'react'

type InputChatType = {
  handleChangeValue: (value: ChangeEvent<HTMLInputElement>) => void
  handleSendMessage: () => void
  message: string
}

const InputChat = forwardRef<HTMLTextAreaElement, InputChatType>(({ handleSendMessage, handleChangeValue, message }, ref) => {
  const sendRef: any = useRef<HTMLButtonElement>(null)
  const isHasMessage = useMemo(() => {
    return message.length > 0
  }, [message])

  const handleSend = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isHasMessage) return
    e.stopPropagation()
    handleSendMessage()
  }

  useEffect(() => {
    const inputEl: any = (ref as RefObject<HTMLTextAreaElement>)?.current

    const handleBlur = (e: any) => {
      if (!sendRef?.current.contains(e.relatedTarget)) {
        inputEl?.blur()
      } else {
        inputEl.focus() // Focus lại vào input nếu không phải click vào sendRef
      }
    }

    inputEl?.addEventListener('blur', handleBlur)

    return () => {
      inputEl?.removeEventListener('blur', handleBlur)
    }
  }, [sendRef, ref])

  return (
    <div className='flex items-end gap-2'>
      <Textarea
        minRows={1}
        maxRows={3}
        autoFocus
        ref={ref}
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
})

export default memo(InputChat)
