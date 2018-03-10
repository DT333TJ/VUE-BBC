/*
 * @Desc: 课表管理api
 */
import requester from 'config/requester'

/**
 * 获取筛选器
 * @param {Number} gradeId 年级id
 */
export function requestGetFilterList(gradeId) {
  const url = `/api/v2/courseType/${ gradeId }`
  return requester.request({ url })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })  
} 

/**
 * 获取课程列表
 * @param {Number} gradeId 年级id
 * @param {Object} param 参数
 */
export function requestGetCourseList(gradeId, param) {
  const url = `/api/v2/${ gradeId }/course`
  const params = { 
    pageNum: param.pageIndex,
    pageSize: param.pageSize,
    editionId: param.categoryId,
    volumeId: param.courseId,
    chapterOneId: param.themeId,
    chapterTwoId: param.domainId,
    search: param.searchKeyword
  }
  return requester.request({ url, params })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })  
}

/**
 * 课程表查询
 * @param {Number} gradeId 年级id
 * @param {Number} year 年
 * @param {Number} month 月
 */
export function requestGetCourseTable(gradeId, year, month) {
  const url = `/api/v2/${ gradeId }/courseCalendar`
  const params = {
    date: `${year}-${month}`
  }
  return requester.request({ url, params })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })  
}

/**
 * 课程添加
 * @param {Object} param 参数
 */
export function requestAddCourse(param) {
  const method = 'post'
  const url = `/api/v2/${ param.gradeId }/course`
  const params = {
    corTime: param.courseDate,
    corOrder: param.courseOrder,
    resId: param.courseId
  }
  return requester.request({ method, url, params })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })  
}

/**
 * 课程删除
 * @param {Number} courseId 课程id
 */
export function requestDeleteCourse(courseId) {
  const method = 'delete'
  const url = `/api/v2/course/${courseId}`
  return requester.request({ method, url })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      return Promise.reject(err)
    })  
}