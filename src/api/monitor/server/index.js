import request from '@/utils/request';

/**
 * 查询服务器信息
 */
export async function getServer() {
  const res = await request.get('/monitor/server');
  if (res.data.code === 200) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}
