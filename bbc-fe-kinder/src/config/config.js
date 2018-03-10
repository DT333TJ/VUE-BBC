/**
 * @Desc: 发版配置
 */

let NODE_ENV = process.env.NODE_ENV
let baseURL = ''

// 生产环境
if (NODE_ENV === 'production') {
  baseURL = 'http://192.168.0.158:8081'
}

// 开发环境
if (NODE_ENV === 'development') {
  baseURL = 'http://192.168.0.158:8081'
  
  // baseURL = 'http://123.206.87.247:8081'
  // baseURL = 'http://123.207.150.75:8081'
}

// auth验证
const auth = {
  username: 'viewshare',
  password: 'kinder'
}

// 播放器文件名
const playerFileName = 'secure_ViewBox_158'

export {
  baseURL,
  auth,
  playerFileName
}