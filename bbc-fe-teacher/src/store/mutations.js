import cookie from 'js-cookie'

const mutations = {
  // 保存用户信息
  setUserInfo: (state, userInfo) => {
    state.orgName = userInfo.orgName
    state.userName = userInfo.emp.empName
    state.userPhone = userInfo.emp.phone
    state.logged = true
  },

  // 请空用户信息
  logout: (state) => { 
    state.logged = false
    cookie.get('ttoken') && cookie.remove('ttoken')
    sessionStorage.removeItem('attendClassId')
    sessionStorage.removeItem('prepareLessonId')
  }
}

export default mutations