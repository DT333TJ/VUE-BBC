/**
 * @Desc 用户相关api
 */
import requester from 'config/requester'

/** 
 * 获取用户信息（同步）
 */
export async function requestGetUserInfo() {
  const url = '/api/v2/user'
  return await requester.request({ url })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err
    })
}

/** 
 * 修改用户信息
 * @param {object} param: 用户信息 
 */
export function requestPatchUserInfo(param) {
  const method = 'patch'
  const url = '/api/v2/user'
  const params = {
    nickName: param.name,
    phone: param.phone
  }
  return requester.request({ method, url, params })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

