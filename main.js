import Vue from 'vue'
import App from './App'
import hschain from 'hschainjs'
import './common/css/common.scss'

Vue.config.productionTip = false
Vue.prototype.$chain = hschain.network

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
