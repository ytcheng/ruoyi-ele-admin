import request from '@/utils/request';
import { download, toFormData, toURLSearch } from '@/utils/common';

/**
 * 分页查询代码生成
 */
export async function pageGens(params) {
  const res = await request.get('/tool/gen/list?' + toURLSearch(params));
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改代码生成
 */
export async function updateGen(data) {
  const res = await request.put('/tool/gen', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 删除代码生成
 */
export async function removeGen(id) {
  const res = await request.delete('/tool/gen/' + id);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 批量删除代码生成
 */
export async function removeGens(ids) {
  const res = await request.delete('/tool/gen/' + ids.join());
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 分页查询可导入的表
 */
export async function pageGenDbs(params) {
  const res = await request.get('/tool/gen/db/list', { params });
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 导入表
 */
export async function importTables(data) {
  const res = await request.post('/tool/gen/importTable', toFormData(data));
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 同步表
 */
export async function synchDb(name) {
  const res = await request.get('/tool/gen/synchDb/' + name);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 生成到自定义路径
 */
export async function genCode(name) {
  const res = await request.get('/tool/gen/genCode/' + name);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 生成为zip
 */
export async function genCodeZip(params) {
  const res = await request({
    url: '/tool/gen/batchGenCode',
    method: 'GET',
    params: params,
    responseType: 'blob'
  });
  download(res.data, `ruoyi_${new Date().getTime()}.zip`);
}

/**
 * 预览代码
 */
export async function previewCode(id) {
  const res = await request.get('/tool/gen/preview/' + id);
  if (res.data.code === 200 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 查询代码生成详情
 */
export async function getGenTable(id) {
  const res = await request.get('/tool/gen/' + id);
  if (res.data.code === 200 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
}
