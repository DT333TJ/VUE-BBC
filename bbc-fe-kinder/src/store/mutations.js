import cookie from 'js-cookie'

const mutations = {
  // 保存用户信息
  setUserInfo: (state, userInfo) => {
    state.orgName = userInfo.org.orgName
    state.userName = userInfo.admin.nickName
    state.userPhone = userInfo.admin.phone
    state.logged = true
  },

  // 保存班级年级
  setGradeList: (state, gradesList) => {
    state.gradeList = gradesList
  },
  
  // 登出
  logout: (state) => { 
    state.logged = false
    cookie.get('ktoken') && cookie.remove('ktoken')
  },
}

export default mutations