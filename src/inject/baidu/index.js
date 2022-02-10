global.browser = require('webextension-polyfill')

import Vue from 'vue'
import App from './App'
import store from '../../store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../../assets/css/reset.css'
// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts;


Vue.use(ElementUI);



/* eslint-disable no-new */
new Vue({
    el: '#app',
    store:store,
    render: h => h(App)
})



