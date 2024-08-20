import ImageCustom from '@/components/ImageCustom'
import { DefaultModal } from '@/components/Modal'
import ToastComponent from '@/components/ToastComponent'
import { Button, Image } from '@nextui-org/react'
import { Add } from 'iconsax-react'
import { memo, useEffect, useState } from 'react'

const MessageImage = ({ url }: { url: string }) => {
  const [isOpenModalImage, setIsOpenModalImage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingInModal, setIsLoadingInModal] = useState(true)

  const handleZoomImage = () => {
    setIsOpenModalImage(!isOpenModalImage)
  }

  const handleAddResizeImage = (src: string) => {
    return src.includes('blob') ? src : `${src}?width=10&height=10`
  }

  const handleOnLoadImage = () => {
    setIsLoading(false)
  }

  const handleOnLoadImageModal = () => {
    setIsLoadingInModal(false)
  }

  useEffect(() => {
    if (!isOpenModalImage) setIsLoadingInModal(true)
  }, [isOpenModalImage])

  return (
    <>
      <div onClick={isLoading ? undefined : handleZoomImage} className='max-w-[60%] overflow-hidden rounded-md'>
        {url.includes('blob') ? (
          <Image onClick={handleZoomImage} removeWrapper src={url} alt={url} className={`size-full max-h-[400px] max-w-[400px] object-cover`} />
        ) : (
          <>
            <Image removeWrapper height={400} width={400} src={handleAddResizeImage(url)} alt={url} className={`size-full min-w-[200px] object-cover blur-md ${isLoading ? 'block' : 'hidden'}`} />
            <Image removeWrapper src={url + '?width=400&height=400'} alt={url} className={`size-full object-cover ${!isLoading ? 'block' : 'hidden'}`} onLoad={handleOnLoadImage} />
          </>
        )}
      </div>
      <DefaultModal className='z-[200] h-auto max-h-[96dvh]' isOpen={isOpenModalImage} onOpenChange={handleZoomImage}>
        <div className='flex h-full flex-col items-center'>
          <div className='flex h-full w-full items-center justify-end'>
            <Button isIconOnly onClick={handleZoomImage} className='rounded-full bg-transparent text-primary-yellow'>
              <Add className='rotate-45' size={32} />
            </Button>
          </div>
          <div className='flex max-h-[700px] w-full overflow-hidden rounded-lg px-16'>
            <Image removeWrapper height={700} src={handleAddResizeImage(url)} alt={url} className={`size-full min-w-[200px] object-cover blur-md ${isLoadingInModal ? 'block' : 'hidden'}`} />
            <Image removeWrapper src={url + '?width=400&height=400'} alt={url} className={`size-full object-cover ${!isLoadingInModal ? 'block' : 'hidden'}`} onLoad={handleOnLoadImageModal} />
            <Image src={url} alt={url} />
          </div>
        </div>
        {/* <div className='relative size-full'>
          <div className='absolute -right-2 -top-2'>
            <Button isIconOnly onClick={handleZoomImage} className='z-50 rounded-full bg-transparent text-white'>
              <Add className='rotate-45' size={32} />
            </Button>
          </div>
          <ImageCustom src={url} alt={url} className='size-full' />
        </div> */}
      </DefaultModal>
    </>
  )
}

export default memo(MessageImage)
