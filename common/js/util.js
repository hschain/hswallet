export default {
	
	/**
	 * 获取资产列表 
	 * 
	 * @param {Object} address
	 */
	getAssets(address) {
		let assets = uni.getStorageSync("assets")
		assets = assets ? assets : {}
		
		if (assets[address]) {
			return assets[address]
		}
		
		return []
	},
	
	/**
	 * 设置资产
	 * 
	 * @param {Object} address
	 * @param {Object} asset
	 */
	setAsset(address, asset) {
		let assets = uni.getStorageSync("assets")
		assets = assets ? assets : {}

		if ( ! assets[address]) {
			assets[address] = []
		}
		
		let found = assets[address].find(item => item.value == asset.value)
		if (found) {
			return
		}
			
		assets[address].push(asset)
		uni.setStorageSync("assets", assets)
	},
	
	/**
	 * 删除资产
	 * 
	 * @param {Object} address
	 * @param {Object} asset
	 */
	removeAsset(address, asset) {
		let assets = uni.getStorageSync("assets")
		
		if (! assets[address]) {
			return
		}
		assets[address] = assets[address].filter(item => item.value != asset.value)
		
		uni.setStorageSync("assets", assets)
	},
	
	/**
	 * 获取合约精度
	 * 
	 * @param {Object} contractAddress
	 */
	getDecimal(contractAddress) {
		let decimal = 18
		let assets = uni.getStorageSync("assets")
		
		for(var key in assets) {
			let asset = assets[key].find(asset => asset.value == contractAddress)
			if (asset) {
				return asset.decimal
			}
		}
				
		return decimal
	},
	
	/**
	 * 获取hsc合约精度
	 * 
	 * @param {Object} contractAddress
	 */
	getHscDecimal(contractAddress) {
		let decimal = 6
		let assets = uni.getStorageSync("assets")
		
		for(var key in assets) {
			let asset = assets[key].find(asset => asset.value == contractAddress)
			if (asset) {
				return asset.decimal
			}
		}
				
		return decimal
	}
}