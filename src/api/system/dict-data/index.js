import request from '@/utils/request';

/**
 * 查询字典数据列表
 */
export async function listDictDatas(type) {
  const res = await request.get('/system/dict/data/type/' + type);
  if (res.data.code === 200 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}
