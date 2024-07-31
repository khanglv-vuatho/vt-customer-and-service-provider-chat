import { ButtonOnlyIcon } from '@/components/Buttons'
import { keyPossmessage } from '@/constants'
import instance from '@/services/axiosConfig'
import { postMessageCustom } from '@/utils'
import { Add, Call, Refresh, Refresh2 } from 'iconsax-react'

const Header = () => {
  const handleClearMessage = async () => {
    const payload = {
      worker_id: 429
    }
    await instance.post('/booking/conversations/3310/clear-message', payload)
  }

  const handleCloseWebview = () => {
    postMessageCustom({
      message: keyPossmessage.CAN_POP
    })
  }
  return (
    <header className='sticky left-0 right-0 top-0 flex items-center justify-between border-b-2 border-[#E4E4E4] px-4 py-2'>
      <div className='flex items-center font-bold'>
        <ButtonOnlyIcon className='' onClick={handleCloseWebview}>
          <Add className='rotate-45' size={32} />
        </ButtonOnlyIcon>
        <p className='text-sm'>Trò chuyện</p>
      </div>
      <div className='flex gap-2'>
        <ButtonOnlyIcon className='bg-primary-blue text-white'>
          <Call size={24} variant='Bold' />
        </ButtonOnlyIcon>
        <ButtonOnlyIcon onClick={handleClearMessage} className='bg-primary-yellow text-white'>
          <Refresh size={24} variant='Bold' />
        </ButtonOnlyIcon>
      </div>
    </header>
  )
}

export default Header
