import { message } from 'antd';
import qs from 'qs';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import envConf from './envConf';

// 这里取决于登录的时候将 token 存储在哪里
const token = localStorage.getItem('token');

const instance = axios.create({
  //   timeout: 5000,  // 超时时间
  baseURL: envConf.API,
  paramsSerializer: (params) => {
    // 参数序列化：自动 encode
    return qs.stringify(params, { arrayFormat: 'brackets', skipNulls: true });
  },
  // 请求头
  headers: { 'content-type': 'application/json', Authorization: token },
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // custom config setting
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return Promise.resolve(response);
    }
    return Promise.reject(response);
  },
  (error: AxiosError) => {
    // 相应错误处理
    // 比如： token 过期， 无权限访问， 路径不存在， 服务器问题等
    switch (error.response?.status) {
      case 401:
        // token 过期
        window.location.href = '/'; // 返回登录页
        break;
      case 403:
        break;
      case 404:
        break;
      case 500:
        break;
      default:
        message.error(error.message);
        console.log('其他错误信息');
    }
    return Promise.reject(error);
  },
);

export const BlRequest = instance;

export default instance;
