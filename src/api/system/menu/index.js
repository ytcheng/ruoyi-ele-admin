import request from '@/utils/request';
import { ruoYiIcons } from '@/api/layout';

/**
 * 查询菜单列表
 */
export async function listMenus(params) {
  const res = await request.get('/system/menu/list', { params });
  if (res.data.code === 200 && res.data.data) {
    // 若依默认菜单图标名称处理
    return res.data.data.map((d) => {
      const icon = d.icon == '#' ? void 0 : d.icon;
      return { ...d, icon: ruoYiIcons[icon] ?? icon };
    });
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 添加菜单
 */
export async function addMenu(data) {
  const res = await request.post('/system/menu', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 修改菜单
 */
export async function updateMenu(data) {
  const res = await request.put('/system/menu', data);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}

/**
 * 删除菜单
 */
export async function removeMenu(id) {
  const res = await request.delete('/system/menu/' + id);
  if (res.data.code === 200) {
    return res.data.msg;
  }
  return Promise.reject(new Error(res.data.msg));
}
