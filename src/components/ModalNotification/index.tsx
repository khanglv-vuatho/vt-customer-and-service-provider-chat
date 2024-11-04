import Modal from '@/modules/Modal'
import { Button, Checkbox } from '@nextui-org/react'
import { useState } from 'react'
import ImageCustom from '../ImageCustom'
import { ButtonOnlyIcon } from '../Buttons'

const ModalNotification: React.FC<{ isClient: boolean }> = ({ isClient }) => {
  const rule = isClient ? 'client' : 'worker'
  const isCheckedLocalStorage = localStorage.getItem(`isChecked-${rule}`)

  // Check if the stored timestamp is still valid (before midnight)
  const isStillValid = () => {
    const storedTime = localStorage.getItem(`checkedTime-${rule}`)
    if (!storedTime) return false

    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)

    return new Date(storedTime).getTime() < midnight.getTime()
  }

  const [isOpen, setIsOpen] = useState(!(isCheckedLocalStorage === 'true' && isStillValid()))
  const [isChecked, setIsChecked] = useState(false)
  console.log({ isCheckedLocalStorage, isOpen })

  const handleChangeChecked = (value: boolean) => {
    setIsChecked(value)
  }
  return (
    <Modal
      classNames={{
        header: `p-4 rounded-2xl bg-gradient-to-r ${isClient ? 'from-[#FFFBF6] to-[#FFFBEF]' : 'from-[#F6F9FF] to-[#EDFAFF]'}`,
        backdrop: '2',
        base: 'overflow-visible 1',
        body: 'p-4 gap-4',
        closeButton: '3',
        footer: 'border-t p-0 border-[#E4E4E4] w-full rounded-b-2xl justify-center',
        wrapper: '5 overflow-hidden'
      }}
      hideCloseButton
      placement='center'
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      modalTitle={<ModalNotificationHeader isClient={isClient} />}
      modalFooter={<ModalNotificationFooter rule={rule} isChecked={isChecked} setIsOpen={setIsOpen} isClient={isClient} />}
    >
      <ModalNotificationBody isChecked={isChecked} handleChangeChecked={handleChangeChecked} isClient={isClient} />
    </Modal>
  )
}

const ModalNotificationHeader: React.FC<{ isClient: boolean }> = ({ isClient }) => {
  const title = isClient ? 'Lưu ý' : 'Cảnh báo'
  const subtitle = isClient ? 'Trách nhiệm ngoài ứng dụng' : 'Không Chia Sẻ Thông Tin Cá Nhân'
  return (
    <div className='relative z-[900] flex items-center justify-between'>
      <div className='flex flex-col gap-1'>
        <p className={`font-bold ${isClient ? 'text-primary-yellow' : 'text-primary-blue'}`}>{title}</p>
        <p className='text-sm font-bold text-primary-black'>{subtitle}</p>
      </div>
      <div className='absolute -right-4 -top-11 z-[999]'>
        <ImageCustom src='./shiled.png' alt='shiled' width={96} height={96} className='object-contain' />
      </div>
    </div>
  )
}

type ModalNotificationBodyProps = {
  isChecked: boolean
  handleChangeChecked: (value: boolean) => void
  isClient: boolean
}

const ModalNotificationBody: React.FC<ModalNotificationBodyProps> = ({ isChecked, handleChangeChecked, isClient }) => {
  const contents = isClient
    ? [
        'Mọi thao tác liên hệ hoặc giao dịch thực hiện ngoài ứng dụng sẽ không được Vua Thợ chịu trách nhiệm và giải quyết.',
        'Hãy đảm bảo bạn luôn sử dụng dịch vụ qua ứng dụng để được bảo vệ quyền lợi và hỗ trợ tốt nhất.'
      ]
    : [
        'Vua Thợ nghiêm cấm mọi hình thức chia sẻ thông tin cá nhân để liên lạc bên ngoài nền tảng.',
        'Nếu bị phát hiện, bạn sẽ bị khóa tài khoản Vĩnh viễn.',
        'Vui lòng tuân thủ việc thao tác trên ứng dụng để đảm bảo sự minh bạch và uy tín của chính bạn.'
      ]
  return (
    <div className='flex flex-col gap-4'>
      {contents.map((content, index) => (
        <p key={index}>{content}</p>
      ))}
      <Checkbox
        classNames={{
          base: '1 ',
          icon: '2',
          label: '3 text-primary-gray group-data-[selected=true]:text-primary-blue',
          wrapper: '4'
        }}
        isSelected={isChecked}
        onValueChange={handleChangeChecked}
      >
        Không hiện lại hôm nay.
      </Checkbox>
    </div>
  )
}

type ModalNotificationFooterProps = {
  rule: string
  isChecked: boolean
  setIsOpen: (value: boolean) => void
  isClient: boolean
}

const ModalNotificationFooter: React.FC<ModalNotificationFooterProps> = ({ rule, isChecked, setIsOpen, isClient }) => {
  const handleClose = () => {
    if (isChecked) {
      // Store both the checked state and current timestamp
      localStorage.setItem(`isChecked-${rule}`, 'true')
      localStorage.setItem(`checkedTime-${rule}`, new Date().toISOString())
    }
    setIsOpen(false)
  }
  return (
    <ButtonOnlyIcon onClick={handleClose} className={`h-[50px] w-full rounded-none text-base font-bold ${isClient ? 'text-primary-yellow' : 'text-primary-blue'}`}>
      Đã hiểu
    </ButtonOnlyIcon>
  )
}

export default ModalNotification
