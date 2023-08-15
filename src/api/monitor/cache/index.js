import request from '@/utils/request';

/**
 * 查询缓存信息
 */
export async function getCache() {
  const res = await request.get('/monitor/cache');
  if (res.data.code === 200) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}
