import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 登录
const Login = r => require.ensure([], () => r(require('page/login')), 'Login')

// 忘记密码
const ForgetPassword = r => require.ensure([], () => r(require('page/forget-password')), 'ForgetPassword')
const IdentityCheck = r => require.ensure([], () => r(require('page/forget-password/identity-check')), 'IdentityCheck')
const ResetPassword = r => require.ensure([], () => r(require('page/forget-password/reset-password')), 'ResetPassword')
const ResetComplete = r => require.ensure([], () => r(require('page/forget-password/reset-complete')), 'ResetComplete')

// 注册
const Register = r => require.ensure([], () => r(require('page/register')), 'Register')
const Authentication = r => require.ensure([], () => r(require('page/register/authentication')), 'Authentication')
const SetPassword = r => require.ensure([], () => r(require('page/register/set-password')), 'SetPassword')
const RegisterComplete = r => require.ensure([], () => r(require('page/register/register-complete')), 'RegisterComplete')

// 学生管理
const StudentManage = r => require.ensure([], () => r(require('page/student-manage')), 'StudentManage')
const StudentManageContent = r => require.ensure([], () => r(require('page/student-manage/student-manage-content')), 'StudentManageContent')

// 教学管理
const TeachingManage = r => require.ensure([], () => r(require('page/teaching-manage')), 'TeachingManage')
const CourseTableManage = r => require.ensure([], () => r(require('page/teaching-manage/course-table-manage')), 'CourseTableManage')
const PrepareLessonBoard = r => require.ensure([], () => r(require('page/teaching-manage/prepare-lesson-board')), 'PrepareLessonBoard')
const PrepareLessonDetail = r => require.ensure([], () => r(require('page/teaching-manage/prepare-lesson-detail')), 'PrepareLessonDetail')

// 职工管理
const StaffManagement = r => require.ensure([], () => r(require('page/staff-management')), 'StaffManagement')
const StaffDetails = r => require.ensure([], () => r(require('page/staff-management/staff-details')), 'StaffDetails')

// 控制中心
const ControlCenter = r => require.ensure([], () => r(require('page/control-center')), 'ControlCenter')
const GardenInfo = r => require.ensure([], () => r(require('page/control-center/garden-info')), 'GardenInfo')


const routers = [
  {
    path: '/',
    redirect: '/login'
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
    path: '/forget-password',
    name: 'forget-password',
    component: ForgetPassword,
    redirect: '/forget-password/identity-check',
    children: [
      {
        path: 'identity-check',
        name: 'identity-check',
        component: IdentityCheck,
        meta: {
          title: '填写信息'
        }
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: ResetPassword,
        meta: {
          title: '重置密码'
        }
      },
      {
        path: 'reset-complete',
        name: 'reset-complete',
        component: ResetComplete,
        meta: {
          title: '完成'
        }
      }
    ]
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    redirect: '/register/authentication',
    children: [
      {
        path: 'authentication',
        name: 'authentication',
        component: Authentication,
        meta: {
          title: '填写信息'
        }
      },
      {
        path: 'set-password',
        name: 'set-password',
        component: SetPassword,
        meta: {
          title: '设置密码'
        }
      },
      {
        path: 'register-complete',
        name: 'register-complete',
        component: RegisterComplete,
        meta: {
          title: '完成'
        }
      }
    ]
  },
  {
    path: '/student-manage',
    name: 'student-manage',
    component: StudentManage,
    meta: {
      title: '学生管理',
      requireAuth: true
    },
    children: [
      {
        path: ':gradeId/:classId',
        component: StudentManageContent,
        meta: {
          title: '学生管理',
          requireAuth: true
        },
      }
    ]
  },
  {
    path: '/teaching-manage',
    name: 'teaching-manage',
    component: TeachingManage,
    meta: {
      title: '课表管理',
      requireAuth: true
    },
    children: [
      {
        path: 'course-table-manage/:gradeId',
        name: 'course-table-manage',
        component: CourseTableManage,
        meta: {
          mark: 'course-table-manage',
          title: '课表管理',
          requireAuth: true
        }
      },
      {
        path: 'prepare-lesson-board',
        name: 'prepare-lesson-board',
        component: PrepareLessonBoard,
        meta: {
          mark: 'prepare-lesson-manage',
          title: '备课看板',
          requireAuth: true
        }
      },
      {
        path: 'prepare-lesson-detail',
        name: 'prepare-lesson-detail',
        component: PrepareLessonDetail,
        meta: {
          mark: 'prepare-lesson-manage',
          title: '备课明细',
          requireAuth: true
        }
      },
    ]
  },
  {
    path: '/staff-management',
    name: 'staff-management',
    component: StaffManagement,
    redirect: '/staff-management/staff-details',
    children: [
      {
        path: 'staff-details',
        name: 'staff-details',
        component: StaffDetails,
        meta: {
          title: '职工明细',
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/control-center',
    name: 'control-center',
    component: ControlCenter,
    redirect: '/control-center/garden-info',
    children: [
      {
        path: 'garden-info',
        name: 'garden-info',
        component: GardenInfo,
        meta: {
          title: '园所信息',
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/login'
  },
]

const router = new Router({
  linkActiveClass: 'router-active',
  routes: routers
})

export default router