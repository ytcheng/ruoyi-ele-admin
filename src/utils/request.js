/**
 * axios实例
 */
import axios from 'axios';
import { unref } from 'vue';
import { ElMessageBox } from 'element-plus/es';
import { API_BASE_URL, LAYOUT_PATH } from '@/config/setting';
import router from '@/router';
import { getToken } from './token-util';
import { logout } from './common';

// 创建axios实例
const service = axios.create({
  baseURL: API_BASE_URL
});

/**
 * 添加请求拦截器
 */
service.interceptors.request.use(
  (config) => {
    // 添加token到header
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 添加响应拦截器
 */
service.interceptors.response.use(
  (res) => {
    // 登录过期处理
    if (res.data?.code === 401) {
      const { path, fullPath } = unref(router.currentRoute);
      if (path == LAYOUT_PATH) {
        logout(true, void 0, router.push);
      } else if (path !== '/login') {
        ElMessageBox.close();
        ElMessageBox.alert('登录状态已过期, 请退出重新登录!', '系统提示', {
          confirmButtonText: '重新登录',
          callback: (action) => {
            if (action === 'confirm') {
              logout(false, fullPath);
            }
          },
          draggable: true
        });
      }
      return Promise.reject(new Error(res.data.msg));
    }
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
