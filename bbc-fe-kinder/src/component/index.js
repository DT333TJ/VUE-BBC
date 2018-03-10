/**
 * 全局注册组件
 */
import Vue from 'vue'
import VHeader from './header'
import { VNav, VSubNav, VNavItem } from './nav'
import ContentBox from './content-box'

Vue.component(VHeader.name, VHeader)
Vue.component(VNav.name, VNav)
Vue.component(VSubNav.name, VSubNav)
Vue.component(VNavItem.name, VNavItem)
Vue.component(ContentBox.name, ContentBox)

Vue.use(VHeader)
Vue.use(VNav)
Vue.use(VSubNav)
Vue.use(VNavItem)
Vue.use(ContentBox)