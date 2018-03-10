/**
 * @author: wzy
 * @description: token相关的api
 */
import axios from 'axios'
import { baseURL, auth } from 'config/config'

/** 
 * 获取token
 * @param {Object} param : 用户名和密码 
 */
export function requestGetToken(param) {
  const method = 'post'
  const url = 'oauth/token'
  const params = {
    'grant_type': 'password',
    username: param.userName,
    password: param.password
  }
  return axios.request({ baseURL, url, method, params, auth})
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error.response)
    })
}

/** 
 * 刷新token
 * @param {String} refreshToken:刷新token的参数 
 */
export function requestRefreshToken(refreshToken) {
  const method = 'post'
  const url = 'oauth/token'
  const params = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  }
  return axios.request({ method, baseURL, url, auth, params })
    .then(res => {
      return res.status === 200 && Promise.resolve(res.data)
    })
}