import { ButtonOnlyIcon } from '@/components/Buttons'
import ToastComponent from '@/components/ToastComponent'
import { typeOfSocket } from '@/constants'
import { useSocket } from '@/context/SocketProvider'
import { translate } from '@/context/translationProvider'
import { MessageProps, TConversationInfo, THandleSendMessage } from '@/types'
import { isMobileWithUserAgent } from '@/utils'
import { Button, Textarea } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { DocumentUpload, Send2 } from 'iconsax-react'
import { forwardRef, memo, useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import useSound from 'use-sound'
import sendSound from '../../../public/sendMessage.mp4'

type FooterInputProps = {
  handleSendMessage: ({ message }: THandleSendMessage) => Promise<void>
  conversationInfo: TConversationInfo | null
  isSendingMessage: boolean
  onFetchingMessage: boolean
  onReloadMessage: boolean
}

const FooterInput = forwardRef<HTMLDivElement, FooterInputProps>(({ handleSendMessage, conversationInfo, isSendingMessage, onFetchingMessage, onReloadMessage }, ref) => {
  const f = translate('Footer')

  const queryParams = new URLSearchParams(location.search)

  const sendRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const uploadRef = useRef<HTMLInputElement | any>(null)
  const socket: any = useSocket()

  const currentId = Number(queryParams.get('currentId'))
  const worker_id = Number(queryParams.get('worker_id'))
  const isClient = !!worker_id
  const isAdmin = queryParams.get('isAdmin') === 'true'

  //sound
  const [play] = useSound(sendSound)

  const { control, handleSubmit, reset } = useForm<MessageProps & { files: File[] }>({
    defaultValues: {
      message: '',
      files: []
    }
  })

  const handleSend = async (data: MessageProps) => {
    if (data.message.trim() === '') return
    reset({ message: '' })
    play()
    await handleSendMessage({ message: data.message.trim() })
  }

  useEffect(() => {
    const inputEl: any = inputRef.current

    const handleBlur = (e: any) => {
      if (sendRef?.current?.contains(e?.relatedTarget) || e?.relatedTarget?.name === 'upload-file-button' || e?.relatedTarget?.id === 'scroll-to-bottom') {
        if (e?.relatedTarget?.name === 'upload-file-button') {
          handleClickInputFile(e)
        }
        inputEl?.focus()
        inputEl.value = ''
      } else {
        socket.emit(typeOfSocket.MESSAGE_TYPING, {
          socketId: socket.id,
          message: '',
          orderId: conversationInfo?.order_id,
          workerId: conversationInfo?.worker_id,
          currentId
        })
        inputEl?.blur()
      }
    }

    inputEl?.addEventListener('blur', handleBlur)

    return () => {
      inputEl?.removeEventListener('blur', handleBlur)
    }
  }, [])

  const handleClickInputFile = (e: any) => {
    e.preventDefault()
    if (uploadRef.current) {
      uploadRef.current.click()
    }
  }

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className='sticky bottom-0 left-0 right-0 z-50 flex flex-col gap-2'
    >
      <form className='w-full'>
        <Controller
          name='message'
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              disabled={isAdmin}
              onBlur={() =>
                socket.emit(typeOfSocket.MESSAGE_TYPING, {
                  socketId: socket.id,
                  message: '',
                  orderId: conversationInfo?.order_id,
                  workerId: conversationInfo?.worker_id,
                  currentId
                })
              }
              onChange={(e) => {
                field.onChange(e.target.value)
                if (e.target.value.length > 1) return
                if (e.target.value.length === 1) {
                  socket.emit(typeOfSocket.MESSAGE_TYPING, {
                    socketId: socket.id,
                    message: e.target.value,
                    orderId: conversationInfo?.order_id,
                    workerId: conversationInfo?.worker_id,
                    currentId
                  })
                }
              }}
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
              placeholder={f?.text1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isMobileWithUserAgent()) {
                  if (field.value.trim() === '') return
                  e.preventDefault()
                  handleSubmit(handleSend)()
                }
              }}
              endContent={
                field.value.length === 0 ? (
                  <Controller
                    name='files'
                    control={control}
                    render={({ field: { onChange } }) => (
                      <>
                        <input
                          type='file'
                          accept='image/*'
                          style={{
                            display: 'none'
                          }}
                          ref={uploadRef}
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                // File size exceeds 5MB
                                ToastComponent({
                                  message: 'File size exceeds 5MB limit. Please choose a smaller file.',
                                  type: 'error'
                                })
                                e.target.value = ''
                                return
                              }
                              onChange(e.target.files)
                              await handleSendMessage({ message: '', attachment: file, type: 1 })
                              if (!socket.connected) {
                                console.log('Socket disconnected, reconnecting...')
                                socket.connect()
                              }
                            }
                            e.target.value = ''
                          }}
                        />
                        <ButtonOnlyIcon name='upload-file-button' onClick={handleClickInputFile} disabled={isAdmin}>
                          <DocumentUpload className={'text-primary-gray'} />
                        </ButtonOnlyIcon>
                      </>
                    )}
                  />
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} exit={{ opacity: 0, scale: 0 }}>
                    <Button
                      ref={sendRef}
                      disabled={isAdmin}
                      isDisabled={onFetchingMessage || onReloadMessage}
                      isIconOnly
                      radius='full'
                      className={`flex items-center justify-center bg-transparent text-primary-green transition`}
                      onClick={handleSubmit(handleSend)}
                    >
                      <Send2 variant='Bold' className='rotate-45 transition' />
                    </Button>
                  </motion.div>
                )
              }
              classNames={{
                base: 'px-4 bg-white',
                innerWrapper: 'items-end',
                input: 'text-primary-base placeholder:pl-1 pb-1 caret-primary-green placeholder:text-primary-gray placeholder:text-sm text-base',
                inputWrapper:
                  'p-1 !min-h-14 border-none bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-0 group-data-[focus-visible=true]:ring-offset-background shadow-none'
              }}
            />
          )}
        />
      </form>
    </motion.footer>
  )
})

FooterInput.displayName = 'FooterInput'

export default memo(FooterInput)
