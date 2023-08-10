import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import permission from './utils/permission';
import DictData from '@/components/DictData/index.vue';
import installer from './as-needed';
import 'element-plus/theme-chalk/display.css';
import 'ele-admin-plus/es/style/nprogress.scss';
import './styles/themes/dark.scss';
import './styles/index.scss';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(permission);
app.use(installer);
app.component('DictData', DictData);

app.mount('#app');
