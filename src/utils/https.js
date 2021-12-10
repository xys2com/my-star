import axios from "axios";

// 环境的切换
if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "";
} else if (process.env.NODE_ENV === "debug") {
  axios.defaults.baseURL = "";
} else if (process.env.NODE_ENV === "production") {
  axios.defaults.baseURL = "";
}
axios.defaults.timeout = 30000;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8;multipart/form-data";
// 对请求拦截
axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject({ status: 633, message: error });
  }
);
// 对返回拦截
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.resolve({ status: 633, message: error.response });
  }
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}

/**
 *  请求arrayBuffer
 */
export function getArrayBuffer(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params,
        headers: { "Content-Type": "application/json,charset=utf-8" },
        responseType: "arraybuffer", //二进制流
      })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
}
