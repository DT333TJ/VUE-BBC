/**
 * @Desc 职工相关api
 */
import requester from 'config/requester'

/** 
 * 获取所有的职工列表 
 */
export function requestGetStaffs() {
  const url = '/api/v2/emp'
  return requester.request({ url })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/** 
 * 添加职工 
 */
export function requestAddStaff(data) {
  const method = 'post'
  const url = '/api/v2/emp'
  const params =  {
    empName: data.empName,
    empHead: data.empHead,
    gradeId: data.gradeId,
    classId: data.classId,
    gander: data.gender,
    phone: data.phone,
    remarks: data.remarks,
    isSend: data.isSend
  }
  return requester.request({ method, url, params })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/** 
 * 修改职工 
 */
export function requestPatchStaff(data) {
  const method = 'patch'
  const url = '/api/v2/emp'
  const params = {
    employeeId: data.employeeId,
    empName: data.empName,
    empHead: data.empHead,
    gradeId: data.gradeId,
    classId: data.classId,
    gander: data.gender,
    phone: data.phone,
    remarks: data.remarks,
    status: data.status,
    sendId: data.sendId,
    isSend: 0
  }
  return requester.request({ method, url, params })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/** 
 * 删除职工 
*/
export function requestDeleteStaff(phone) {
  const method = 'delete'
  const url = '/api/v2/emp'
  const params = {
    phone
  }
  return requester.request({ method, url, params })
    .then(response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}

/** 
 * 发送短信 
 */
export function requestSendMessage(data) {
  const method = 'post'
  const url = '/api/v2/emp/sendMsg'
  const params = {
    phone: data.phone,
    sendId: data.sendId
  }
  return requester.request({ method, url, params })
    .then( response => {
      return Promise.resolve(response.data)
    })
    .catch(error => {
      return Promise.reject(error)
    })
}