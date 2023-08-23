import request from '@/utils/request';
import { mapTree } from 'ele-admin-plus/es';
import { toFormData } from '@/utils/common';

/**
 * 获取当前登录用户的个人信息/权限/角色
 */
export async function getUserInfo() {
  const res = await request.get('/getInfo');
  if (res.data.code === 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 获取当前登录用户的菜单
 */
export async function getUserMenu() {
  const res = await request.get('/getRouters');
  if (res.data.code === 200 && res.data.data) {
    // 增加首页
    const temp = res.data.data;
    temp.unshift({
      path: '/index',
      component: 'index',
      meta: { title: '首页', icon: 'House' }
    });
    // 增加个人中心
    temp.push({
      path: '/profile',
      component: 'profile',
      meta: { title: '个人中心', icon: 'User', active: '/index', hide: true }
    });
    // 增加EleAdmin链接
    temp.push({
      path: 'https://plus.eleadmin.com',
      meta: { title: 'EleAdmin', icon: 'Link' }
    });
    // 修改图标
    return mapTree(temp, (item) => {
      return {
        ...item,
        meta: {
          ...item.meta,
          icon: ruoYiIcons[item.meta.icon] ?? item.meta.icon
        }
      };
    });
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改当前登录用户的密码
 */
export async function updatePassword(data) {
  const res = await request.put(
    '/system/user/profile/updatePwd',
    toFormData(data)
  );
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

// 若依默认菜单图标名称
export const ruoYiIcons = {
  system: 'Setting',
  peoples: 'Postcard',
  'tree-table': 'Operation',
  tree: 'OfficeBuilding',
  post: 'Suitcase',
  dict: 'Collection',
  edit: 'SetUp',
  message: 'ChatDotSquare',
  log: 'Memo',
  form: 'Tickets',
  logininfor: 'Calendar',
  monitor: 'Odometer',
  online: 'Connection',
  job: 'Timer',
  druid: 'DataLine',
  server: 'DataAnalysis',
  redis: 'DataBoard',
  'redis-list': 'Coin',
  tool: 'SuitcaseLine',
  build: 'Edit',
  code: 'MagicStick',
  swagger: 'Aim',
  guide: 'Link'
};
