import { motion } from 'framer-motion'
import { Add, Call, Refresh } from 'iconsax-react'
import { memo, useCallback, useEffect, useState } from 'react'

import OrderDetailHeader from './OrderDetailHeader'
import { fetchingDetailOrder } from '@/apis'
import { ButtonOnlyIcon } from '@/components/Buttons'
import { keyPossmessage } from '@/constants'
import instance from '@/services/axiosConfig'
import { TOrderDetail } from '@/types'
import { postMessageCustom } from '@/utils'

type THeaderProps = {
  workerId: number
}

const Header: React.FC<THeaderProps> = ({ workerId }) => {
  const queryParams = new URLSearchParams(location.search)
  const orderId = queryParams.get('orderId')
  const [orderDetail, setOrderDetail] = useState<TOrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const worker_id = Number(queryParams.get('worker_id'))
  const isClient = !!worker_id

  const handleCloseWebview = () => {
    postMessageCustom({
      message: keyPossmessage.CAN_POP
    })
  }
  const handleClearMessage = async () => {
    const payload = {
      worker_id: 429
    }
    await instance.post(`/webview/conversations/${orderId}/clear-message`, payload)
  }

  const handleFetchingDetail = async () => {
    const result = await fetchingDetailOrder({ orderId: Number(orderId), worker_id: workerId })
    setOrderDetail(result)
    setIsLoading(false)
  }

  // postmessage to app for call
  const handleCall = () => {
    const keyPhone = isClient ? 'client_phone' : 'worker_phone'
    const phoneCode = orderDetail?.[keyPhone]?.phone?.phone_code || ''
    const phoneNumber = orderDetail?.[keyPhone]?.phone?.phone_number || ''
    const phone = (phoneCode + phoneNumber).toString()
    postMessageCustom({
      message: keyPossmessage?.CALL,
      data: {
        call: phone
      }
    })
  }

  useEffect(() => {
    setIsLoading(true)
  }, [workerId])

  useEffect(() => {
    isLoading && !!workerId && handleFetchingDetail()
  }, [isLoading, workerId])

  return (
    <motion.header initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className='sticky left-0 right-0 top-0 flex flex-col'>
      <div className='flex items-center justify-between border-b-2 border-[#E4E4E4] px-4 py-2'>
        <div className='flex items-center font-bold'>
          <ButtonOnlyIcon className='' onClick={handleCloseWebview}>
            <Add className='rotate-45' size={32} />
          </ButtonOnlyIcon>
          <p className='text-sm'>Trò chuyện</p>
        </div>
        <div className='flex gap-2'>
          {isLoading ? (
            ''
          ) : (
            <ButtonOnlyIcon className='bg-primary-blue text-white' onClick={handleCall}>
              <Call size={24} variant='Bold' />
            </ButtonOnlyIcon>
          )}
          <ButtonOnlyIcon onClick={handleClearMessage} className='bg-primary-yellow text-white'>
            <Refresh size={24} variant='Bold' />
          </ButtonOnlyIcon>
        </div>
      </div>
      <OrderDetailHeader orderDetail={orderDetail} />
    </motion.header>
  )
}

export default memo(Header)
