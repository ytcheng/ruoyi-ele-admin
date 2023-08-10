/* 全局安装 */
import ElementPlus from 'element-plus';
import EleAdminPlus from 'ele-admin-plus';
import 'element-plus/theme-chalk/src/index.scss';
import 'ele-admin-plus/es/style/index.scss';

const installer = {
  install(app) {
    app.use(ElementPlus);
    app.use(EleAdminPlus);
  }
};

export default installer;
