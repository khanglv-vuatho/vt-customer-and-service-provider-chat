import { Avatar } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { AddCircle, TickCircle } from 'iconsax-react'
import React, { memo, useCallback, useEffect, useRef } from 'react'

import { typeOfMessage } from '@/constants'
import { MessageGroup } from '@/types'
import { formatLocalHoursTime } from '@/utils'
import MessageImage from './MessageImage'

type ConversationProps = {
  conversation: MessageGroup[]
  isAnimateChat: boolean
}

const Conversation: React.FC<ConversationProps> = ({ conversation, isAnimateChat }) => {
  const queryParams = new URLSearchParams(location.search)
  const currentId: any = Number(queryParams.get('currentId'))

  const bottomRef = useRef<HTMLDivElement>(null)

  const messageAnimation = useCallback(() => {
    return {
      initial: { x: -40, y: 10 },
      animate: {
        x: 0,
        y: 0,
        transition: {
          x: { delay: 0.1, type: 'tween', duration: 0.1 },
          y: { duration: 0.1 }
        }
      }
    }
  }, [isAnimateChat])

  const shouldRenderIconStatus = (status: 'pending' | 'sent' | 'failed'): React.ReactNode => {
    let tickIcon
    switch (status) {
      case 'pending':
        tickIcon = <div className='size-4 rounded-full ring-1 ring-inset ring-primary-blue transition' />
        break
      case 'sent':
        tickIcon = <TickCircle className='size-4 text-primary-blue transition' />
        break
      case 'failed':
        tickIcon = <AddCircle className='size-4 rotate-45 text-primary-red transition' />
        break

      default:
        break
    }

    return tickIcon
  }
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: 'instant' })
  }, [bottomRef, conversation, conversation.length, isAnimateChat])

  return (
    <div ref={containerRef} className={`flex flex-1 flex-col gap-4 overflow-auto px-4 py-3 pb-0`}>
      {conversation?.map((message, index) => {
        const isMe = message?.userId === currentId
        return (
          <div key={`message-${message?.userId}-${index}`} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
            <div className='flex w-full flex-col gap-1'>
              {!isMe && (
                <div className={`flex items-end ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
                  <Avatar size='sm' src={message?.messages?.[0]?.by?.profile_picture} />
                  <time className='text-xs text-primary-gray'>{formatLocalHoursTime(message?.messages?.[0]?.created_at)}</time>
                </div>
              )}
              <div className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'} `}>
                {message?.messages?.map((item) => {
                  return (
                    <div key={`message-${item?.id}`} className={`flex w-full items-end ${isMe ? 'justify-end' : 'justify-start'} gap-0.5`}>
                      {Number(item.type) == typeOfMessage.TEXT ? (
                        <motion.div
                          variants={isAnimateChat ? messageAnimation() : {}}
                          initial='initial'
                          animate='animate'
                          transition={{ duration: 0.3 }}
                          viewport={{ once: true }}
                          className={`max-w-[80%] rounded-lg border-1 p-3.5 ${isMe ? 'border-transparent bg-primary-light-blue' : 'border-primary-yellow bg-transparent'}`}
                        >
                          <pre className='font-inter break-words text-sm' style={{ whiteSpace: 'pre-wrap' }}>
                            {item?.content}
                          </pre>
                        </motion.div>
                      ) : (
                        <MessageImage key={`message-${item?.attachments?.[0]?.url}`} url={item?.attachments?.[0]?.url as string} />
                      )}
                      {isMe && shouldRenderIconStatus(item?.status)}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} /> {/* Bottom reference for auto-scrolling */}
    </div>
  )
}

export default memo(Conversation)
