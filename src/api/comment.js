import request from '@/utils/request'

/**
 * 获取评论
 * @param {*} page 页码
 * @param {*} limit 页容量
 * @returns 
 */
export function getComment(page = 1, limit = 10) {
  return request({
    url: '/api/comment',
    method: 'get',
    params: {
      page,
      limit
    }
  })
}

// 删除评论
export function deleteComment(id) {
  return request.delete(`/api/comment/${id}`);
}
