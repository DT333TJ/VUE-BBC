/*
 * @Author: wzy
 * @Desc: 工具类封装
 */

// 设置cookie
export function setCookie(name, value, expires) {
  let date = new Date()
  date.setTime(date.getTime() + expires * 1000)
  document.cookie = `${name}=${value};expires=${date.toGMTString()}`
}

// 读取cookie
export function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
  return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : ''
}

