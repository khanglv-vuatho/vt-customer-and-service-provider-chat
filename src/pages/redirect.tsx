import { DefaultModal } from '@/components/Modal'
import { handleAddLangInUrl } from '@/utils'
import { Button } from '@nextui-org/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Redirect = () => {
  const [isOpen, setIsOpen] = useState(true)
  const navigate = useNavigate()

  const handleRedirectWorker = () => {
    navigate(
      handleAddLangInUrl({
        lang: 'vi',
        mainUrl: '/chat?currentId=1783&orderId=12299',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTc4MywiZnVsbF9uYW1lIjoiZW1pbHkiLCJwcm9maWxlX3BpY3R1cmUiOiJodHRwczovL2Nkbi1zYW5kYm94LnZ1YXRoby5jb20vaW1hZ2UvOTc0MTI3YWYtZTc1MS00ZTVmLTkwYTEtM2MwNDEyM2IyNGFhXzE3MzM3MTgyODE4MjMuanBnIiwicmVmX2lkIjoxNzgyLCJreWNfc3RhdHVzIjoyLCJ3b3JrZXJfc3RhdHVzIjoyLCJpYXQiOjE3MzM3MTgzMDN9.cdjYH6nE7u0yiFXsaWlbUmpIriAOc7Qvjd8f3jCbeBk'
      })
    )
  }

  const handleRedirectWClient = () => {
    navigate(
      // handleAddLangInUrl({
      //   lang: 'vi',
      //   mainUrl: '/chat?currentId=570&orderId=3861&worker_id=429',
      //   token:
      //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTcwLCJmdWxsX25hbWUiOiJsZWhhZ2lha2hvaSIsInByb2ZpbGVfcGljdHVyZSI6Imh0dHBzOi8vY2RuLXNhbmRib3gudnVhdGhvLmNvbS9pbWFnZS8zOGI2MTM1Yi0wY2ViLTQ4ZTEtYWE3Ny0xZjcwNWQ1ZmU0MzhfMTcyMDQyNDE0OTE1Mi5qcGciLCJyZWZfaWQiOm51bGwsImt5Y19zdGF0dXMiOjIsIndvcmtlcl9zdGF0dXMiOjIsInNlc3Npb25fbG9naW5zIjpbeyJJUCI6IjExMy4xNjEuOTAuMjIyIiwiZGV2aWNlIjoiMTcyNDMxNjg4NTAxMyIsInRpbWUiOjE3MjQzMTY4ODUwMTN9XSwiaWF0IjoxNzI0MzE2ODg1fQ.mRnY_vqDEYrlSzsRS6vf4fndFPP91C6V1H9HJM8FrU0'
      // })
      handleAddLangInUrl({
        lang: 'vi',
        mainUrl: '/chat?currentId=1781&orderId=12299&worker_id=1783',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTc4MSwiZnVsbF9uYW1lIjoiYW5oIG7DqCAiLCJwcm9maWxlX3BpY3R1cmUiOiJodHRwczovL2Nkbi1zYW5kYm94LnZ1YXRoby5jb20vaW1hZ2UvZThmNDY2MzItY2UzYS00OGFlLTg1MmMtNTMyNzIwNDEzYjA5XzE3MzM0NzUxMTgyODcuanBnIiwicmVmX2lkIjoxNzc5LCJreWNfc3RhdHVzIjoyLCJ3b3JrZXJfc3RhdHVzIjoyLCJpYXQiOjE3MzM0NzU0NDd9.5botMAfeLwOoqAr6A66mUgkOzbLzbUvVgV9sx3U74QU'
      })
    )
  }

  const handleRedirect = (role: string) => {
    setIsOpen(false)
    role == 'client' ? handleRedirectWClient() : handleRedirectWorker()
  }

  return (
    <div className='h-dvh'>
      <DefaultModal isOpen={isOpen} onOpenChange={() => {}}>
        <Button onClick={() => handleRedirect('client')} className='bg-primary-blue text-white'>
          Khách
        </Button>
        <Button onClick={() => handleRedirect('worker')} className='bg-primary-yellow text-white'>
          Thợ
        </Button>
      </DefaultModal>
    </div>
  )
}

export default Redirect
