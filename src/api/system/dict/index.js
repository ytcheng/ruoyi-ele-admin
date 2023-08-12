import request from '@/utils/request';

/**
 * 查询字典类型列表
 */
export async function listDicts() {
  const res = await request.get('/system/dict/type/optionselect');
  if (res.data.code === 200 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 添加字典类型
 */
export async function addDict(data) {
  const res = await request.post('/system/dict/type', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改字典类型
 */
export async function updateDict(data) {
  const res = await request.put('/system/dict/type', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 删除字典类型
 */
export async function removeDict(id) {
  const res = await request.delete('/system/dict/type/' + id);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}
