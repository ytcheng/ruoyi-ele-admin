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

/**
 * 查询缓存列表
 */
export async function getCacheNames() {
  const res = await request.get('/monitor/cache/getNames');
  if (res.data.code === 200) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 查询缓存键名
 */
export async function getCacheKeys(name) {
  const res = await request.get('/monitor/cache/getKeys/' + name);
  if (res.data.code === 200) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 查询缓存数据
 */
export async function getCacheValue(name, key) {
  const res = await request.get('/monitor/cache/getValue/' + name + '/' + key);
  if (res.data.code === 200) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 清空缓存数据
 */
export async function clearCacheName(name) {
  const res = await request.delete('/monitor/cache/clearCacheName/' + name);
  if (res.data.code === 200) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 清空缓存数据
 */
export async function clearCacheKey(key) {
  const res = await request.delete('/monitor/cache/clearCacheKey/' + key);
  if (res.data.code === 200) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 清空全部缓存数据
 */
export async function clearCacheAll() {
  const res = await request.delete('/monitor/cache/clearCacheAll');
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}
