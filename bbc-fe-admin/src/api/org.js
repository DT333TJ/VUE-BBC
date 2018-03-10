/*
 * @Author: wzy
 * @Desc: 机构相关的api
 */

import instance from 'config/instance'
import { sessionStorageUtil } from 'lib/util'

/**
 * 获取机构信息
 * @param  {string} orgId: 机构Id
 */
export function requestGetOrgInfo(orgId) {
    const url = `api/v2/org/${orgId}`
    const params = {
      orgId: orgId
    }
    return instance.request({url, params })
      .then(res => {
        return Promise.resolve(res.data)
      })
      .catch(err => {
        return Promise.reject(err)
      })
	}
	

/**
 * 获取所辖机构列表
 * @param  {string} orgId: 机构Id
 */
export function requestGetOrgList(orgId) {
	const url = `api/v2/org/${orgId}/orgs`
	const params = {
		orgId: orgId
	}
	return instance.request( {url, params})
		.then(res => {
			return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}	


/**
 * 添加幼儿园
 * @param  {object} data: 机构信息
 */
export function requestAddOrg(data) {
  const url = 'api/v2/org'
  const method = 'post'
  const params = {
    orgName: data.name,
    parentId: sessionStorageUtil.get('orgId'),
    isSupAdmin: true
  }
  return instance.request( { url, method, params})
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}


/**
 * 修改幼儿园
 * @param  {object} data: 机构信息
 */
export function requestPatchOrg(data) {
  const url = 'api/v2/org'
  const method = 'patch'
  const params = {
    orgName: data.name,
    orgId: data.id
  }
  return instance.request( {url, method, params})
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

/**
 * 删除幼儿园
 * @param  {string} id: 机构信息
 */
export function requestDeleteOrg(id) {
  const url = `api/v2/org/${id}`
  const method = 'delete'
  const params = {
    orgId: id
  }
  return instance.request( { url, method, params})
   .then( res => {
     return Promise.resolve(res.data)
   })
   .catch(err => {
    return Promise.reject(err)
  })
}