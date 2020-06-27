import { Toast } from 'vant'
import Vue from 'vue'
import store from '../store'
import UTF8 from 'crypto-js/enc-utf8'
import Base64 from 'crypto-js/enc-base64'
import md5 from 'js-md5'
const axios = require('axios')
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.timeout = 10000

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  if (/^\/api_face\//.test(config.url)) {
    config.headers.post['Content-Type'] = 'multipart/form-data'
    return config
  }
  // 在发送请求之前做些什么
  if (config.method === 'post') {
    // 取出参数格式化
    const params = JSON.stringify(config.data || {})
    const timestamp = +new Date()
    const str = timestamp.toString() + params
    const md5Str = md5(Vue.getByteArray(str))
    const digest = Base64.stringify(UTF8.parse(md5Str))
    const unencrypted = {}
    unencrypted['token'] = store.getters.getToken
    unencrypted['digest'] = digest
    unencrypted['source'] = '3'
    unencrypted['timestamp'] = timestamp
    unencrypted['params'] = params

    window.console.groupCollapsed('%c 请求包:%c ' + config.url,
      'background:#909399 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
      'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff')
    window.console.log(unencrypted)
    window.console.log('格式化请求参数:', config.data)
    window.console.groupEnd()

    // AES加密
    const key = Vue.Generator.key(16, false)
    config.k = key
    const encryptedMsg = Vue.AES.encrypt(JSON.stringify(unencrypted), key)
    const encryptedKey = Vue.RSA.encrypt(key)
    config.data = {
      encParams: encryptedMsg,
      encKey: encryptedKey
    }
    config.headers.isEnc = true
    config.headers.encKey = encryptedKey
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  if (/^\/api_face\//.test(response.config.url)) {
    switch (response.status) {
      case 200:
        return Promise.resolve(response.data)
      default:
        Toast(response.statusText)
        return Promise.reject(response.status)
    }
    return
  }
  let res
  // 区分返回数据的类型
  const type = Vue.Type(response.data)
  if (type === 'object') {
    res = response.data
    switch (res.code) {
      case 200:
        return Promise.resolve(res)
      default:
        Toast(res.message)
        return Promise.reject(res)
    }
  } else if (type === 'string') {
    const key = response.config.k
    if (key) {
      const str = Vue.AES.decrypt(response.data, response.config.k)
      try {
        res = JSON.parse(str)
      } catch (e) {
        Toast('数据解析发生错误!')
        return res
      }
    } else {
      res = response.data
    }
  }

  window.console.groupCollapsed('%c 响应包:%c ' + response.config.url,
    'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
    'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff')
  window.console.log(res)
  window.console.groupEnd()

  switch (res.code) {
    case 200:
      return Promise.resolve(res)
    default:
      Toast(res.message)
      return Promise.reject(res)
  }
}, function (error) {
  Toast('与服务器的网络连接发生异常!')
  return Promise.reject(error)
})
