/*
 * @Author: wzy
 * @Date: 2017-10-30 08:46:36 
 * @Desc:注册相关api封装
 */

import axios from 'axios'
import { baseURL } from 'config/config'

/**
 * 检查验证码
 * @param  {object} data: 验证码信息对象
 */
export function checkSmsForRegistration(data) {
	return axios.request( {
		url: 'api/v2/checkSmsForRegistration',
		method: 'post',
		baseURL: baseURL,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		timeout: 5000,
		params: {
			phone: data.tel,
			code: data.code
		}
	})
	.then(res =>{
		return Promise.resolve(res.data)
	})
	.catch(err => {
		return Promise.reject(err)
	})
}

/**
 * 注册账号和密码
 * @param  {object} data: 验证码信息对象
 */
export function toRegister(data) {
	return axios.request( {
		url: 'api/v2/registration',
		method: 'post',
		baseURL: baseURL,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		timeout: 5000,
		params: {
			phone: data.tel,
			code: data.code,
			password: data.password
		}
	})
	.then(res =>{
		return Promise.resolve(res.data)
	})
	.catch(err => {
		return Promise.reject(err)
	})
}
