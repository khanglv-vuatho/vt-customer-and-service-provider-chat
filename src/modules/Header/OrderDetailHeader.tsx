import { ButtonOnlyIcon } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import { DefaultModal } from '@/components/Modal'
import RenderFireLottie from '@/lotties'
import { TOrderDetail } from '@/types'
import { formatDDMMYYYY, formatLocalTime } from '@/utils'

import { Progress } from '@nextui-org/react'
import { Add, Clock, Location, MessageQuestion, ShieldTick } from 'iconsax-react'
import React, { memo, useState } from 'react'

type TOrderDetailHeader = {
  workerId: number
  orderDetail: TOrderDetail | null
}
const OrderDetailHeader: React.FC<TOrderDetailHeader> = ({ workerId, orderDetail }) => {
  const percent = 100 - Number(orderDetail?.guarantee?.percent) || 0

  const [isOpen, setIsOpen] = useState(false)

  const handleToggleModal = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <DefaultModal isOpen={isOpen} onOpenChange={handleToggleModal} className='mx-8'>
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
                <span>
                  <MessageQuestion className='text-primary-gray' />
                </span>
              </div>
              <p className='font-bold text-primary-green'>{orderDetail?.billing?.first_price}đ</p>
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
                  <div className='size-[80px] overflow-hidden rounded-md'>
                    <ImageFallback src={item?.url} alt={item?.url} className='size-full' />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DefaultModal>
      <div className='flex flex-col gap-4 p-4'>
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
            <p className='text-sm font-bold'>Còn lại {orderDetail?.guarantee?.time_remaining} ngày</p>
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
    </>
  )
}

export default memo(OrderDetailHeader)
