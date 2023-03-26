import App from './App'
import {request,get,post} from './request/index'
// #ifndef VUE3
import Vue from 'vue'
//引入vuex
import store from './store'
//把vuex定义成全局组件
Vue.prototype.$store = store
Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$api = request
Vue.prototype.$apiget = get
Vue.prototype.$apipost = post

const app = new Vue({
  ...App,
  store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif