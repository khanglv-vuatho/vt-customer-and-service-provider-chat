import { memo } from 'react'

type TagProps = { children: React.ReactNode }

const Tag = ({ children }: TagProps) => {
  return <div className='rounded-[4px] bg-primary-light-blue px-[10px] py-[6px] text-sm text-primary-blue'>{children}</div>
}

export default memo(Tag)
