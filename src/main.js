import { post } from '@/utils/request'; // 引入封装的 post 方法
import dataV from '@jiaminghi/data-view';
import axios from 'axios';
import * as echarts from 'echarts';
import 'echarts-liquidfill';
import ElementUI, {
  Avatar,
  Button,
  Col,
  Dialog,
  Icon,
  Input,
  Link,
  Row,
  Table,
  TableColumn,
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import router from './router/index';

if (process.env.NODE_ENV === 'development') {
  const { initMockData } = require('../mock');
  initMockData();
}

Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;
Vue.prototype.$post = post; // 将 post 方法挂载到 Vue 原型上
Vue.use(dataV);
Vue.prototype.axios = axios;
Vue.use(Icon);
Vue.use(Avatar);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Link);
Vue.use(Input); // 引入并注册 el-input 组件
Vue.use(VueRouter);
Vue.use(ElementUI);
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
