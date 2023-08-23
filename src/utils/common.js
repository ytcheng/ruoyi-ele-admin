import { removeToken } from '@/utils/token-util';

/**
 * 退出登录
 * @param route 是否使用路由跳转
 * @param from 登录后跳转的地址
 * @param push 路由跳转方法
 */
export function logout(route, from, push) {
  removeToken();
  if (route && push) {
    push({
      path: '/login',
      query: from ? { from: encodeURIComponent(from) } : void 0
    });
    return;
  }
  // 这样跳转避免再次登录重复注册动态路由
  const BASE_URL = import.meta.env.BASE_URL;
  const url = BASE_URL + 'login'; // hash 路由模式使用 '#/login'
  location.replace(from ? `${url}?from=${encodeURIComponent(from)}` : url);
}

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
  if (typeof params !== 'object' || params == null) {
    return '';
  }
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
  if (typeof params !== 'object' || params == null) {
    return formData;
  }
  Object.keys(params).forEach((key) => {
    if (params[key] != null && params[key] != '') {
      formData.append(key, params[key]);
    }
  });
  return formData;
}
