import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
// vuex引入
import store from './store'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
// 解决移动端点击300毫秒延迟
fastclick.attach(document.body)

Vue.use(VueLazyload,{
    loading: require('common/img/loading.png')
})

import 'common/stylus/index.styl'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
