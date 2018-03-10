/*
 * @Author: wzy
 * @Desc: 用户相关的api
 */
import instance from 'config/instance'

/**
 * 获取用户id
 * @param  {object} data: 用户和密码
 */
export function requestGetUserId(data) {
  const url = 'api/v2/admin/login'
  const params = {
    username: data.username,
    password: data.password,
    usertype: 'SUPER_ADMIN'
  }
  return instance.request({ url, params })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}


/**
 * 获取用户信息
 * @param  {string} userId: 用户Id
 */
export function requestGetUserInfo(userId) {
  const url = `api/v2/user/${userId}`
  return instance.request({ url })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}
