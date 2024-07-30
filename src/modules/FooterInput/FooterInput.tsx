import { Button, Textarea } from '@nextui-org/react'
import { Send2 } from 'iconsax-react'
import React from 'react'

const FooterInput = () => {
  return (
    <div className='sticky bottom-0 left-0 right-0 flex flex-col gap-2'>
      <div className='flex items-end gap-2'>
        <Textarea
          minRows={1}
          maxRows={3}
          autoFocus
          maxLength={150}
          radius='none'
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          spellCheck='false'
          placeholder='Bắt đầu trò chuyện'
          endContent={
            <Button isIconOnly radius='full' className='flex items-center justify-center bg-transparent text-primary-green'>
              <Send2 variant='Bold' className='rotate-45 transition' />
            </Button>
          }
          classNames={{
            base: 'px-4 border-t-1 border-[#E4E4E4]',
            innerWrapper: 'items-end',
            input: 'text-primary-base placeholder:pl-1 pb-1 caret-primary-yellow placeholder:text-primary-gray placeholder:text-sm text-base',
            inputWrapper:
              'p-1  !min-h-14 border-none bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-0 group-data-[focus-visible=true]:ring-offset-background shadow-none'
          }}
        />
      </div>
    </div>
  )
}

export default FooterInput
