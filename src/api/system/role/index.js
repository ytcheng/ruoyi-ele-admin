import request from '@/utils/request';

/**
 * 分页查询角色
 */
export async function pageRoles(params) {
  const res = await request.get('/system/role/list', { params });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 添加角色
 */
export async function addRole(data) {
  const res = await request.post('/system/role', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改角色
 */
export async function updateRole(data) {
  const res = await request.put('/system/role', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 删除角色
 */
export async function removeRole(id) {
  const res = await request.delete('/system/role/' + id);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 批量删除角色
 */
export async function removeRoles(ids) {
  const res = await request.delete('/system/role/' + ids.join());
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 查询角色列表
 */
export async function listRoles(params) {
  const res = await request.get('/system/role/optionselect', {
    params
  });
  if (res.data.code === 200 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}
