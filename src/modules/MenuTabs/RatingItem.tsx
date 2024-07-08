import { RatingTabType } from '@/types'
import { Avatar } from '@nextui-org/react'
import ListStar from '../ListStar/ListStar'
import { memo } from 'react'

type RatingItemProps = {
  item: RatingTabType
}
const RatingItem = ({ item }: RatingItemProps) => {
  return (
    <div className='flex flex-col gap-2 rounded-lg bg-white p-4'>
      <div className='flex items-center gap-2'>
        <Avatar className='size-10' src={item?.thumbnail} />
        <div className='flex flex-col gap-1'>
          <p className='text-sm font-bold'>{item?.name}</p>
          <div className='flex items-center gap-2 text-sm text-primary-gray'>
            <p>{item?.timeHour}</p>
            <p>{item?.timeDate}</p>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-1'>
        <ListStar rating={5} />
      </div>
      <span className='line-clamp-2 text-sm text-[#535353]'>{item?.description}</span>
    </div>
  )
}

export default memo(RatingItem)
