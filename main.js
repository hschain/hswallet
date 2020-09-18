import Vue from 'vue'
import App from './App'
import hschain from 'hschainjs'
import VueClipboard from 'vue-clipboard2'

Vue.config.productionTip = false
Vue.prototype.$chain = hschain.network
Vue.use(VueClipboard);

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
