import request from '@/utils/request'

/**
 * 获取博客文章
 * @param {*} page 页码
 * @param {*} limit 页容量
 * @returns 
 */
export function getBlog(page = 1, limit = 10) {
  return request({
    url: '/api/blog',
    method: 'get',
    params: {
      page,
      limit
    }
  })
}

// 获取指定id文章
export function getBlogById(id) {
  return request({
    url: `/api/blog/${id}`,
    method: 'get',
  })
}

// 删除博客文章
export function deleteBlog(id) {
  return request({
    url: `/api/blog/${id}`,
    method: 'delete'
  })
}

// 添加博客文章
export function addBlog(data) {
  return request({
    url: '/api/blog',
    method: 'post',
    data
  })
}

// 编辑博客文章
// 调用这个接口时，需要传递一个对象
// {
//     id : 要修改的文章的 id,
//     data : 要修改的文章的所有内容
// }
export function editBlog(blogInfo) {
  return request({
    url: `/api/blog/${blogInfo.id}`,
    method: 'put',
    data:blogInfo.data
  })
}
