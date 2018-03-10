/*
 * @Desc: 备课看板api
 */
import requester from 'config/requester'

/** 
 * 获取日期参数对应的全园备课信息 
 * @param {String} curTime: 日期参数（格式为YYYY-MM-DD）
 */
export function requestGetCoursePrepare(corTime) {
  const url = '/api/v2/coursePrepare/courseGarden'
  const params = {
    corTime
  }
  return requester.request({ url ,params})
  .then(response => {
    return Promise.resolve(response.data)
  })
  .catch(error => {
    return Promise.reject(error)
  })
}

/** 
 * 根据条件查询备课列表
 * @param {object} param: 查询的条件
 */
export function requestGetPrepareList(param) {
  const url = '/api/v2/coursePrepare/courseList'
  const params = param
  return requester.request({ url, params})
    .then( response => {
      return Promise.resolve(response.data)
    })
    .catch( error => {
      return Promise.reject(error)
    })
}

/** 
 * 根据课程Id和班级Id获取资源 
 * @param {object} obj: 班级Id和课程Id
 */
export function requestGetPrepareDetail(obj) {
  const url =`/api/v2/coursePrepare/${obj.courseId}/detail/${obj.classId}`
  // const headers = {'Content-Type': 'application/json'}
  return requester.request({ url })
    .then( response => {
      return Promise.resolve(response.data)
    })
    .catch( error => {
      return Promise.reject(error)
    })
}