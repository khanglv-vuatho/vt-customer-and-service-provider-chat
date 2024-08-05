import { Add, Call, Refresh } from 'iconsax-react'
import { useEffect, useState } from 'react'

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
    console.log({ result })
    setOrderDetail(result)
    setIsLoading(false)
  }

  const handleCall = ({ phone }: { phone: string }) => {
    postMessageCustom({
      message: keyPossmessage.CALL,
      data: {
        call: '31212'
      }
    })
  }

  useEffect(() => {
    setIsLoading(true)
  }, [])

  useEffect(() => {
    isLoading && handleFetchingDetail()
  }, [isLoading])

  return (
    <header className='sticky left-0 right-0 top-0 flex flex-col'>
      <div className='flex items-center justify-between border-b-2 border-[#E4E4E4] px-4 py-2'>
        <div className='flex items-center font-bold'>
          <ButtonOnlyIcon className='' onClick={handleCloseWebview}>
            <Add className='rotate-45' size={32} />
          </ButtonOnlyIcon>
          <p className='text-sm'>Trò chuyện</p>
        </div>
        <div className='flex gap-2'>
          <ButtonOnlyIcon className='bg-primary-blue text-white' onClick={() => handleCall({ phone: '31212' })}>
            <Call size={24} variant='Bold' />
          </ButtonOnlyIcon>
          <ButtonOnlyIcon onClick={handleClearMessage} className='bg-primary-yellow text-white'>
            <Refresh size={24} variant='Bold' />
          </ButtonOnlyIcon>
        </div>
      </div>
      <OrderDetailHeader orderDetail={orderDetail} />
    </header>
  )
}

export default Header
