/*
 * @Author: wzy
 * @Date: 2017-09-25 
 * @Desc: 课程相关封装
 */

import axios from 'axios'
import { baseURL } from 'config/config'

/**
 * 发送验证码
 * @param  {string} phone: 手机号
 */
export function sendForgetMessage(phone) {
	return axios.request( {
		url: 'api/v2/user/forget',
		method: 'post',
		baseURL: baseURL,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		timeout: 5000,
		params: {
			phone: phone
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
 * 检查验证码
 * @param  {object} data: 验证码信息
 */
export function checkSmsForModifyPassword(data) {
	return axios.request( {
		method: 'post',
		url: 'api/v2/checkSmsForModifyPassword',
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
 * 重置密码
 * @param  {object} data: 重置信息对象
 */
export function modifyPassword(data) {
	return axios.request( {
		baseURL: baseURL,
		method: 'patch',
		url: 'api/v2/modifyPassword',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		timeout: 5000,
		params: {
			phone: data.phone,
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
