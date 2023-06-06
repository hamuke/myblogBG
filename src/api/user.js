import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

// 恢复登录
export function getInfo() {
  return request({
    url: '/api/admin/whoami',
    method: 'get',
  })
}

// 登出
export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

// 修改密码
export function setInfo(data) {
  return request({
    url: '/api/admin',
    method: 'put',
    data
  })
}
