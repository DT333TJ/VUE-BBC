import axios from 'axios'
import { baseURL, auth } from 'config/config'

/**
 * 获取token
 * @param {object} data: 
 */
export function requestGetToken(data) {
  const method = 'post'
  const url = '/oauth/token'
  const params = {
    'grant_type': 'password',
    'username': data.username,
    'password': data.password
  }
  return axios.request({ method, baseURL, url, auth, params})
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch( err => {
      return Promise.reject(err)
    })
}

/**
 * 刷新token
 * @param {string} refresh_token: 刷新token参数
 */
export function requestRefreshToken(refresh_token) {
  const method = 'post'
  const url = '/oauth/token'
  const params = {
    grant_type: 'refresh_token',
    refresh_token: refresh_token
  }
  return axios.request({ method, baseURL, url, auth, params })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}
