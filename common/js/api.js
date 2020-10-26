// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作
const install = (Vue, vm) => {
	
	const apiSetting = {
		getAssets(hash) {return vm.$u.get('api/v1/account/' + hash)},
		getAccounts(hash) {return vm.$u.get('api/lcd/auth/accounts/' + hash)},
		broadcast(params) {return vm.$u.post('api/lcd/txs', params)},
		getAssetsList(params, hash='') {return vm.$u.get('api/v1/txs' + hash, params)},
		getVersion(params) {return vm.$u.get('api/v1/version', params)},
	}
	
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		...apiSetting,
	};
}

export default {
	install
}