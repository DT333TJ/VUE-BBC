// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from 'router'
import ElementUI from 'element-ui'
import $ from 'jquery'
import axios from 'axios'
import 'router/filter'
import 'common/style/reset.css'
import 'element-ui/lib/theme-default/index.css'
import 'common/style/element-ui.css'
import 'common/js/jquery.slimscroll.min.js'

Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
