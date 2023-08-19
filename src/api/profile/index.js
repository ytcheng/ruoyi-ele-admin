import request from '@/utils/request';

/**
 * 获取当前登录用户信息
 */
export async function getUserProfile() {
  const res = await request.get('/system/user/profile');
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改当前登录用户信息
 */
export async function updateUserProfile(data) {
  const res = await request.put('/system/user/profile', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改当前登录用户头像
 */
export async function uploadAvatar(data) {
  const res = await request.post('/system/user/profile/avatar', data);
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}
