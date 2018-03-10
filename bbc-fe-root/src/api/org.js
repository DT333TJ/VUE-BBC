/*
 * @Author: wzy
 * @Desc: 机构相关的api
 */

import instance from 'config/instance'
import { commonParams } from 'config/constant'

/**
 * 获取所辖机构列表
 * @param {string} orgId: 当前机构的Id
 */
export function requestGetOrgList(orgId) {
	const url = `api/v2/org/${orgId}/orgs`
	const params = {
		orgId: commonParams.orgId
	}
	return instance.request({url, params})
		.then(res => {
			return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

/**
 * 获取当前Id对应的机构信息
 * @param {string} orgId: 当前机构的Id
 */
export function requestGetOrgInfo(orgId) {
	const url = `api/v2/org/${orgId}`
	const params = {
		orgId: commonParams.orgId
	}
	return instance.request({url, params})
		.then(res => {
			return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

/**
 * 添加机构
 * @param {object} data: 添加机构的信息
 */
export function requestAddOrg(data) {
	const method = 'post'
	const url = 'api/v2/org'
	const params = {
		address: data.address,
		beginTime: data.beginTime,
		endTime: data.endTime,
		orgName: data.orgName,
		linkName: data.linkName,
		phone: data.phone,
		remarks: data.remarks,
		scale: data.scale,
		parentId: commonParams.orgId,
		isSupAdmin: true
	}
	return instance.request({ url, method, params})
		.then(res => {
			return Promise.resolve(res.data)
		})
		.catch(err => {
			return Promise.reject(err)
		})
}

/**
 * 删除机构
 * @param {string} orgId: 机构的id
 */
export function requestDeleteOrg(orgId) {
	const method = 'delete'
	const url = `api/v2/org/${orgId}`
	const params = {
		orgId: orgId
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
 * 编辑机构
 * @param {object} data: 机构的信息
 */
export function requestPatchOrg(data) {
	const method = 'patch'
	const url = 'api/v2/org'
	const params = {
		linkName: data.linkName,
		address: data.address,
		beginTime: data.beginTime,
		endTime: data.endTime,
		orgName: data.orgName,
		parentId: sessionStorage.getItem('orgId'),
		orgId: data.orgId,
		phone: data.phone,
		remarks: data.remarks,
		scale: data.scale
	}
	return instance.request({ url, method, params })
		.then(res => {
			return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}