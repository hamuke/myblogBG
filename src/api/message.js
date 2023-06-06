import request from '@/utils/request'

/**
 * 获取留言
 * @param {*} page 页码
 * @param {*} limit 页容量
 * @returns 
 */
export function getMessage(page = 1, limit = 10) {
  return request({
    url: '/api/message',
    method: 'get',
    params: {
      page,
      limit
    }
  })
}

// 删除留言
export function deleteMessage(id) {
  return request.delete(`/api/message/${id}`);
}
