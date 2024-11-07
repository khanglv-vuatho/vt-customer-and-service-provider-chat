import React from 'react'
import ImageCustom from '../ImageCustom'
import { Information } from 'iconsax-react'
import { translate, useTranslation } from '@/context/translationProvider'

const PinMessage = () => {
  const p = translate('PinMessage')

  const queryParams = new URLSearchParams(location.search)
  const worker_id = Number(queryParams.get('worker_id'))

  const isClient = !!worker_id

  const title = isClient ? p?.title : p?.title1

  const content = isClient ? p?.content : p?.content1
  return (
    <div className='relative m-4 flex flex-col gap-2 rounded-lg bg-gradient-to-b from-[#FFF3EB] to-[#FFFFFF] p-4 shadow-[0px_4px_8px_0px_#0000000F]'>
      <div className='absolute right-0 top-0 opacity-20'>
        <ImageCustom src={'./shiled.png'} alt='shiled' width={83} height={83} />
      </div>
      <div className='z-10 flex items-center gap-1'>
        <Information size={12} className='text-[#EC8545]' />
        <div className='text-xs text-[#EC8545]'>{title}</div>
      </div>
      <p className='z-10 text-xs text-primary-black'>{content}</p>
    </div>
  )
}

export default PinMessage
