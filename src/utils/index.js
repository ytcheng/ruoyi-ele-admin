/**
 * 下载文件
 * @param data 二进制数据
 * @param name 文件名
 */
export function download(data, name) {
  const blob = new Blob([data], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/**
 * 参数转url字符串
 * @param params 参数
 */
export function toURLSearch(params) {
  const search = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] != null && params[key] != '') {
      search.append(key, params[key]);
    }
  });
  return search.toString();
}

/**
 * 参数转表单数据
 * @param params 参数
 */
export function toFormData(params) {
  const formData = new FormData();
  Object.keys(params).forEach((key) => {
    if (params[key] != null && params[key] != '') {
      formData.append(key, params[key]);
    }
  });
  return formData;
}
