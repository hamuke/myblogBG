import request from '@/utils/request'

// 获取关于页面的url
export function getAbout() {
  return request.get('/api/about');
}

// 设置关于页面的url
export function setAbout(data) {
  return request.post('/api/about', data);
}
