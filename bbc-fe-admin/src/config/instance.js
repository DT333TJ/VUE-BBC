/**
 * @description: axios实例
 */

import axios from 'axios'
import router from 'router'
import { cookieUtil } from 'lib/util'
import { baseURL } from 'config/config'

let instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 10000
})

instance.interceptors.request.use(
  config => {
    // token有效
    if (cookieUtil.get('token')) {
      config.headers.Authorization = `bearer ${cookieUtil.get('token').access_token}`
    }
    // token失效
    else {
      router.replace('/login')
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

export default instance
