global.browser = require('webextension-polyfill')

import Vue from 'vue'
import App from './App'
import store from '../store'
import '../assets/css/reset.css'

// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts;


/* eslint-disable no-new */
new Vue({
    el: '#app',
    store:store,
    render: h => h(App)
})
