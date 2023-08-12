import request, { download } from '@/utils/request';

/**
 * 分页查询操作日志
 */
export async function pageOperlogs(params) {
  const res = await request.get(
    '/monitor/operlog/list?' + new URLSearchParams(params).toString()
  );
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 导出操作日志
 */
export async function exportOperlogs(params) {
  const formData = new FormData();
  Object.keys(params).forEach((key) => {
    if (params[key] != null) {
      formData.append(key, params[key]);
    }
  });
  const res = await request({
    url: '/monitor/operlog/export',
    method: 'POST',
    data: formData,
    responseType: 'blob'
  });
  download(res.data, `post_${new Date().getTime()}.xlsx`);
}

/**
 * 批量删除操作日志
 */
export async function removeOperlogs(ids) {
  const res = await request.delete('/monitor/operlog/' + ids.join());
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 清空操作日志
 */
export async function clearOperlogs() {
  const res = await request.delete('/monitor/operlog/clean');
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}
