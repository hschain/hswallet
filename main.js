import Vue from 'vue'
import App from './App'
import hschain from 'hschainjs'
import uView from "uview-ui";
import store from 'store'
import VueClipboard from 'vue-clipboard2'
import secret from 'common/js/secret.js'
import md5 from 'js-md5';
// import 'typeface-roboto'
console.log(Vue.prototype)
Vue.config.productionTip = false
Vue.prototype.$chain = hschain.network
Vue.prototype.$store = store
Vue.prototype.$md5 = md5
Vue.prototype.secret = secret
Vue.prototype.$url='https://testnet.hschain.io/'
//Vue.prototype.$url='https://scan.hschain.io/'
Vue.prototype.$chainId='hst01'
Vue.prototype.$path="m/44'/532'/0'/0/0"
Vue.prototype.$bech32MainPrefix="hsc"
//Vue.prototype.$path="m/44'/532'/0'/0/0"


Vue.use(uView);
Vue.use(VueClipboard);

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from 'common/js/http.js'
Vue.use(httpInterceptor, app)
// http接口API集中管理引入部分
import httpApi from 'common/js/api.js'
Vue.use(httpApi, app)

app.$mount()
