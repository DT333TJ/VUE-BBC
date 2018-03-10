import Vue from 'vue'
import Router from 'vue-router'

/*登录模块 */
import Login from 'page/login/login'

/*注册模块 */
import Register from 'page/register/register'
import Rstep1 from 'page/register/step1'
import Rstep2 from 'page/register/step2'
import Rstep3 from 'page/register/step3'

/*忘记密码模块 */
import Forget from 'page/forget/forget'
import Step1 from 'page/forget/step1'
import Step2 from 'page/forget/step2'
import Step3 from 'page/forget/step3'

/*机构管理员模块 */
import Manager from 'page/manager/manager'
import ManagerContent from 'page/manager/components/manager-content'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/manager'
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: Login
    },
    {
      path: '/manager',
      component: Manager,
      meta: { 
        requireAuth: true,
        title: '管理员'
      },
      children: [
        {
          path: ':orgId', //动态路由
          name: 'manager-content',
          component: ManagerContent,
          meta: { 
            requireAuth: true,
            title: '管理员'
          } 
        }
      ]
    },
    {
      path: '/register',
      component: Register,
      meta: { title: '注册'},
      redirect: '/register/step1',
      children: [
        {
          path: 'step1',
          component: Rstep1,
          meta: { title: '注册-身份验证'}
        },
        {
          path: 'step2',
          component: Rstep2,
          meta: { title: '注册-设置密码'}
        },
        {
          path: 'step3',
          component: Rstep3,
          meta: { title: '注册成功'}
        } 
      ]
    },
    {
      path: '/forget',
      component: Forget,
      name: 'forget',
      meta: { title: '忘记密码'},
      redirect: '/forget/step1',
      children: [
        {
          path: 'step1',
          component: Step1,
          meta: { title: '忘记密码-身份验证'}
        },
        {
          path: 'step2',
          component: Step2,
          meta: { title: '忘记密码-重置密码'}
        },
        {
          path: 'step3',
          component: Step3,
          meta: { title: '重置成功'}
        } 
      ]
    }
  ]
})

export default router
