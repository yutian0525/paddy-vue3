import request from '../request/request'; // 导入我们配置好的axios实例

const get = (url) => {
  return request.get(url);
};

const post = (url, data) => {
  return request.post(url, data);
};

const put = (url, data) => {
  return request.put(url, data);
};

const remove = (url, data) => {
  return request.delete(url, { data });
};

export { get, post, put, remove };
