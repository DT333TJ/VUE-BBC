import Vue from 'vue'
import Router from 'vue-router'

/*登录模块 */
import Login from 'page/login/login'

/*首页模块 */
import Org from 'page/org/org'

/*管理员模块 */
import User from 'page/user/user'
import UserContent from 'page/user/components/user-content'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/org'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/org',
      name: 'org',
      component: Org,
      meta: {
        requireAuth: true,
        title: '机构'
      }
    },
    {
      path: '/user',
      name: 'user',
      component: User,
      meta: {
        requireAuth: true,
        title: '管理员'
      },
      children: [
        {
          name: 'user-content',
          path: ':userId',
          component: UserContent,
          meta: { 
            requireAuth: true,
            title: '管理员'
          }
        }
      ]
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})

export default router