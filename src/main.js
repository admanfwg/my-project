import Vue from 'vue'
import App from './App'
import './uni.promisify.adaptor'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
