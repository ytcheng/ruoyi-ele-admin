import request from '@/utils/request';
import { download, toFormData } from '@/utils/common';

/**
 * 分页查询用户
 */
export async function pageUsers(params) {
  const res = await request.get('/system/user/list', { params });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 根据id查询用户
 */
export async function getUser(id) {
  const res = await request.get('/system/user/' + id);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 添加用户
 */
export async function addUser(data) {
  const res = await request.post('/system/user', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改用户
 */
export async function updateUser(data) {
  const res = await request.put('/system/user', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 删除用户
 */
export async function removeUser(id) {
  const res = await request.delete('/system/user/' + id);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 批量删除用户
 */
export async function removeUsers(ids) {
  const res = await request.delete('/system/user/' + ids.join());
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改用户状态
 */
export async function updateUserStatus(userId, status) {
  const res = await request.put('/system/user/changeStatus', {
    userId,
    status
  });
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 重置用户密码
 */
export async function updateUserPassword(userId, password) {
  const res = await request.put('/system/user/resetPwd', {
    userId,
    password
  });
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 导出用户列表
 */
export async function exportUsers(params) {
  const res = await request({
    url: '/system/user/export',
    method: 'POST',
    data: toFormData(params),
    responseType: 'blob'
  });
  download(res.data, `user_${new Date().getTime()}.xlsx`);
}

/**
 * 下载用户导入模板
 */
export async function downloadTemplate() {
  const res = await request({
    url: '/system/user/importTemplate',
    method: 'POST',
    responseType: 'blob'
  });
  download(res.data, `user_template_${new Date().getTime()}.xlsx`);
}

/**
 * 导入用户
 */
export async function importUsers(file, isUpdate) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('updateSupport', isUpdate);
  const res = await request.post('/system/user/importData', formData);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 查询用户角色
 */
export async function getUserRole(id) {
  const res = await request.get('/system/user/authRole/' + id);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改用户角色
 */
export async function setUserRole(data) {
  const res = await request.put('/system/user/authRole', toFormData(data));
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}
