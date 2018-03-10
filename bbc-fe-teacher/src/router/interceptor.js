/**
 * @Desc: 路由拦截器
 */
import router from 'router'
import store from 'store'
import cookie from 'js-cookie'

// 路由全局钩子
router.beforeEach((to, from, next) => {
  // 设置页面title
  document.title = to.meta.title

  // 退出登录
  if (to.path === '/login') {
    store.commit('logout')
    return next()
  } 

  // 不需要登陆
  if (!to.meta || !to.meta.requireAuth) {
    return next()
  }  

  // token失效则登陆
  if (!cookie.get('ttoken')) {
    return confirm('登陆过期，为您跳转到登陆页面？') ? next('/login') : next()
  }

  // 已登陆状态
  if (store.state.logged) {
    return next() 
  } 

  // 未登陆状态
  return fetchData(next)     
})

/**
 * 同步拉数据
 * @param {Function} next 路由钩子
 */
async function fetchData(next) {
  await store.dispatch('getUserInfo')
  return next()
}
