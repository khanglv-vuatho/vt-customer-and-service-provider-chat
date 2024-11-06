import React from 'react'
import ImageCustom from '../ImageCustom'
import { Information } from 'iconsax-react'

const PinMessage = () => {
  const queryParams = new URLSearchParams(location.search)
  const worker_id = Number(queryParams.get('worker_id'))

  const isClient = !!worker_id

  const title = isClient ? 'Dành cho Khách Hàng' : 'Dành cho Đối Tác Thợ'

  const content = isClient
    ? 'Để đảm bảo quyền lợi và an toàn của quý khách, vui lòng không cung cấp số điện thoại, Zalo hoặc địa chỉ cá nhân. Vua Thợ không cho phép các hành vi giao dịch/chuyển khoản riêng/tuyển dụng/cung cấp các thông tin cá nhân/các yêu cầu hủy đơn/thêm/bớt dịch vụ ngoài ứng dụng,... Tất cả giao dịch và liên hệ đều nên thực hiện thông qua ứng dụng Vua Thợ để được bảo vệ quyền lợi và hỗ trợ nhanh chóng khi cần thiết. Vua Thợ sẽ thu thập và sử dụng lịch sử chat theo Chính sách bảo mật của Vua Thợ.'
    : 'Để đảm bảo an toàn và tuân thủ quy định của Vua Thợ, vui lòng không xin số điện thoại, Zalo hoặc địa chỉ của khách hàng. Toàn bộ quy trình liên hệ và cung cấp dịch vụ đều phải thực hiện trên ứng dụng. Ngoài ra, Vua Thợ không cho phép các hành vi giao dịch/chuyển khoản riêng/tuyển dụng/cung cấp các thông tin cá nhân/các yêu cầu hủy đơn/thêm/bớt dịch vụ ngoài ứng dụng,...  Nếu vi phạm, chúng tôi sẽ có biện pháp xử lý theo quy định.'
  return (
    <div className='relative m-4 flex flex-col gap-2 rounded-lg bg-gradient-to-b from-[#FFF3EB] to-[#FFFFFF] p-4 shadow-[0px_4px_8px_0px_#0000000F]'>
      <div className='absolute right-0 top-0 opacity-20'>
        <ImageCustom src={'./shiled.png'} alt='shiled' width={83} height={83} />
      </div>
      <div className='z-10 flex items-center gap-1'>
        <Information size={12} className='text-[#EC8545]' />
        <div className='text-xs text-[#EC8545]'>{title}</div>
      </div>
      <p className='z-10 text-xs text-primary-black'>{content}</p>
    </div>
  )
}

export default PinMessage
