import axios from 'axios';
import { Notification, Message } from 'element-ui';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // 超时
  timeout: 300000,
});
// request拦截器
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    const code = res.status;

    if (code !== 200) {
      Notification.error({
        title: res.data.msg,
      });
      return Promise.reject('error');
    } else {
      return res.data;
    }
  },
  (error) => {
    Message({
      message: error.response ? error.response.data.message : error.message,
      type: 'error',
      duration: 2 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
