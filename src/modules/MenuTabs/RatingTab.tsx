import { memo, useState } from 'react'
import RatingItem from './RatingItem'
import { RatingTabType } from '@/types'

const RatingTab = () => {
  const intitalInfo: RatingTabType[] = [
    {
      name: 'Trần Hoàng Bảo Anh',
      timeHour: '21:33',
      timeDate: '25/03/2023',
      star: 4,
      thumbnail: '',
      description: 'Black Rover sounds like the japanese pronunciation of the english name of black clover'
    },
    {
      name: 'Trần Bảo Anh',
      timeHour: '21:33',
      timeDate: '25/03/2023',
      star: 4,
      thumbnail: '',
      description: 'Black Rover sounds like the japanese pronunciation of the english name of black clover'
    },
    {
      name: 'Trần Hoàng Anh',
      timeHour: '21:33',
      timeDate: '25/03/2023',
      star: 4,
      thumbnail: '',
      description: 'Black Rover sounds like the japanese pronunciation of the english name of black clover'
    },
    {
      name: 'Hoàng Bảo Anh',
      timeHour: '21:33',
      timeDate: '25/03/2023',
      star: 4,
      thumbnail: '',
      description: 'Black Rover sounds like the japanese pronunciation of the english name of black clover'
    }
  ]
  const [ratingInfo, setRatingInfo] = useState(intitalInfo)
  return (
    <div className='flex flex-col gap-4'>
      {ratingInfo.map((item, index) => (
        <RatingItem key={index} item={item} />
      ))}
    </div>
  )
}

export default memo(RatingTab)
