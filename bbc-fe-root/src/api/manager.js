/*
 * @Author: wzy
 * @Desc: 管理员相关的api
 */
import instance from 'config/instance'
import { commonParams } from 'config/constant'

/**
 * 获取所辖管理员列表
 * @param {string} orgId: 当前机构的Id
 */
export function requestGetManagerList(orgId) {
	const url = `api/v2/user/${orgId}/user`
	const params = {
		orgId: orgId,
		userType: 'ROOT_ADMIN'
	}
	return instance.request({url, params})
		.then( res => {
			return Promise.resolve(res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
}

/**
 * 添加超级管理员
 * @param {object} data: 超级管理员信息
 */
export function requestAddManager(data) {
	const method = 'post'
	const url = 'api/v2/user'
	const params = {
		orgId: data.activeOrgId,
		creator: commonParams.orgId,
		nickName: data.linkName,
		phone: data.phone,
		isSend: data.isSend,
		userType: 'SUPER_ADMIN'
  }
	return instance.request( { url, params, method})
		.then( res => {
			return Promise.resolve(res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
}

/**
 * 删除管理员
 * @param {string} userId: 管理员的id
 */
export function requestDeleteManager(userId) {
	const method = 'delete'
	const url = `api/v2/user/${userId}`
	const params = {
		userId: userId
  }
	return instance.request({ url, method, params })
		.then( res => {
			return Promise.resolve(res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
}

/**
 * 添加超级管理员
 * @param {object} data: 超级管理员信息
 */
export function requestPatchManager(data) {
	const method = 'patch'
	const url = 'api/v2/user'
	const params = {
		orgId: data.orgId,
		phone: data.phone,
		nickName: data.linkName,
		userId: data.userId
	}
	return instance.request({ url, method, params })
		.then(res => {
			return Promise.resolve(res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
}

/**
 * 发送短信
 * @param {object} data: 短信对象
 */
export function requestSendMessage(data) {
	const method = 'post'
	const url = 'api/v2/user/sendMsg'
	const params = {
		orgId: data.orgId,
		phone: data.phone
	}
	return instance.request({url, method, params})
		.then( res =>{
			return Promise.resolve(res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
}


