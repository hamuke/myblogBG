import request from '@/utils/request'

// 获取文章分类
export function getBlogType() {
  return request.get('/api/blogtype');
}

// 获取指定id文章分类
export function getBlogTypeById(id) {
  return request({
    url: `/api/blogtype/${id}`,
    method: 'get',
  })
}

// 添加文章分类
export function addBlogType(data) {
  return request({
    url: '/api/blogtype',
    method: 'post',
    data
  })
}

// 删除文章分类
export function deleteBlogType(id) {
  return request({
    url: `/api/blogtype/${id}`,
    method: 'delete',
  })
}

// 编辑文章分类
export function editBlogType(blogTypeInfo) {
  return request({
    url: `/api/blogtype/${blogTypeInfo.id}`,
    method: 'put',
    data: blogTypeInfo.data
  })
}
