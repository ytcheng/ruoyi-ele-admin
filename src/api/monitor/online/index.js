import request from '@/utils/request';
import { toURLSearch } from '@/utils/common';

/**
 * 分页查询在线用户
 */
export async function pageOnlines(params) {
  const res = await request.get('/monitor/online/list?' + toURLSearch(params));
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 强退在线用户
 */
export async function kickoutOnline(id) {
  const res = await request.delete('/monitor/online/' + id);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}
