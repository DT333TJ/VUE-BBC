/**
 * 注册全局的头部组件
 */
import VHeader from './header'

VHeader.install = function(Vue) {
  Vue.component(VHeader.name, VHeader)
}

export default VHeader