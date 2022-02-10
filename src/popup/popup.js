import Vue from 'vue'
import App from './App'
import store from '../store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../assets/css/reset.css'

Vue.use(ElementUI)

global.browser = require('webextension-polyfill')
Vue.prototype.$browser = global.browser

/* eslint-disable no-new */
new Vue({
	el: '#app',
	store,
	router,
	render: h => h(App)
})
