import request from '@/utils/request';
import { mapTree } from 'ele-admin-plus';

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
    // 修改图标
    const icons = {
      system: 'Setting',
      peoples: 'Postcard',
      'tree-table': 'Operation',
      tree: 'OfficeBuilding',
      post: 'OfficeBuilding',
      dict: 'Coin',
      edit: 'SetUp',
      message: 'ChatDotSquare',
      log: 'Tickets',
      form: 'Tickets',
      logininfor: 'Calendar',
      monitor: 'Odometer',
      online: 'Link',
      job: 'Link',
      druid: 'Link',
      server: 'Link',
      redis: 'Link',
      'redis-list': 'Link',
      tool: 'Link',
      build: 'Link',
      code: 'Link',
      swagger: 'Link',
      guide: 'Link'
    };
    return mapTree(
      [
        // 增加首页
        {
          path: '/index',
          component: 'index',
          meta: { title: '首页', icon: 'House' }
        },
        ...res.data.data
      ],
      (item) => {
        return {
          ...item,
          meta: {
            ...item.meta,
            icon: icons[item.meta.icon] ?? item.meta.icon
          }
        };
      }
    );
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改当前登录用户的密码
 */
export async function updatePassword(data) {
  const res = await request.put('/auth/password', data);
  if (res.data.code === 0) {
    return res.data.message ?? '修改成功';
  }
  return Promise.reject(new Error(res.data.message));
}
