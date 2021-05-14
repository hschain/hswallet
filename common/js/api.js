// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作
const install = (Vue, vm) => {
	
	const apiSetting = {
		getAssets(hash) {return vm.$u.get('api/v1/account/' + hash)},
		getAccounts(hash) {return vm.$u.get('api/v2/auth/accounts/' + hash)}, // 正式环境
		broadcast(params) {return vm.$u.post('api/v2/txs', params)}, // 正式环境
		//getAccounts(hash) {return vm.$u.get('api/lcd/auth/accounts/' + hash)}, // 测试环境
		//broadcast(params) {return vm.$u.post('api/lcd/txs', params)}, // 测试环境
		getAssetsList(params, hash='') {return vm.$u.get('api/v1/txs' + hash, params)},
		getVersion(params) {return vm.$u.get('api/v1/version', params)},
		getETHtradingList(params){return vm.$u.get('api/eth/access/eth_list',params)},
		getCurrencyList(){return vm.$u.get('api/v1/total')},
		//getTradingRecord(params){return vm.$u.get('api',params)}, // 获取所有交易记录
	}
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下 0x85464b207d7c1fce8da13d2f3d950c796e399a9c   https://scan.hschain.io/api/v2/supply/total
	vm.$u.api = {
		...apiSetting,
	};
}

export default {
	install
}