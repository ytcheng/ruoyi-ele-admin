/**
 * 登录用户状态管理
 */
import { defineStore } from 'pinia';
import { mapTree, isExternalLink } from 'ele-admin-plus/es';
import { getUserInfo, getUserMenu } from '@/api/layout';
import { API_BASE_URL } from '@/config/setting';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    // 当前登录用户的信息
    info: null,
    // 当前登录用户的菜单
    menus: null,
    // 当前登录用户的权限
    authorities: [],
    // 当前登录用户的角色
    roles: [],
    // 字典数据缓存
    dicts: {}
  }),
  actions: {
    /**
     * 请求登录用户的个人信息/权限/角色/菜单
     */
    async fetchUserInfo() {
      const result = await getUserInfo().catch((e) => console.error(e));
      // 用户信息
      this.setInfo(result?.user);
      // 用户权限
      this.authorities = result?.permissions;
      // 用户角色
      this.roles = result?.roles;
      // 用户菜单
      const userMenu = await getUserMenu().catch((e) => console.error(e));
      if (!userMenu) {
        return {};
      }
      const { menus, homePath } = formatMenus(userMenu);
      this.setMenus(menus);
      return { menus, homePath };
    },
    /**
     * 更新用户信息
     */
    setInfo(value) {
      this.info = value;
    },
    /**
     * 更新菜单数据
     */
    setMenus(value) {
      this.menus = value;
    },
    /**
     * 更新字典数据
     */
    setDicts(value, code) {
      if (code == null) {
        this.dicts = value;
        return;
      }
      this.dicts[code] = value;
    }
  }
});

/**
 * 菜单数据处理为EleProLayout所需要的格式
 * @param data 菜单数据
 * @param childField 子级的字段名称
 */
export function formatMenus(data, childField = 'children') {
  let homePath;
  let homeTitle;
  const menus = mapTree(
    data,
    (item, index, parent) => {
      const meta = item.meta;
      const menu = {
        path: (!meta.link && parent?.path ? `${parent.path}/` : '') + item.path,
        component: formatComponent(item.component),
        meta: { ...meta, hide: item.hidden, keepAlive: !meta.noCache }
      };
      const children = item[childField]?.filter?.(
        (d) => !(d.meta?.hide ?? d.hide)
      );
      if (!children?.length) {
        if (!homePath && menu.path && !isExternalLink(menu.path)) {
          homePath = menu.path;
          homeTitle = menu.meta?.title;
        }
      } else {
        const childPath = children[0].path;
        if (childPath) {
          if (!menu.redirect) {
            menu.redirect = childPath;
          }
          if (!menu.path) {
            menu.path = childPath.substring(0, childPath.lastIndexOf('/'));
          }
        }
      }
      if (!menu.path) {
        console.error('菜单path不能为空且要唯一:', item);
        return;
      }
      return menu;
    },
    childField
  );
  return { menus, homePath, homeTitle };
}

/**
 * 组件路径处理
 * @param component 组件路径
 */
function formatComponent(component) {
  if (!component) {
    return;
  }
  if ('tool/swagger/index' === component) {
    return `${API_BASE_URL}/swagger-ui/index.html`;
  }
  if ('monitor/druid/index' === component) {
    return `${API_BASE_URL}/druid/login.html`;
  }
  return `/${component}`;
}
