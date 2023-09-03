import Vue from 'vue'
import App from './App'

import Vuex from 'vuex'
import BASE_URLS from './common/baseURL.js'

Vue.use(Vuex)

//引用axios
import axios from 'axios'
Vue.prototype.$http = axios

//安装md5后引入，
import md5 from 'js-md5'
Vue.prototype.$md5 = md5

import store from './store/index.js' //引用vuex store

Vue.prototype.$BASE_URLS = BASE_URLS//全局变量配置

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
		store //在全局vue实例挂载store
})
app.$mount()
