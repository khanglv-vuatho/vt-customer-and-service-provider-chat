import { motion } from 'framer-motion'
import { ArrowLeft2, Call, Warning2 } from 'iconsax-react'
import { memo, useCallback, useEffect, useState } from 'react'

import { handlePostMessage, handlePostWarning } from '@/apis'
import { ButtonOnlyIcon, PrimaryButton, PrimaryOutlineButton } from '@/components/Buttons'
import { DefaultModal } from '@/components/Modal'
import ToastComponent from '@/components/ToastComponent'
import { keyPossmessage, typeOfSocket } from '@/constants'
import { useSocket } from '@/context/SocketProvider'
import { translate } from '@/context/translationProvider'
import instance from '@/services/axiosConfig'
import { TConversationInfo, TPayloadHandleSendMessageApi } from '@/types'
import { postMessageCustom } from '@/utils'
import { Avatar, Skeleton, Textarea } from '@nextui-org/react'

type THeaderProps = {
  workerId: number
  conversationInfo: TConversationInfo | null
  onFetchingMessage: boolean
}

const Header: React.FC<THeaderProps> = ({ workerId, conversationInfo, onFetchingMessage }) => {
  const h = translate('Header')
  const socket: any = useSocket()
  const queryParams = new URLSearchParams(location.search)
  const orderId = queryParams.get('orderId')

  const worker_id = Number(queryParams.get('worker_id'))
  const isClient = !!worker_id
  const isAdmin = queryParams.get('isAdmin') === 'true'

  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [isOpenModalWarning, setIsOpenModalWarning] = useState(false)
  const [isSendingWarning, setIsSendingWarning] = useState(false)
  const [message, setMessage] = useState('')

  const handleCloseWebview = useCallback(async () => {
    await socket.emit(typeOfSocket.LEAVE_CONVERSATION_ROOM, { workerId: conversationInfo?.worker_id, orderId: conversationInfo?.order_id })

    postMessageCustom({
      message: keyPossmessage.CAN_POP
    })
  }, [conversationInfo])

  const handleFetchingDetail = async () => {
    setIsLoading(false)
  }
  console.log({ conversationInfo })
  // postmessage to app for call
  const handleCall = () => {
    postMessageCustom({
      message: keyPossmessage?.CALL,
      data: {
        phoneCode: conversationInfo?.phone?.phone_code,
        phoneNumber: conversationInfo?.phone?.phone_number
      }
    })
  }

  const handleClearMessage = useCallback(async () => {
    const payload = {
      worker_id: 429
    }

    await instance.post(`/webview/conversations/${orderId}/clear-message`, payload)
  }, [orderId])

  useEffect(() => {
    setIsLoading(true)
  }, [workerId])

  useEffect(() => {
    isLoading && !!workerId && handleFetchingDetail()
  }, [isLoading, workerId])

  useEffect(() => {
    socket.on(typeOfSocket.CHECK_ONLINE_STATUS, (data: any) => {
      setIsOnline(!!data?.is_online)
    })

    return () => {
      socket.off(typeOfSocket.CHECK_ONLINE_STATUS)
    }
  }, [])

  const handleWarning = () => {
    setIsOpenModalWarning(true)
  }

  const handleSendWarning = () => {
    setIsSendingWarning(true)
  }

  const handleSendingWarningApi = async () => {
    try {
      if (message.trim() === '') return ToastComponent({ message: 'Vui lòng nhập lý do cảnh báo', type: 'error' })
      const payload: TPayloadHandleSendMessageApi = {
        content: message,
        // 2 is warning
        type: 2,
        socket_id: socket.id,
        conversationId: conversationInfo?.conversation_id as number,
        messageId: Date.now(),
        ...(isClient && { worker_id: conversationInfo?.worker_id })
      }

      const data = await handlePostWarning({ orderId: Number(orderId), payload })
      ToastComponent({ message: 'Cảnh báo thành công', type: 'success' })
    } catch (error) {
      console.log(error)
    } finally {
      setIsSendingWarning(false)
      setMessage('')
      setIsOpenModalWarning(false)
    }
  }

  useEffect(() => {
    if (isSendingWarning) {
      handleSendingWarningApi()
    }
  }, [isSendingWarning])

  return (
    <motion.header
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className='sticky left-0 right-0 top-0 z-50 flex items-center justify-between bg-white p-2'
    >
      {onFetchingMessage ? (
        <div className='flex items-center gap-2 px-2'>
          <Skeleton className='size-8 rounded-full' />
          <Skeleton className='size-10 rounded-full' />
          <div className='flex flex-col gap-1'>
            <Skeleton className='h-4 w-[100px] rounded-md' />
            <Skeleton className='h-2 w-[60px] rounded-md' />
          </div>
        </div>
      ) : (
        <div className='flex items-center gap-2'>
          <ButtonOnlyIcon onClick={handleCloseWebview}>
            <ArrowLeft2 size={24} />
          </ButtonOnlyIcon>
          <Avatar className='size-10' src={conversationInfo?.profile_picture || ''} />
          <div className='flex flex-col gap-0.5'>
            <p className='font-bold text-primary-black'>{conversationInfo?.full_name || ''}</p>
            <div className='flex items-center gap-1'>
              <div className={`size-1 rounded-full ${isOnline ? 'bg-primary-green' : 'bg-primary-gray'}`} />
              <p className='text-sm text-primary-gray'>{isOnline ? 'Online' : 'Offline'}</p>
            </div>
          </div>
        </div>
      )}
      <div className='flex items-center gap-2'>
        {isAdmin && (
          <ButtonOnlyIcon onClick={handleWarning}>
            <Warning2 className='text-primary-yellow' size={32} />
          </ButtonOnlyIcon>
        )}
        <DefaultModal isOpen={isOpenModalWarning} onOpenChange={() => setIsOpenModalWarning(false)}>
          <div className='flex flex-col gap-2'>
            <p className='font-semibold'>Cảnh báo Thợ!</p>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} minRows={3} placeholder='Nhập lý do cảnh báo' variant='flat' />
          </div>
          <div className='flex justify-end gap-2'>
            <PrimaryOutlineButton className='rounded-xl data-[hover=true]:opacity-100' onClick={() => setIsOpenModalWarning(false)}>
              Hủy
            </PrimaryOutlineButton>
            <PrimaryButton isLoading={isSendingWarning} className='rounded-xl data-[hover=true]:opacity-100' onClick={handleSendWarning}>
              Cảnh báo
            </PrimaryButton>
          </div>
        </DefaultModal>
        {Number(conversationInfo?.status) >= 2 && (
          <ButtonOnlyIcon className={`${isClient ? 'bg-[#FFFAEA] text-[#F4B807]' : 'bg-[#F6F9FF] text-primary-blue'}`} onClick={handleCall}>
            <Call size={24} variant='Bold' />
          </ButtonOnlyIcon>
        )}
      </div>
    </motion.header>
  )
}

export default memo(Header)
