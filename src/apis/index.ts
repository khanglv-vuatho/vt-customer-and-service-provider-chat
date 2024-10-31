import instance from '@/services/axiosConfig'
import { THandlePostMessage } from '@/types'
import { objectToFormData } from '@/utils'

const fetchMessage = async ({ orderId, socket_id, worker_id, page, limit = 10 }: { orderId: number; socket_id: string; worker_id?: number; page: number; limit?: number }) => {
  const queryParams = new URLSearchParams(location.search)
  const isAdmin = queryParams.get('isAdmin') === 'true'
  const endpoint = `/webview/conversations/${orderId}`
  const params = worker_id ? { worker_id } : {}
  console.log('get')

  const response = await instance.get(endpoint, { params: { ...params, page, limit, socket_id, is_admin: isAdmin, isAdmin } })

  return response.data
}

const handlePostMessage = async ({ orderId, payload }: THandlePostMessage) => {
  const endpoint = '/webview/conversations'
  const response = await instance.post(`${endpoint}/${orderId}`, objectToFormData(payload))
  return response.data
}

export { handlePostMessage, fetchMessage }
