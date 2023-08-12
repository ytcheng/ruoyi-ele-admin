import request from '@/utils/request';

/**
 * 分页查询通知
 */
export async function pageNotices(params) {
  const res = await request.get('/system/notice/list', { params });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 添加通知
 */
export async function addNotice(data) {
  const res = await request.post('/system/notice', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改通知
 */
export async function updateNotice(data) {
  const res = await request.put('/system/notice', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 删除通知
 */
export async function removeNotice(id) {
  const res = await request.delete('/system/notice/' + id);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 批量删除通知
 */
export async function removeNotices(ids) {
  const res = await request.delete('/system/notice/' + ids.join());
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}
