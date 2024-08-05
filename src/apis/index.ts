import { typeOfRule } from '@/constants'
import instance from '@/services/axiosConfig'
import { THandlePostMessage } from '@/types'
import { objectToFormData } from '@/utils'

const fetchMessage = async ({ orderId, worker_id }: { orderId: number; worker_id?: number }) => {
  const endpoint = !!worker_id ? `/webview/conversations/${orderId}` : `/webview-worker/conversations/${orderId}`
  const params = worker_id ? { worker_id } : {}
  const response = await instance.get(endpoint, { params })
  return response.data
}

const handlePostMessage = async ({ orderId, payload, rule }: THandlePostMessage) => {
  const endpoint = rule === typeOfRule.CLIENT ? '/webview/conversations' : '/webview-worker/conversations'
  const response = await instance.post(`${endpoint}/${orderId}`, objectToFormData(payload))
  return response.data
}

const fetchingDetailOrder = async ({ orderId, worker_id }: { orderId: number; worker_id: number }) => {
  const response = await instance.get(`/webview/order/${orderId}`, { params: { worker_id } })
  return response.data
}

export { fetchingDetailOrder, handlePostMessage, fetchMessage }
