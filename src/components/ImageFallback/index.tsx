'use client'

import { Image, ImageProps } from '@nextui-org/react'
import { useState, forwardRef, Ref } from 'react'
import { twMerge } from 'tailwind-merge'

interface ImageFallbackProps extends ImageProps {
  fallback?: string
}

const ImageFallback = forwardRef(({ src, alt, className, fallback: customFallback = '/default.webp', ...props }: ImageFallbackProps, ref: Ref<HTMLImageElement>) => {
  const [fallback, setFallback] = useState<string>('')

  const handleError = () => {
    setFallback(customFallback)
  }

  return (
    <Image removeWrapper className={twMerge('rounded-none lg:pointer-events-none lg:select-none', className)} ref={ref} src={(fallback || src) as any} alt={alt} {...props} onError={handleError} />
  )
})

export default ImageFallback
