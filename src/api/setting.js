import request from '@/utils/request'

// 获取设置页面信息
export function getSetting() {
  return request.get('/api/setting');
}

// 修改设置页面信息
export function setSetting(data) {
  return request.put('/api/setting', data);
}
