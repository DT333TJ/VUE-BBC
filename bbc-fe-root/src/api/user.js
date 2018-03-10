/*
 * @Author: wzy
 * @Desc: 用户帐号信息
 */
import instance from 'config/instance'

/**
 * 获取帐号信息
 * @param {object} data: 用户登录信息 
 */
export function requestGetUserId(data) {
  const url = '/api/v2/admin/login'
  const params = {
    username: data.username,
    password: data.password,
    usertype: data.usertype
  }
  return instance.request({ url, params })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}