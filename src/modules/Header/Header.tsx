import { motion } from 'framer-motion'
import { Add, ArrowLeft2, Call, Refresh } from 'iconsax-react'
import { memo, useCallback, useEffect, useState } from 'react'

import { ButtonOnlyIcon } from '@/components/Buttons'
import { keyPossmessage, typeOfSocket } from '@/constants'
import { useSocket } from '@/context/SocketProvider'
import { translate } from '@/context/translationProvider'
import instance from '@/services/axiosConfig'
import { TConversationInfo } from '@/types'
import { postMessageCustom } from '@/utils'
import { Avatar } from '@nextui-org/react'

type THeaderProps = {
  workerId: number
  conversationInfo: TConversationInfo | null
}

const Header: React.FC<THeaderProps> = ({ workerId, conversationInfo }) => {
  const h = translate('Header')
  const socket: any = useSocket()
  const queryParams = new URLSearchParams(location.search)
  const orderId = queryParams.get('orderId')
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(false)

  const worker_id = Number(queryParams.get('worker_id'))
  const isClient = !!worker_id

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

  return (
    <motion.header
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className='sticky left-0 right-0 top-0 z-50 flex items-center justify-between bg-white p-2'
    >
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
      <ButtonOnlyIcon className={`${isClient ? 'bg-[#FFFAEA] text-[#F4B807]' : 'bg-[#F6F9FF] text-primary-blue'}`} onClick={handleCall}>
        <Call size={24} variant='Bold' />
      </ButtonOnlyIcon>
    </motion.header>
  )
}

export default memo(Header)
