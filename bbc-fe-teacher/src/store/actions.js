import { requestGetUserInfo } from 'api/user'

/**
 * 获取用户信息（同步）
 */
export async function getUserInfo({ commit }) {
  const res = await requestGetUserInfo()
  if (res.code === 200) {
    // console.log('requestGetUserInfo SUCCESS', res)
    commit('setUserInfo', res.data)
  }
  else {
    // console.log('requestGetUserInfo FAIL', res)
  }
}


