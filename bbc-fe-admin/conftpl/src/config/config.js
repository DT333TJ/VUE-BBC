/** 
 * @Desc: 网络请求相关配置
 */

let NODE_ENV = process.env.NODE_ENV
let baseURL = ''

// 生产环境
if (NODE_ENV === 'production') {
  baseURL = '@PROD.BASEURL@'
}

// 开发环境
if (NODE_ENV === 'development') {
  baseURL = '@DEV.BASEURL@'
}

// auth验证
const auth = {
  username: 'viewshare',
  password: 'admin'
}

export {
  baseURL,
  auth
}
