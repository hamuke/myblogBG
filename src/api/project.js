import request from '@/utils/request'

// 获取所有项目
export function getProjects() {
  return request.get('/api/project');
}

// 删除项目
export function deleteProject(id) {
  return request.delete(`/api/project/${id}`);
}

// 编辑项目
export function editProject(id,data) {
  return request({
    url: `/api/project/${id}`,
    method: 'put',
    data
  });
}

// 添加项目
export function addProject(data) {
  return request({
    url: '/api/project',
    method: 'post',
    data
  });
}
