import axios from 'axios';
import { Message } from 'element-ui';

// 基本配置
const instance = axios.create({
  // baseURL: 'https://healthback.yutiantian.top/', // 根据实际情况修改API地址
  baseURL: 'http://127.0.0.1:8082/', // 根据实际情况修改API地址
  timeout: 5000, // 设置超时时间，单位为ms
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // 只有在 config.data 不是 FormData 的情况下才设置 Content-Type
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && data.code != 200) {
      // 根据接口返回的状态码判断是否有错误
      Message.error(`Error code ${data.code}: ${data.message}`);
      return Promise.reject(new Error(data.message));
    } else {
      return data;
    }
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default instance;
