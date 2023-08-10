/**
 * token操作封装
 */
import { TOKEN_CACHE_NAME } from '@/config/setting';

/**
 * 获取缓存的token
 */
export function getToken() {
  const token = localStorage.getItem(TOKEN_CACHE_NAME);
  if (!token) {
    return sessionStorage.getItem(TOKEN_CACHE_NAME);
  }
  return token;
}

/**
 * 缓存token
 * @param token token
 * @param remember 是否永久存储
 */
export function setToken(token, remember) {
  removeToken();
  if (token) {
    if (remember) {
      localStorage.setItem(TOKEN_CACHE_NAME, token);
    } else {
      sessionStorage.setItem(TOKEN_CACHE_NAME, token);
    }
  }
}

/**
 * 移除token
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_CACHE_NAME);
  sessionStorage.removeItem(TOKEN_CACHE_NAME);
}
