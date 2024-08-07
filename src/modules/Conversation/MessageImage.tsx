import ImageFallback from '@/components/ImageFallback'
import { DefaultModal } from '@/components/Modal'
import { Button } from '@nextui-org/react'
import { Add } from 'iconsax-react'
import { memo, useState } from 'react'

const MessageImage = ({ url }: { url: string }) => {
  const [isOpenModalImage, setIsOpenModalImage] = useState(false)

  const handleZoomImage = () => {
    setIsOpenModalImage(!isOpenModalImage)
  }

  return (
    <>
      <div onClick={handleZoomImage} style={{ height: '' }} className='max-w-[60%] overflow-hidden rounded-md'>
        <ImageFallback src={url} />
      </div>
      <DefaultModal className='h-auto max-h-[96dvh]' isOpen={isOpenModalImage} onOpenChange={handleZoomImage}>
        <div className='flex h-full flex-col items-center'>
          <div className='flex h-full w-full items-center justify-end'>
            <Button isIconOnly onClick={handleZoomImage} className='rounded-full bg-transparent text-primary-yellow'>
              <Add className='rotate-45' size={32} />
            </Button>
          </div>
          <div className='flex max-h-[700px] overflow-hidden rounded-lg px-16'>
            <ImageFallback src={url} alt={url} className='size-full' />
          </div>
        </div>
        {/* <div className='relative size-full'>
          <div className='absolute -right-2 -top-2'>
            <Button isIconOnly onClick={handleZoomImage} className='z-50 rounded-full bg-transparent text-white'>
              <Add className='rotate-45' size={32} />
            </Button>
          </div>
          <ImageFallback src={url} alt={url} className='size-full' />
        </div> */}
      </DefaultModal>
    </>
  )
}

export default memo(MessageImage)
