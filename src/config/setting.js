// 接口地址
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// 项目名称
export const PROJECT_NAME = import.meta.env.VITE_APP_NAME;

// 不需要登录的路由
export const WHITE_LIST = ['/login', '/forget'];

// 首页路径, 为空则取第一个菜单的地址
export const HOME_PATH = void 0;

// 外层布局的路由地址
export const LAYOUT_PATH = '/';

// 刷新路由的路由地址
export const REDIRECT_PATH = '/redirect';

// 开启页签栏后是否缓存组件
//export const TAB_KEEP_ALIVE = !import.meta.env.DEV;
export const TAB_KEEP_ALIVE = true;

// token本地缓存的名称
export const TOKEN_CACHE_NAME = 'token';

// 主题配置本地缓存的名称
export const THEME_CACHE_NAME = 'theme';

// 高德地图key, 请到高德地图官网自行申请
export const MAP_KEY = '006d995d433058322319fa797f2876f5';

// EleAdminPlus授权码
export const LICENSE_CODE = import.meta.env.VITE_LICENSE;
