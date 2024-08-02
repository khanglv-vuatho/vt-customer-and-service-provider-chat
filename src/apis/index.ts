import instance from '@/services/axiosConfig'
import { TFetchMessageOfCline, TSendMessage } from '@/types'
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

const sendMessageOfClient = async ({ orderId, payload }: TSendMessage) => {
  console.log({ payload2: objectToFormData(payload) })
  const response = await instance.post(`/webview/conversations/${orderId}`, objectToFormData(payload))
  return response.data
}

const sendMessageOfWorker = async ({ orderId, payload }: TSendMessage) => {
  console.log({ payload1: objectToFormData(payload) })
  const response = await instance.post(`/webview-worker/conversations/${orderId}`, objectToFormData(payload))
  return response.data
}

const fetchingDetailOrder = async ({ orderId }: { orderId: number }) => {
  const response = await instance.get(`/webview/order/${orderId}`)
  return response.data
}

export { fetchMessageOfCline, fetchMessageOfWorker, sendMessageOfClient, sendMessageOfWorker, fetchingDetailOrder }
