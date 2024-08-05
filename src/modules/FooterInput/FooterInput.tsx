import { MessageProps, THandleSendMessage } from '@/types'
import { Button, Textarea } from '@nextui-org/react'
import { DocumentUpload, Send2 } from 'iconsax-react'
import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { ButtonOnlyIcon } from '@/components/Buttons'
type FooterInputProps = {
  handleSendMessage: ({ message }: THandleSendMessage) => Promise<void>
}

const FooterInput: React.FC<FooterInputProps> = ({ handleSendMessage }) => {
  const sendRef: any = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)
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

  const { control, handleSubmit, reset } = useForm<MessageProps & { files: File[] }>({
    defaultValues: {
      message: '',
      files: []
    }
  })

  const handleSend = async (data: MessageProps) => {
    console.log({ data })
    console.log({ message: data.message.trim() === '' ? '👍' : data.message })
    reset({ message: '' })
    await handleSendMessage({ message: data.message.trim() === '' ? '👍' : data.message })
  }

  return (
    <div className='sticky bottom-0 left-0 right-0 z-50 flex flex-col gap-2'>
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
              maxLength={300}
              radius='none'
              autoComplete='off'
              autoCorrect='off'
              autoCapitalize='off'
              spellCheck='false'
              placeholder='Bắt đầu trò chuyện'
              endContent={
                <div className='flex items-center gap-2'>
                  <Controller
                    name='files'
                    control={control}
                    render={({ field: { onChange } }) => (
                      <>
                        <input
                          type='file'
                          accept='image/*'
                          ref={uploadRef}
                          style={{ display: 'none' }}
                          onChange={async (e) => {
                            onChange(e.target.files)
                            if (e?.target?.files && e?.target?.files?.length > 0) {
                              await handleSendMessage({ message: '', attachment: e.target.files[0], type: 1 })
                            }
                            e.target.value = ''
                          }}
                        />
                        <ButtonOnlyIcon onClick={() => uploadRef?.current?.click()}>
                          <DocumentUpload variant='Bold' className='text-primary-gray' />
                        </ButtonOnlyIcon>
                      </>
                    )}
                  />
                  {field.value.trim() === '' ? (
                    <AnimatePresence>
                      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} exit={{ opacity: 0, scale: 0 }}>
                        <Button ref={sendRef} isIconOnly radius='full' className='flex items-center justify-center bg-transparent text-primary-green transition' onClick={handleSubmit(handleSend)}>
                          👍
                        </Button>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} exit={{ opacity: 0, scale: 0 }}>
                      <Button ref={sendRef} isIconOnly radius='full' className='flex items-center justify-center bg-transparent text-primary-green transition' onClick={handleSubmit(handleSend)}>
                        <Send2 variant='Bold' className='rotate-45 transition' />
                      </Button>
                    </motion.div>
                  )}
                </div>
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
  )
}

export default FooterInput
