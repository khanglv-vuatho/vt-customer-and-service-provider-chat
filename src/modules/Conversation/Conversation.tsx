import { Message } from '@/types'
import { formatLocalHoursTime } from '@/utils'
import { Avatar } from '@nextui-org/react'
import React from 'react'

type ConversationProps = {
  conversation: Message[]
}
const Conversation: React.FC<ConversationProps> = ({ conversation }) => {
  const orderId = 3310
  const worker_id = 429
  const user_id = 570

  const currentId = 429

  return (
    <div className={`flex flex-1 flex-col gap-2 overflow-auto px-4 py-3`}>
      {conversation?.map((message) => {
        const isMe = message.by.id === currentId
        return (
          <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
            <div className='flex flex-col gap-1'>
              <div className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
                <Avatar size='sm' src={message.by.profile_picture} />
                <time className='text-xs text-primary-gray'>{formatLocalHoursTime(message.created_at)}</time>
              </div>
              <p className={`flex rounded-xl p-4 ${isMe ? 'bg-primary-blue text-white' : 'bg-[#E4E4E4] text-primary-black'}`}>{message.content}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Conversation
