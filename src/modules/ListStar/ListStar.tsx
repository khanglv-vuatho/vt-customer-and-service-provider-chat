import { Star } from '@/components/Icons'
import React, { memo } from 'react'

// isSpecial is for special color of star rating
type StarProps = {
  rating?: number
  isSpecial?: boolean
}

const ListStar = ({ rating = 0, isSpecial = false }: StarProps) => {
  const classNameIsSpecial = isSpecial ? 'text-[#E4E4E4]' : 'text-primary-light-gray'
  return Array(5)
    .fill(0)
    .map((_, index) => <Star key={index} className={index < rating ? 'text-primary-yellow' : classNameIsSpecial} />)
}

export default memo(ListStar)
