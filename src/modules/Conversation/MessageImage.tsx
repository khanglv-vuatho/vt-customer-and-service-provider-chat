import ImageFallback from '@/components/ImageFallback'
import { downloadImage } from '@/utils'
import { memo, useState } from 'react'

const MessageImage = ({ url }: { url: string }) => {
  const [isOpenModalImage, setIsOpenModalImage] = useState(false)

  const handleZoomImage = () => {
    setIsOpenModalImage(!isOpenModalImage)
  }
  const handleDownloadImage = () => {
    const imageUrl = url // Assuming msg.message contains the image URL
    const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1)
    downloadImage(imageUrl, filename)
  }

  return (
    <div className='max-w-[80%] overflow-hidden rounded-md'>
      <ImageFallback src={url} />
    </div>
  )
}

export default memo(MessageImage)
