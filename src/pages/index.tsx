import { fetchMessage, handlePostMessage } from '@/apis'
import ToastComponent from '@/components/ToastComponent'
import { typeOfBlockMessage, typeOfRule, typeOfSocket } from '@/constants'
import ConverstaionsSkeleton from '@/modules/ConversationsSkeleton'
import { Message, TConversationInfo, THandleSendMessage, THandleSendMessageApi, TMeta, TPayloadHandleSendMessageApi } from '@/types'
import { groupConsecutiveMessages } from '@/utils'
import { useNetworkState, useVisibilityChange } from '@uidotdev/usehooks'
import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import useSound from 'use-sound'
import seenSound from '../../public/seen.mp4'

const Header = lazy(() => import('@/modules/Header/Header'))
const FooterInput = lazy(() => import('@/modules/FooterInput/FooterInput'))
const Conversation = lazy(() => import('@/modules/Conversation/Conversation'))
const ScrollToBottom = lazy(() => import('@/components/ScrollToBottom'))

import { useSocket } from '@/context/SocketProvider'
import { translate } from '@/context/translationProvider'
import { CircularProgress } from '@nextui-org/react'

const HomePage = () => {
  const m = translate('MessageOfMessageBlock')

  const queryParams = new URLSearchParams(location.search)
  const socket: any = useSocket()
  const orderId = Number(queryParams.get('orderId'))
  const currentId = Number(queryParams.get('currentId'))
  const worker_id = Number(queryParams.get('worker_id'))
  const isAdmin = queryParams.get('isAdmin') === 'true'

  //sound
  const [play] = useSound(seenSound)
  const isClient = !!worker_id

  const [onFetchingMessage, setOnFetchingMessage] = useState<boolean>(false)
  const [conversation, setConversation] = useState<Message[]>([])
  const [conversationInfo, setConversationInfo] = useState<TConversationInfo | null>(null)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [onReloadMessage, setOnReloadMessage] = useState<boolean>(false)
  const [isCancleOrder, setIsCancleOrder] = useState<boolean>(false)
  const [messageBlock, setMessageBlock] = useState<string>('')
  const [meta, setMeta] = useState<TMeta | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoadMoreMessage, setIsLoadMoreMessage] = useState<boolean>(false)

  const groupedMessages = useMemo(() => groupConsecutiveMessages(conversation), [conversation])
  const groupedMessagesClone = [...groupedMessages]
  const groupedMessagesCloneReverse = [...groupedMessagesClone].reverse()
  const isCanLoadMore = meta ? currentPage < meta?.total_pages : false
  //@ts-ignore
  const [showScrollToBottom, setShowScrollToBottom] = useState<boolean>(false)

  const documentVisible = useVisibilityChange()
  const network = useNetworkState()

  const handleSendMessage = useCallback(
    async ({ message, type = 0, attachment }: THandleSendMessage) => {
      // await handleGetMessage()
      const newMessage: Message = {
        content: message.trim(),
        // id: `${orderId}-${conversationInfo?.worker_id}-${conversation?.length}`,
        id: Date.now(),
        seen: null,
        type,
        by: {
          id: currentId,
          profile_picture: '',
          avatar: null,
          full_name: ''
        },
        created_at: Date.now(),
        status: 'pending'
      }

      // turn off typing
      socket.emit(typeOfSocket.MESSAGE_TYPING, {
        socketId: socket.id,
        message: '',
        orderId: conversationInfo?.order_id,
        workerId: conversationInfo?.worker_id,
        currentId
      })

      if (attachment) {
        newMessage.attachments = [{ url: URL.createObjectURL(attachment) }] as any
      }

      setConversation((prevConversation) => [...prevConversation, newMessage])

      try {
        await handleSendMessageApi({ message, messageId: newMessage.id, type, attachment, socket_id: socket.id })
        if (type == 1) {
          setCurrentPage(1)
          setOnReloadMessage(true)
        }
      } catch (error) {
        console.error(error)
      }
    },
    [currentId, conversation, conversationInfo, socket]
  )

  const handleSendMessageApi = async ({ message, messageId, type = 0, attachment, socket_id }: THandleSendMessageApi) => {
    let timer
    try {
      const payload: TPayloadHandleSendMessageApi = isClient
        ? { content: message, worker_id, type, socket_id, conversationId: conversationInfo?.conversation_id as number, messageId }
        : { content: message, type, socket_id, conversationId: conversationInfo?.conversation_id as number, messageId }

      if (type === 1) {
        payload.attachment = attachment
      }

      setIsSendingMessage(true)
      await handlePostMessage({ orderId, payload })
      clearTimeout(timer)

      handleScrollToBottom()

      setIsSendingMessage(false)

      setConversation((prevConversation) => prevConversation.map((msg) => (msg.id === messageId && msg.status !== typeOfSocket.SEEN ? { ...msg, status: 'sent' } : msg)))
    } catch (error) {
      console.error(error)
      setIsSendingMessage(false)
      setTimeout(() => {
        setConversation((prevConversation) => prevConversation.map((msg) => (msg.id === messageId ? { ...msg, status: 'failed' } : msg)))
      }, 300)
    }
  }

  const handleGetMessage = useCallback(
    async (isLoadMore: boolean = false) => {
      try {
        const data = await fetchMessage({ orderId, socket_id: socket?.id, ...(isClient && { worker_id }), page: currentPage, limit: 20 })

        setConversationInfo(data)

        if (!data?.worker_id || !data?.order_id) {
          return ToastComponent({
            type: 'error',
            message: 'Lỗi mạng vui lòng kiểm tra lại'
          })
        }
        if (isLoadMore) {
          // setItems((prevItems) => prevItems.concat(Array.from({ length: 20 })))
          // setConversation((prevConversation) => prevConversation.concat(data?.data))
          setConversation((prevConversation) => [...data?.data, ...prevConversation])
        } else {
          setConversation(data?.data)
        }

        setMeta(data?.meta)
      } catch (error) {
        console.error(error)
      } finally {
        setOnFetchingMessage(false)
        setIsLoadMoreMessage(false)
        setOnReloadMessage(false)
        socket?.emit(typeOfSocket.CHECK_ONLINE_STATUS, { workerId: isClient ? worker_id : currentId, orderId: orderId })
      }
    },
    [currentPage, isClient, orderId, worker_id, socket]
  )

  const loadMoreMessages = useCallback(() => {
    if (meta && currentPage < meta.total_pages) {
      setCurrentPage((prevPage) => prevPage + 1)
      setIsLoadMoreMessage(true)
    }
  }, [meta, currentPage])

  useEffect(() => {
    if (onFetchingMessage) {
      handleGetMessage()
    }
  }, [onFetchingMessage, handleGetMessage])

  useEffect(() => {
    if (isLoadMoreMessage) {
      setTimeout(() => {
        handleGetMessage(true)
      }, 1500)
    }
  }, [isLoadMoreMessage, handleGetMessage])

  useEffect(() => {
    setOnFetchingMessage(true)
  }, [])

  const messageOfMessageBlock = {
    cancelOrder: m?.cancelOrder,
    acceptPrice: m?.acceptPrice,
    completeOrder: m?.completeOrder,
    expressGuarantee: m?.expressGuarantee
  } as const

  const getMessageByBlockType = (blockType: string): string | undefined => {
    //@ts-ignore
    const entry = Object.entries(typeOfBlockMessage).find(([key, value]) => value === blockType)
    return entry ? messageOfMessageBlock[entry[0] as keyof typeof messageOfMessageBlock] : undefined
  }

  const handleScrollToBottom = useCallback(() => {
    const scrollableDiv = document.getElementById('scrollableDiv')
    if (!scrollableDiv) return
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight
  }, [])

  // Ví dụ sử dụng
  // const messageBlock = getMessageByBlockType('BLOCKED BY COMPLETED ORDER')

  useEffect(() => {
    let fristTime = true
    if (!conversationInfo?.order_id || !conversationInfo?.worker_id || conversationInfo == null || network.online === false || documentVisible === false) return

    socket.emit(typeOfSocket.JOIN_CONVERSATION_ROOM, { workerId: conversationInfo?.worker_id, orderId: conversationInfo?.order_id })

    socket.on(typeOfSocket.MESSAGE_BLOCK, (data: any) => {
      setMessageBlock(getMessageByBlockType(data?.status as string) || '')
      setIsCancleOrder(true)
    })

    socket.on(typeOfSocket.MESSAGE_SEEN, (data: any) => {
      if (conversation.length === 0) return

      // seen all message in conversation when user get message
      if (data.status === 'SEEN MESSAGE') {
        if (data?.socket_id == socket?.id) return
        // ToastComponent({
        //   type: 'success',
        //   message: 'Bạn đã nhận được tin nhắn mới'
        // })
        setConversation((prev) =>
          prev.map((message) => ({
            ...message,
            status: 'seen'
          }))
        )
        if (isLoadMoreMessage) return
        if (fristTime) {
          play()
          fristTime = false
        }
      } else {
      }
    })

    //@ts-ignore
    socket.on(typeOfSocket.SEEN, (data: any) => {
      // setConversation((prevConversation) => prevConversation.map((msg) => (msg.id == data?.data?.messageId ? { ...msg, status: 'seen' } : msg)))

      setConversation((prev) =>
        prev.map((message) => ({
          ...message,
          status: 'seen'
        }))
      )

      if (fristTime) {
        play()
        fristTime = false
      }
    })

    socket.on(typeOfSocket.MESSAGE_ARRIVE, (data: any) => {
      if (data?.socket_id == socket?.id) {
      } else {
        setConversation((prevConversation) => [...prevConversation, data?.message])

        //khang
        socket.emit(typeOfSocket.SEEN, { messageId: data?.message?.id, conversationId: conversationInfo?.conversation_id, orderId: conversationInfo?.order_id, workerId: conversationInfo?.worker_id })

        socket.emit(typeOfSocket.MESSAGE_SEEN, {
          workerId: conversationInfo?.worker_id,
          orderId: conversationInfo?.order_id,
          currentId,
          message_id: data?.message?.id,
          conversationId: conversationInfo?.conversation_id,
          socketId: socket?.id
        })
      }
    })

    fristTime = true

    return () => {
      socket.off(typeOfSocket.MESSAGE_ARRIVE)
      socket.off(typeOfSocket.MESSAGE_SEEN)
      socket.off(typeOfSocket.SEEN)
      // socket.off(typeOfSocket.MESSAGE_BLOCK)
    }
  }, [conversationInfo, conversation, socket])

  useEffect(() => {
    if (documentVisible) {
      if (!isAdmin) {
        setOnReloadMessage(true)
      }

      const handleVisibilityChange = () => {
        socket?.emit(typeOfSocket.JOIN_CONVERSATION_ROOM, { workerId: conversationInfo?.worker_id, orderId: conversationInfo?.order_id })
      }

      handleVisibilityChange()
    }
  }, [documentVisible, network])

  useEffect(() => {
    if (onFetchingMessage) return
    onReloadMessage && handleGetMessage()
  }, [onReloadMessage, handleGetMessage, onFetchingMessage])

  const handleAutoSendMessage = async () => {
    if (true) return
    for (let i = 1; i <= 50; i++) {
      await handleSendMessage({ message: `Message ${i}` })
    }
  }

  useEffect(() => {
    setTimeout(() => {
      handleAutoSendMessage()
    }, 2000)
  }, [])

  const handleScroll = (e: any) => {
    const scrollTop = e.target.scrollTop // How much the user has scrolled vertically

    setShowScrollToBottom(scrollTop < -200)
  }

  return (
    <div className={`relative flex h-dvh flex-col`}>
      <Suspense fallback={null}>
        <Header workerId={Number(conversationInfo?.worker_id)} conversationInfo={conversationInfo} onFetchingMessage={onFetchingMessage} />
      </Suspense>
      <Suspense fallback={null}>
        {onFetchingMessage ? (
          <ConverstaionsSkeleton />
        ) : (
          <div
            id='scrollableDiv'
            style={{
              height: '100%',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column-reverse',
              background: '#F8F8F8'
            }}
          >
            <InfiniteScroll
              dataLength={conversation.length}
              next={loadMoreMessages}
              style={{ display: 'flex', flexDirection: 'column-reverse', padding: '0 8px 10px 8px', gap: 12 }}
              inverse={true}
              hasMore={isCanLoadMore}
              onScroll={handleScroll}
              loader={
                isLoadMoreMessage && (
                  <div
                    style={{
                      display: isLoadMoreMessage ? 'flex' : 'none'
                    }}
                    className='flex w-full items-center justify-center py-2'
                  >
                    <CircularProgress
                      size='md'
                      classNames={{
                        svg: 'h-6 w-6 text-primary-blue'
                      }}
                    />
                  </div>
                )
              }
              scrollableTarget='scrollableDiv'
            >
              <Suspense fallback={null}>
                <ScrollToBottom showScrollToBottom={showScrollToBottom} />
              </Suspense>
              <Conversation conversation={groupedMessagesCloneReverse} conversationInfo={conversationInfo} />
            </InfiniteScroll>
          </div>
        )}
      </Suspense>

      {isCancleOrder ? (
        <p className='z-50 bg-white p-3 text-center text-sm text-primary-gray'>{messageBlock}.</p>
      ) : (
        <Suspense fallback={null}>
          {isAdmin ? (
            <></>
          ) : (
            <FooterInput
              handleSendMessage={handleSendMessage}
              onReloadMessage={onReloadMessage}
              isSendingMessage={isSendingMessage}
              onFetchingMessage={onFetchingMessage}
              conversationInfo={conversationInfo}
            />
          )}
        </Suspense>
      )}
    </div>
  )
}

export default memo(HomePage)
