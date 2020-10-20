import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		mnemonic: '', //助记词
		addrData: {}, //具体地址数据
		myAddr: '', //个人地址
	},
	getters: {
		
	},
	mutations: {
		SAVE_MNEMONIC: (state, value) => {
			state.mnemonic = value
		},
		SAVE_ADDR_DATA: (state, value) => {
			state.addrData = value
		},
		SAVE_MY_ADDRESS: (state, value) => {
			state.myAddr = value
		},
	},
	actions: {
		saveMnemonic({ commit }, value) {
			commit('SAVE_MNEMONIC', value)
		},
		saveAddrData({ commit }, value) {
			commit('SAVE_ADDR_DATA', value)
		},
	}
})

export default store