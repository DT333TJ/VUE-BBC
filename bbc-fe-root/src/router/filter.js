/**
 * @description: 路由过滤
 */
import router from 'router'

//路由导航钩子
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  // 退出登录
  if (to.path === '/login') {
    sessionStorage.removeItem('Logined')
  }
  // 路由跳转 权限校验
  if ( !sessionStorage.getItem('Logined') && to.meta.requireAuth) {
    next({ path: '/login' })
  } else {
    next()
  }
})