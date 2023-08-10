import request from '@/utils/request';

/**
 * 查询部门列表
 */
export async function listDepts(params) {
  const res = await request.get('/system/dept/list', { params });
  if (res.data.code === 200 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 添加部门
 */
export async function addDept(data) {
  const res = await request.post('/system/dept', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改部门
 */
export async function updateDept(data) {
  const res = await request.put('/system/dept', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 删除部门
 */
export async function removeDept(id) {
  const res = await request.delete('/system/dept/' + id);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}
