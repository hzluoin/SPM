import { Toast } from 'vant'

const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (config.method === 'post') {
    // 取出参数格式化
    const params = JSON.stringify(config.data)
    config.data = {}
    config.data['token'] = localStorage.getItem('token')
    config.data['digest'] = 'string'
    config.data['source'] = 0
    config.data['timestamp'] = 0
    config.data['params'] = params
  } else {
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  const res = response.data
  switch (res.code) {
    case 200:
      return res
    default:
      Toast(res.message)
  }
  return res
}, function (error) {
  Toast('网络异常，请稍后再试！')
  return Promise.reject(error)
})
