import { PrimaryButton } from '@/components/Buttons'
import Header from '@/modules/Header/Header'

import ListStar from '@/modules/ListStar/ListStar'
import MenuTabs from '@/modules/MenuTabs/MenuTabs'
import Tag from '@/modules/Tag/Tag'
import { Avatar } from '@nextui-org/react'
import { MessageQuestion } from 'iconsax-react'

const HomePage = () => {
  const rating = 3

  return (
    <div className='min-h-dvh bg-primary-light-gray px-4'>
      <Header />
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-[16px_16px_32px_0px_#C1C1C129]'>
          <div className='flex items-center gap-4'>
            <Avatar name='K' className='size-20' />
            <div className='flex flex-col gap-2'>
              <p className='font-bold'>Lâm Vĩ Bon</p>
              <div className='flex items-center gap-2'>
                <ListStar rating={rating} isSpecial />
              </div>
              <div className='flex items-center gap-2'>
                <Tag>562 đơn</Tag>
                <Tag>96% hoàn thành</Tag>
              </div>
            </div>
          </div>
          <div className='flex items-end justify-between'>
            <div className='flex flex-col gap-1'>
              <p className='text-sm'>Giá dự kiến:</p>
              <div className='flex items-center gap-2 text-base text-primary-green'>
                <p>200.000đ</p>
                <span>
                  <MessageQuestion />
                </span>
              </div>
            </div>
            <div className='mb-1'>
              <PrimaryButton className='h-9 rounded-xl text-primary-black'>Đặt thợ</PrimaryButton>
            </div>
          </div>
        </div>
        <MenuTabs />
      </div>
    </div>
  )
}

export default HomePage
