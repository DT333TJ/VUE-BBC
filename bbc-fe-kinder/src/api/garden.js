/**
 * @Desc 园所信息相关api
 */
import requester from 'config/requester'

/*
 * 检验用户是否被注册相关的api
 */
export function requestCheckExist(phone) {
  const url = '/api/v2/emp/phoneCheck'
  const params = {
    phone
  }
  return requester.request( { url, params})
  .then( res => {
    return Promise.resolve(res.data)
  })
}

/** 
 * 获取年级和班级（同步）
 */
export async function requestGetGradeAndClss() {
  const url = '/api/v2/coursePrepare/gradeAndClass'
  return await requester.request({ url })
    .then(res => {
      return res.data
    })
    .catch(err => {
      return err
    })
}

/** 
 * 获取所有的省份信息 
 */
export function requestGetProvinceData() {
  const url = '/api/v2/province'
  return requester.request({ url })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/** 
 * 获取对应省份的城市数据 
 */
export function requestGetCityData(provinceId) {
	const url = `/api/v2/province/${provinceId}/city`
	const params = {
		provinceId
	}
	return requester.request( { url, params})
		.then( response => {
			return Promise.resolve(response.data)
		})
    .catch(error => {
      return Promise.reject(error)
    })
}

/** 
 * 获取城市对应的县区数据 
 */
export function requestGetCountryData(cityId) {
	const url = `/api/v2/city/${cityId}/area`
	const params = {
		cityId: cityId
	}
	return requester.request({ url, params})
		.then( response => {
			return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/** 
 * 获取园所信息 
 */
export function requestGetGardenInfo() {
  const url = '/api/v2/school'
  return requester.request({ url })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/** 
 * 添加园所信息 
 */
export function requestAddGardenInfo(data) {
  const url = '/api/v2/school'
  const method = 'post'
  const params = {
    schName: data.schName,
		pdentName: data.pdentName,
		pdentPhone: data.pdentPhone,
		schPhone: data.schPhone,
		schEmail: data.schEmail,
		classNum: data.classNum,
		schFeeAmount: data.schFeeAmount,
		schFeeCycle: data.schFeeCycle,
		schProvince: data.schProvince,
		schCity: data.schCity,
		schDistrict: data.schDistrict,
		schAdd: data.schAdd,
		schFax: data.schFax,
		schPost: data.schPost,
		schIntro: data.schIntro
  }
  return requester.request({ url, method, params})
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/** 
 * 修改园所信息 
 */
export function requestPatchGardenInfo(data) {
  const url = '/api/v2/school'
  const method = 'patch'
  const params = {
    schName: data.schName,
		pdentName: data.pdentName,
		pdentPhone: data.pdentPhone,
		schPhone: data.schPhone,
		schEmail: data.schEmail,
		classNum: data.classNum,
		schFeeAmount: data.schFeeAmount,
		schFeeCycle: data.schFeeCycle,
		schProvince: data.schProvince,
		schCity: data.schCity,
		schDistrict: data.schDistrict,
		schAdd: data.schAdd,
		schFax: data.schFax,
		schPost: data.schPost,
		schIntro: data.schIntro
  }
  return requester.request({ url , method, params})
    .then( response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}