import request from '@/utils/request';
import { download, toFormData, toURLSearch } from '@/utils/common';

/**
 * 分页查询调度日志
 */
export async function pageJobLogs(params) {
  const res = await request.get('/monitor/jobLog/list?' + toURLSearch(params));
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 批量删除调度日志
 */
export async function removeJobLogs(ids) {
  const res = await request.delete('/monitor/jobLog/' + ids.join());
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 导出调度日志
 */
export async function exportJobLogs(params) {
  const res = await request({
    url: '/monitor/jobLog/export',
    method: 'POST',
    data: toFormData(params),
    responseType: 'blob'
  });
  download(res.data, `job_log_${new Date().getTime()}.xlsx`);
}

/**
 * 清空调度日志
 */
export async function clearJoblogs() {
  const res = await request.delete('/monitor/jobLog/clean');
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}
