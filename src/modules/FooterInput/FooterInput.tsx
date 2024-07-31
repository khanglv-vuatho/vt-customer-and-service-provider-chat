import { MessageProps } from '@/types'
import { Button, Textarea } from '@nextui-org/react'
import { Send2 } from 'iconsax-react'
import { useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { motion } from 'framer-motion'
type FooterInputProps = {
  handleSendMessage: ({ message }: MessageProps) => void
}

const FooterInput: React.FC<FooterInputProps> = ({ handleSendMessage }) => {
  const sendRef: any = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const inputEl: any = inputRef.current

    const handleBlur = (e: any) => {
      if (sendRef?.current?.contains(e?.relatedTarget)) {
        inputEl?.focus()
        inputEl.value = ''
      } else {
        inputEl?.blur()
      }
    }

    inputEl?.addEventListener('blur', handleBlur)

    return () => {
      inputEl?.removeEventListener('blur', handleBlur)
    }
  }, [])
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      message: ''
    }
  })

  const handleSend = (data: any) => {
    handleSendMessage({ message: data.message.trim() === '' ? '👍' : data.message })
    reset({ message: '' })
  }

  return (
    <div className='sticky bottom-0 left-0 right-0 flex flex-col gap-2'>
      <div className='flex items-end gap-2'>
        <form className='w-full'>
          <Controller
            name='message'
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                ref={inputRef}
                minRows={1}
                maxRows={3}
                autoFocus
                maxLength={150}
                radius='none'
                autoComplete='off'
                autoCorrect='off'
                autoCapitalize='off'
                spellCheck='false'
                placeholder='Bắt đầu trò chuyện'
                endContent={
                  field.value.trim() === '' ? (
                    <motion.div>
                      <Button ref={sendRef} isIconOnly radius='full' className='flex items-center justify-center bg-transparent text-primary-green transition' onClick={handleSubmit(handleSend)}>
                        👍
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div>
                      <Button ref={sendRef} isIconOnly radius='full' className='flex items-center justify-center bg-transparent text-primary-green transition' onClick={handleSubmit(handleSend)}>
                        <Send2 variant='Bold' className='rotate-45 transition' />
                      </Button>
                    </motion.div>
                  )
                }
                classNames={{
                  base: 'px-4 border-t-1 border-[#E4E4E4]',
                  innerWrapper: 'items-end',
                  input: 'text-primary-base placeholder:pl-1 pb-1 caret-primary-green placeholder:text-primary-gray placeholder:text-sm text-base',
                  inputWrapper:
                    'p-1 !min-h-14 border-none bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-0 group-data-[focus-visible=true]:ring-offset-background shadow-none'
                }}
              />
            )}
          />
        </form>
      </div>
    </div>
  )
}

export default FooterInput
