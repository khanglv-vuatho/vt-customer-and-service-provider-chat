import React, { memo, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageDetail } from '@/types'
import ImageFallback from '@/components/ImageFallback'
import { DefaultModal } from '@/components/Modal'
import { Add } from 'iconsax-react'
import { Button } from '@nextui-org/react'
import { downloadImage } from '@/utils'

type ImageMessageProps = {
  messageAnimation: any
  msg: MessageDetail
}

const ImageMessage: React.FC<ImageMessageProps> = ({ messageAnimation, msg }) => {
  const [isOpenModalImage, setIsOpenModalImage] = useState(false)

  const handleZoomImage = () => {
    setIsOpenModalImage(!isOpenModalImage)
  }

  const handleDownloadImage = () => {
    const imageUrl = msg.message // Assuming msg.message contains the image URL
    const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)
    downloadImage(imageUrl, filename)
  }

  return (
    <>
      <motion.div onClick={handleZoomImage} variants={messageAnimation} initial='initial' animate='animate' transition={{ duration: 0.3 }} viewport={{ once: true }} className={`max-w-[80%]`}>
        <ImageFallback src={msg.message} alt={msg.message} className='h-auto w-[200px] rounded-lg' />
      </motion.div>
      <DefaultModal className='mx-0 h-[80dvh]' isOpen={isOpenModalImage} onOpenChange={handleZoomImage}>
        <div className='flex h-full flex-col items-center justify-between'>
          <div className='flex w-full items-center justify-between'>
            <Button isIconOnly onClick={handleZoomImage} className='rounded-full bg-transparent text-primary-yellow'>
              <Add className='rotate-45' size={32} />
            </Button>
            <Button isIconOnly onClick={handleDownloadImage} className='rounded-full bg-transparent text-primary-yellow'>
              <svg viewBox='0 0 24 24' fill='currentColor' className='size-6'>
                <path d='M4.97 11.03a.75.75 0 111.06-1.06L11 14.94V2.75a.75.75 0 011.5 0v12.19l4.97-4.97a.75.75 0 111.06 1.06l-6.25 6.25a.75.75 0 01-1.06 0l-6.25-6.25zm-.22 9.47a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H4.75z' />
              </svg>
            </Button>
          </div>
          <div className='flex w-full items-center justify-center'>
            <ImageFallback src={msg.message} alt={msg.message} className='max-h-[600px] w-auto rounded-lg' />
          </div>
          <div className='opacity-0'>placeholder div</div>
        </div>
      </DefaultModal>
    </>
  )
}

export default memo(ImageMessage)
