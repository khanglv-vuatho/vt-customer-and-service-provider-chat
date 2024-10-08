import { ButtonOnlyIcon, PrimaryButton } from '@/components/Buttons'
import { PlayIcon } from '@/components/Icons'
import ImageCustom from '@/components/ImageCustom'
import { DefaultModal } from '@/components/Modal'
import { typeOfAttachment, typeOfGuarante, typeOfPriceOfOrderDetail } from '@/constants'
import { translate } from '@/context/translationProvider'
import RenderFireLottie from '@/lotties'
import { TOrderDetail } from '@/types'
import { formatDDMMYYYY, formatLocalTime, getPriceDetails, haversineDistance } from '@/utils'

import { Progress } from '@nextui-org/react'
import { Add, Clock, CloseCircle, Location, MessageQuestion, ShieldTick } from 'iconsax-react'
import React, { memo, useMemo, useState } from 'react'

type TOrderDetailHeader = {
  orderDetail: TOrderDetail | null
}
const OrderDetailHeader: React.FC<TOrderDetailHeader> = ({ orderDetail }) => {
  const od = translate('OrderDetailHeader')
  const percent = 100 - Number(orderDetail?.guarantee?.percent) < 0 ? 0 : 100 - Number(orderDetail?.guarantee?.percent)

  const queryParams = new URLSearchParams(location.search)
  const worker_id = Number(queryParams.get('worker_id'))
  const currentId = Number(queryParams.get('currentId'))
  const isClient = !!worker_id
  const coord1 = { lat: Number(orderDetail?.location?.lat), lng: Number(orderDetail?.location?.lng) }
  const coord2: any = orderDetail?.worker_list.find((worker) => worker?.id === (isClient ? worker_id : currentId))?.location
  //caculate km between client and worker
  const distance = haversineDistance(coord2, coord1)

  const [isOpen, setIsOpen] = useState(false)
  const [isOpenExplainPrice, setIsOpenExplainPrice] = useState(false)

  const [isOpenModalVideo, setIsOpenModalVideo] = useState(false)
  const [urlVideo, setUrlVideo] = useState('')
  const isHasProcess = orderDetail?.guarantee.status == typeOfGuarante.active

  const conditionsShowAddress = useMemo(() => {
    return Number(orderDetail?.status) >= 2 && Number(orderDetail?.status) <= 9
  }, [orderDetail])

  const detailOrderDisplay = useMemo(() => getPriceDetails(orderDetail as TOrderDetail), [orderDetail])
  const handleToggleModal = () => {
    setIsOpen(!isOpen)
  }

  const handleOpenExplainPrice = () => {
    setIsOpenExplainPrice(!isOpenExplainPrice)
  }

  const handleToggleModalVideo = () => {
    setIsOpenModalVideo(!isOpenModalVideo)
  }

  const handlePlayVideo = (url: string) => {
    setUrlVideo(url)
    handleToggleModalVideo()
  }

  return (
    <>
      <DefaultModal isOpen={isOpenModalVideo} onOpenChange={handleToggleModalVideo} className='mx-4'>
        <ButtonOnlyIcon className='absolute right-0 top-0' onClick={handleToggleModalVideo}>
          <CloseCircle variant='Bold' size={32} className='text-primary-black' />
        </ButtonOnlyIcon>
        <video controls src={urlVideo} width='100%' height='100%' />
      </DefaultModal>
      <DefaultModal isOpen={isOpen} onOpenChange={handleToggleModal} className='mx-4'>
        <div className='w-full'>
          <div className='flex w-full items-center justify-between'>
            <p className='font-bold'>{od?.title}</p>
            <ButtonOnlyIcon onClick={handleToggleModal}>
              <Add className='rotate-45' size={32} />
            </ButtonOnlyIcon>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1 text-sm'>
              <p className='font-bold'>{orderDetail?.problems?.[0]?.title?.vi}</p>
              <p>{orderDetail?.problems?.[0]?.description}</p>
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
                {/* if client show address, if not client show distance */}
                <p>{isClient ? orderDetail?.location?.address : conditionsShowAddress ? orderDetail?.location?.address : `${distance} Km`}</p>
              </div>
              {orderDetail?.guarantee.status != typeOfGuarante.cancel && (
                <div className='flex items-center gap-2'>
                  <span>
                    <ShieldTick size={20} className='text-primary-green' variant='Bold' />
                  </span>
                  <p>
                    {od?.text3} {orderDetail?.guarantee?.duration || 0} {od?.text4}
                  </p>
                </div>
              )}
            </div>
            {(orderDetail?.problems?.[0]?.attachments?.length as number) > 0 && (
              <div className='flex items-center gap-2'>
                {orderDetail?.problems?.[0]?.attachments.map((item) =>
                  item?.type === typeOfAttachment.image ? (
                    <div key={item?.url} className='size-[80px] overflow-hidden rounded-md'>
                      <ImageCustom src={item?.url} alt={item?.url} className='size-full' />
                    </div>
                  ) : (
                    <div onClick={() => handlePlayVideo(item?.url)} className='relative size-[80px] overflow-hidden rounded-md'>
                      <video src={item?.url} width='80px' height='80px' />
                      <div className='absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black/20'>
                        <div className='flex size-[30px] items-center justify-center rounded-full'>
                          <PlayIcon className='size-6 text-black' />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2 text-sm'>
                <p>{detailOrderDisplay.status === typeOfPriceOfOrderDetail.final_price ? od?.['text-1'] : od?.text}</p>
                <span onClick={handleOpenExplainPrice}>
                  <MessageQuestion className='text-primary-gray' />
                </span>
              </div>
              <p className='font-bold text-primary-blue'>{detailOrderDisplay?.price?.toLocaleString('en-US')?.toString()}đ</p>
            </div>
          </div>
        </div>
      </DefaultModal>
      <div className='z-50 flex flex-col gap-4 bg-primary-light-gray p-4'>
        <div className='flex items-center justify-between gap-10 text-sm font-bold'>
          <p className='line-clamp-1'>{orderDetail?.problems?.[0]?.description}</p>
          <p className='whitespace-nowrap text-primary-yellow underline' onClick={handleToggleModal}>
            {od?.text5}
          </p>
        </div>
        {isHasProcess && (
          <div className='flex flex-col gap-1'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1 text-sm'>
                <span>
                  <ShieldTick size={24} variant='Bold' className='text-primary-green' />
                </span>
                <p>
                  {od?.text3} {orderDetail?.guarantee?.duration} {od?.text4}
                </p>
              </div>
              <p className='text-sm font-bold'>
                {od?.text6} {Number(orderDetail?.guarantee?.time_remaining) < 0 ? 0 : orderDetail?.guarantee?.time_remaining} {od?.text4}
              </p>
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
        )}
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
            {/* <p className='font-bold'>{od?.text}</p> */}
            <p className='font-bold'>{detailOrderDisplay?.status === typeOfPriceOfOrderDetail.final_price ? od?.['text-1'] : od?.text}</p>
            {/* <p className='text-sm'>{od?.text1}.</p> */}
            <p className='text-sm'>{detailOrderDisplay?.status === typeOfPriceOfOrderDetail.final_price ? od?.['text1-1'] : od?.text1}.</p>
          </div>
          <PrimaryButton className='rounded-full font-bold text-primary-black' onClick={handleOpenExplainPrice}>
            {od?.text2}
          </PrimaryButton>
        </div>
      </DefaultModal>
    </>
  )
}

export default memo(OrderDetailHeader)
