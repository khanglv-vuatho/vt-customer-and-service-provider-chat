import { ButtonOnlyIcon, PrimaryButton } from '@/components/Buttons'
import ImageCustom from '@/components/ImageCustom'
import { DefaultModal } from '@/components/Modal'
import RenderFireLottie from '@/lotties'
import { TOrderDetail } from '@/types'
import { formatDDMMYYYY, formatLocalTime } from '@/utils'

import { Progress } from '@nextui-org/react'
import { Add, Clock, Location, MessageQuestion, ShieldTick } from 'iconsax-react'
import React, { memo, useState } from 'react'

type TOrderDetailHeader = {
  orderDetail: TOrderDetail | null
}
const OrderDetailHeader: React.FC<TOrderDetailHeader> = ({ orderDetail }) => {
  const percent = 100 - Number(orderDetail?.guarantee?.percent) < 0 ? 0 : 100 - Number(orderDetail?.guarantee?.percent)

  const [isOpen, setIsOpen] = useState(false)
  const [isOpenExplainPrice, setIsOpenExplainPrice] = useState(false)

  const handleToggleModal = () => {
    setIsOpen(!isOpen)
  }
  const handleOpenExplainPrice = () => {
    setIsOpenExplainPrice(!isOpenExplainPrice)
  }

  return (
    <>
      <DefaultModal isOpen={isOpen} onOpenChange={handleToggleModal} className='mx-4'>
        <div className='w-full'>
          <div className='ml-auto w-fit'>
            <ButtonOnlyIcon onClick={handleToggleModal}>
              <Add className='rotate-45' size={32} />
            </ButtonOnlyIcon>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1 text-sm'>
              <p className='font-bold'>{orderDetail?.problems?.[0]?.description}</p>
              <p>{orderDetail?.problems?.[0]?.title?.vi}</p>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1 text-sm'>
                <p>Giá dự kiến</p>
                <span onClick={handleOpenExplainPrice}>
                  <MessageQuestion className='text-primary-gray' />
                </span>
              </div>
              <p className='font-bold text-primary-green'>{orderDetail?.billing?.first_price.toLocaleString('en-US').toString()}đ</p>
            </div>
            <div className='flex flex-col gap-2 *:text-sm'>
              <div className='flex items-center gap-2'>
                <span>
                  <Clock size={20} className='text-primary-gray' />
                </span>
                <time>
                  {formatDDMMYYYY(orderDetail?.time_will_work?.split(' ')?.[0] as string)} {formatLocalTime(orderDetail?.time_will_work?.split(' ')?.[1] as string)}
                </time>
              </div>
              <div className='flex items-center gap-2'>
                <span>
                  <Location size={20} className='text-primary-gray' />
                </span>
                <p>{orderDetail?.location?.address}</p>
              </div>
              <div className='flex items-center gap-2'>
                <span>
                  <ShieldTick size={20} className='text-primary-green' variant='Bold' />
                </span>
                <p>Bảo hành {orderDetail?.guarantee?.duration} ngày</p>
              </div>
            </div>
            {(orderDetail?.problems?.[0]?.attachments?.length as any) > 0 && (
              <div className='flex items-center gap-2'>
                {orderDetail?.problems?.[0]?.attachments.map((item) => (
                  <div key={item?.url} className='size-[80px] overflow-hidden rounded-md'>
                    <ImageCustom src={item?.url} alt={item?.url} className='size-full' />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DefaultModal>
      <div className='z-50 flex flex-col gap-4 bg-white p-4'>
        <div className='flex items-center justify-between text-sm font-bold'>
          <p>{orderDetail?.problems?.[0]?.description}</p>
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
              <p>Bảo hành {orderDetail?.guarantee?.duration} ngày</p>
            </div>
            <p className='text-sm font-bold'>Còn lại {Number(orderDetail?.guarantee?.time_remaining) < 0 ? 0 : orderDetail?.guarantee?.time_remaining} ngày</p>
          </div>
          <div className='relative'>
            <Progress
              value={percent}
              classNames={{
                base: 'h-1'
              }}
            />
            <div
              style={{
                left: `${percent}%`
              }}
              className='absolute bottom-0 size-[30px] -translate-x-1/2 translate-y-1/2'
            >
              <RenderFireLottie />
            </div>
          </div>
        </div>
      </div>
      <DefaultModal
        classNames={{
          body: 'p-0',
          base: 'rounded-t-xl rounded-b-none m-0 p-0',
          backdrop: 'z-[900]',
          closeButton: '2',
          footer: '3',
          header: '4',
          wrapper: 'z-[1000]'
        }}
        isOpen={isOpenExplainPrice}
        placement='bottom'
        onOpenChange={handleOpenExplainPrice}
      >
        <div className='flex w-full flex-col gap-4'>
          <div className='flex flex-col items-center justify-center gap-1 text-primary-black *:text-center'>
            <p className='font-bold'>Giá dự kiến</p>
            <p className='text-sm'>Đây là giá mà thợ dự kiến ước lượng khoảng giá, đến nơi kiểm tra kĩ sẽ chốt giá sau.</p>
          </div>
          <PrimaryButton className='rounded-full font-bold text-primary-black' onClick={handleOpenExplainPrice}>
            Đã hiểu
          </PrimaryButton>
        </div>
      </DefaultModal>
    </>
  )
}

export default memo(OrderDetailHeader)
