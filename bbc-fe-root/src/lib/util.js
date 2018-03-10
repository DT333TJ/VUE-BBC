/** 
 * @Desc: 工具类
 */

/**
 * localstorage工具
 */ 
export const localStorageUtil = {
  get: function(key) {
    var value = localStorage.getItem(key)
    return value ? JSON.parse(value) : ''
  },
  set: function(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove: function (key) {
    localStorage.getItem(key) && localStorage.removeItem(key)
  }
}
  
/**
 * sessionStorage工具
 */ 
export const sessionStorageUtil = {
  get: function(key) {
    var value = sessionStorage.getItem(key)
    return value ? JSON.parse(value) : ''
  },
  set: function(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  remove: function (key) {
    sessionStorage.getItem(key) && sessionStorage.removeItem(key)
  }
}
  
/**
 * cookie工具
 */ 
export const cookieUtil = {
  set: function(name, value, expires) {
    var date = new Date()
    date.setTime(date.getTime() + expires * 1000)
    document.cookie = name + '=' + JSON.stringify(value) + ';expires=' + date.toGMTString()
  },
  get: function(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
    var value = (arr = document.cookie.match(reg)) ? unescape(arr[2]) : ''
    return value ? JSON.parse(value) : '' 
  },
  remove: function(name) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var value = cookieUtil.get(name)
    if (value != null) {
      document.cookie = name + "=" + value + ";expires=" + exp.toGMTString()
    }
  }
}
  
  