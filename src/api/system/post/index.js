import request from '@/utils/request';
import { download, toFormData } from '@/utils/common';

/**
 * 分页查询岗位
 */
export async function pagePosts(params) {
  const res = await request.get('/system/post/list', { params });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 添加岗位
 */
export async function addPost(data) {
  const res = await request.post('/system/post', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改岗位
 */
export async function updatePost(data) {
  const res = await request.put('/system/post', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 删除岗位
 */
export async function removePost(id) {
  const res = await request.delete('/system/post/' + id);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 批量删除岗位
 */
export async function removePosts(ids) {
  const res = await request.delete('/system/post/' + ids.join());
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 导出岗位列表
 */
export async function exportPosts(params) {
  const res = await request({
    url: '/system/post/export',
    method: 'POST',
    data: toFormData(params),
    responseType: 'blob'
  });
  download(res.data, `post_${new Date().getTime()}.xlsx`);
}

/**
 * 查询岗位列表
 */
export async function listPosts(params) {
  const res = await request.get('/system/post/optionselect', {
    params
  });
  if (res.data.code === 200 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}
