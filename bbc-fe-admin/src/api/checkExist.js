/*
 * @Author: wzy
 * @Desc: 检验用户是否被注册相关的api
 */
 import instance from 'config/instance'

 export function requestCheckExist(phone) {
	const url = 'api/v2/user/phoneCheck'
	const params = {
		phone: phone
	}
	return instance.request( {url, params} ).then( res => {
		return res.data.code === 200 && Promise.resolve(res.data.data)
	})
 }