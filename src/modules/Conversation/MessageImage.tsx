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
      <DefaultModal className='mx-0 h-[80dvh]' isOpen={isOpenModalImage} onOpenChange={handleZoomImage}>
        <div className='flex h-full flex-col items-center justify-between'>
          <div className='flex w-full items-center justify-end'>
            <Button isIconOnly onClick={handleZoomImage} className='rounded-full bg-transparent text-primary-yellow'>
              <Add className='rotate-45' size={32} />
            </Button>
          </div>
          <div className='flex w-full items-center justify-center'>
            <ImageFallback src={url} alt={url} className='max-h-[600px] w-auto rounded-lg' />
          </div>
          <div className='opacity-0'>placeholder div</div>
        </div>
      </DefaultModal>
    </>
  )
}

export default memo(MessageImage)
