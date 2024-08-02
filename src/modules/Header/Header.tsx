import { ButtonOnlyIcon } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import { DefaultModal } from '@/components/Modal'
import { keyPossmessage } from '@/constants'
import instance from '@/services/axiosConfig'
import RenderFireLottie from '@/lotties'
import { postMessageCustom } from '@/utils'
import { Progress } from '@nextui-org/react'
import { Add, Call, Location, MessageQuestion, Refresh, ShieldTick, Timer } from 'iconsax-react'
import { useEffect, useState } from 'react'

const Header = () => {
  const queryParams = new URLSearchParams(location.search)
  const orderId = queryParams.get('orderId')
  const value = 20

  const [isOpen, setIsOpen] = useState(false)

  const handleClearMessage = async () => {
    const payload = {
      worker_id: 429
    }
    await instance.post(`/webview/conversations/${orderId}/clear-message`, payload)
  }

  const handleCloseWebview = () => {
    postMessageCustom({
      message: keyPossmessage.CAN_POP
    })
  }
  const handleToggleModal = () => {
    setIsOpen(!isOpen)
  }

  const handleFetchingDetail = async () => {
    await instance.get(`/webview/order/${orderId}`)
  }

  useEffect(() => {
    handleFetchingDetail()
  }, [])

  return (
    <header className='sticky left-0 right-0 top-0 flex flex-col'>
      <DefaultModal isOpen={isOpen} onOpenChange={handleToggleModal}>
        <div className='ml-auto'>
          <ButtonOnlyIcon onClick={handleToggleModal}>
            <Add className='rotate-45' size={32} />
          </ButtonOnlyIcon>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1 text-sm'>
            <p className='font-bold'>Sửa chữa ô tô</p>
            <p>Bị hư bình</p>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1 text-sm'>
              <p>Giá dự kiến</p>
              <span>
                <MessageQuestion className='text-primary-gray' />
              </span>
            </div>
            <p className='font-bold text-primary-green'>200.000.000đ</p>
          </div>
          <div className='flex flex-col gap-2 *:text-sm'>
            <div className='flex items-center gap-2'>
              <span>
                <Timer size={20} />
              </span>
              <time>11:00</time>
            </div>
            <div className='flex items-center gap-2'>
              <span>
                <Location size={20} />
              </span>
              <time>11:00</time>
            </div>
            <div className='flex items-center gap-2'>
              <span>
                <ShieldTick size={20} className='text-primary-green' variant='Bold' />
              </span>
              <time>11:00</time>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='size-[80px] rounded-lg'>
              <ImageFallback src='/invalid.png' alt='' className='size-full' />
            </div>
            <div className='size-[80px] rounded-lg'>
              <ImageFallback src='/invalid.png' alt='' className='size-full' />
            </div>
          </div>
        </div>
      </DefaultModal>
      <div className='flex items-center justify-between border-b-2 border-[#E4E4E4] px-4 py-2'>
        <div className='flex items-center font-bold'>
          <ButtonOnlyIcon className='' onClick={handleCloseWebview}>
            <Add className='rotate-45' size={32} />
          </ButtonOnlyIcon>
          <p className='text-sm'>Trò chuyện</p>
        </div>
        <div className='flex gap-2'>
          <ButtonOnlyIcon className='bg-primary-blue text-white'>
            <Call size={24} variant='Bold' />
          </ButtonOnlyIcon>
          <ButtonOnlyIcon onClick={handleClearMessage} className='bg-primary-yellow text-white'>
            <Refresh size={24} variant='Bold' />
          </ButtonOnlyIcon>
        </div>
      </div>
      <div className='flex flex-col gap-4 p-4'>
        <div className='flex items-center justify-between text-sm font-bold'>
          <p>Sửa chữa ô tô</p>
          <p className='text-primary-yellow underline' onClick={handleToggleModal}>
            Xem chi tiết
          </p>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1 text-sm'>
              <span>
                <ShieldTick size={24} variant='Bold' className='text-primary-green' />
              </span>
              <p>Bảo hành 7 ngày</p>
            </div>
            <p className='text-sm font-bold'>Còn lại 2 ngày</p>
          </div>
          <div className='relative'>
            <Progress
              value={value}
              classNames={{
                base: '1',
                indicator: '2',
                label: '3',
                labelWrapper: '4',
                track: '5',
                value: '6'
              }}
            />
            <div
              style={{
                left: `${value}%`
              }}
              className='absolute bottom-0 top-[12px] size-[80px] -translate-x-1/2 -translate-y-1/2'
            >
              <RenderFireLottie className='' />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
