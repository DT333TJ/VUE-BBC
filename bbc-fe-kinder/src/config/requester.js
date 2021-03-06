/** 
 * @Desc: axios实例
 */
import axios from 'axios'
import router from '@/router'
import store from 'store'
import { baseURL } from 'config/config'
import cookie from 'js-cookie'

// 创建实例
let instance = axios.create({
	baseURL,
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	},
	timeout: 30000
})

// 请求拦截器
instance.interceptors.request.use(
	config => {
		// token有效
		if (cookie.get('ktoken')) {
			config.headers.Authorization = `bearer ${cookie.get('ktoken')}`
		}
		
		// token失效
		else {
			confirm('登陆过期，为您跳转到登陆页面？') && router.replace('/login')
		}
		return config
	},
	err => {
		return Promise.reject(err)
	}
)

// 响应拦截器
instance.interceptors.response.use(
	response => {
		return response
	},
	err => {
		if (confirm('网络错误，为您跳转到登陆页面？')) {
			return router.replace('/login')
		}
		return Promise.reject(err)
	}
)

export default instance