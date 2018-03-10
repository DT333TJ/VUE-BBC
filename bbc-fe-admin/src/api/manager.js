/*
 * @Author: wzy
 * @Desc: 管理员相关的api
 */
import instance from 'config/instance'
import { sessionStorageUtil } from 'lib/util'

/**
 * 获取当前机构所辖的所有管理员列表
 * @param  {string} orgId: 机构Id
 */
export function requestGetManagers(orgId) {
	const url = `api/v2/userLeader/${orgId}/user`
	const params = {
		orgId: orgId,
		userType: 'SUPER_ADMIN'
	}
	return instance.request( {url, params})
		.then( res => {
			return Promise.resolve(res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
}


/**
 * 添加管理员
 * @param  {object} data: 机构Id
 */
export function requestAddManager(data) {
	const url = 'api/v2/userLeader'
	const method = 'post'
	const params = {
		orgId: sessionStorageUtil.get('activeOrgId'),
		nickName: data.name,
		phone: data.tel,
		isSend: data.isSend
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
 * @param  {string} userId: 管理员Id
 */
export function requestDeleteManager(userId) {
	const url = `api/v2/userLeader/${userId}`
	const method = 'delete'
	const params = {
		userId: userId
	}
	return instance.request( { url, method, params })
		.then( res => {
			return Promise.resolve(res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
}

/**
 * 修改管理员信息
 * @param  {object} data: 管理员信息
 */
export function requestPatchManager(data) {
	const url = 'api/v2/userLeader'
	const method = 'patch'
	const params = {
		orgId: data.orgId,
		phone: data.phone,
		nickName: data.nickName,
		userId: data.userId
	}
	return instance.request( {url, method, params })
	.then(res => {
		return Promise.resolve(res.data)
	})
	.catch(err => {
		return Promise.reject(err)
	})
}

/**
 * 发送短信息
 * @param  {object} data: 信息
 */
export function requestSendMessage(data) {
	const url = 'api/v2/userLeader/sendMsg'
	const method = 'post'
	const params = {
		orgId: data.orgId,
		phone: data.phone
	}
	return instance.request( { url, method, params })
		.then( res =>{
			return Promise.resolve(res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
}