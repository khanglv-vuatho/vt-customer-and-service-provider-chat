import { ButtonOnlyIcon } from '@/components/Buttons'
import { Add, Call } from 'iconsax-react'

const Header = () => {
  return (
    <header className='sticky left-0 right-0 top-0 flex items-center justify-between border-b-2 border-[#E4E4E4] px-4 py-2'>
      <div className='flex items-center font-bold'>
        <ButtonOnlyIcon className=''>
          <Add className='rotate-45' size={32} />
        </ButtonOnlyIcon>
        <p className='text-sm'>Trò chuyện</p>
      </div>
      <ButtonOnlyIcon className='bg-primary-blue text-white'>
        <Call size={24} variant='Bold' />
      </ButtonOnlyIcon>
    </header>
  )
}

export default Header
