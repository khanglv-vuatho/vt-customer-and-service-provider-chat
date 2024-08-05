import instance from '@/services/axiosConfig'
import { TFetchMessageOfCline, THandlePostMessage } from '@/types'
import { objectToFormData } from '@/utils'

const fetchMessageOfCline = async ({ orderId, worker_id }: TFetchMessageOfCline) => {
  const response = await instance.get(`/webview/conversations/${orderId}`, {
    params: {
      worker_id
    }
  })
  return response.data
}

const fetchMessageOfWorker = async ({ orderId }: { orderId: number }) => {
  const response = await instance.get(`/webview-worker/conversations/${orderId}`)
  return response.data
}

const handlePostMessage = async ({ orderId, payload, rule }: THandlePostMessage) => {
  const endpoint = rule === 'client' ? '/webview/conversations' : '/webview-worker/conversations'
  const response = await instance.post(`${endpoint}/${orderId}`, objectToFormData(payload))
  return response.data
}

const fetchingDetailOrder = async ({ orderId }: { orderId: number }) => {
  const response = await instance.get(`/webview/order/${orderId}`)
  return response.data
}

export { fetchMessageOfCline, fetchMessageOfWorker, fetchingDetailOrder, handlePostMessage }
