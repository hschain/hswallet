import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		walletName: '', //钱包名称
		mnemonic: '', //助记词
		addrData: {}, //转账对方具体地址数据
		toBackupPage: false, //从其他页面进入备份页
		userWallet: [], //当前账号的多个钱包信息
		updateRes: {}, //从后端返回的结果
		queryNewInfoflag: false, //是否定时轮询最新交易信息
		socketTask: null, //websocket方法
		socketIsOpen: false, //是否已开启websocket
		walletType: '', // 选择的钱包类型
		ETHassetsList:[],//ETH钱包资产列表
		index:"",
		nameIndex:1
		// index:''
	},
	getters: {
		
	},
	mutations: {
		SAVE_NAMEINDEX:(state,value)=>{
			state.nameIndex=value;
		},
		SAVE_MNEMONIC: (state, value) => {
			state.mnemonic = value
		},
		SAVE_ADDR_DATA: (state, value) => {
			state.addrData = value
		},
		SET_WALLETNAME: (state, value) => {
			state.walletName = value
		},
		REDIRECT_TO_BACKUP_PAGE: (state, value) => {
			state.toBackupPage = value
		},
		CLOSE_WEBSOCKET:  (state) => { //关闭websocket
			state.socketIsOpen = false
		},
		SAVE_USER_WALLET:  (state, value) => {
			state.userWallet = value
		},
		SAVE_UPDATE_RES:  (state, value) => {
			state.updateRes = value
		},
		SET_QUERY_INFO_FLAG:  (state, value) => {
			state.queryNewInfoflag = value
		},
		
		WEBSOCKET_INIT: (state, url) => {
			// 防止重复连接
			if(state.socketIsOpen) return
			state.socketTask = uni.connectSocket(
				{
					url,
					success() {
						
					}
				}
			)
			state.socketTask.onOpen(res => {
				state.socketIsOpen = true;
			
				state.socketTask.onMessage(res => {
					
				})
			})
			// 监听关闭
			state.socketTask.onClose(()=>{
				if (state.socketIsOpen) {
					state.socketTask = uni.connectSocket({
						url,
						success() {
							
						}
					})
				} else {
					
					state.socketTask = null;
				}

			})
			// 监听错误
			state.socketTask.onError(()=>{
			
				state.socketIsOpen = false;
				state.socketTask = null;
			})
		},
		WEBSOCKET_SEND: (state, msg) => {
			// state.socketTask.onOpen(res => {
				
				state.socketTask.send({
					data: msg,
					async success() {
					
					}
				})
			// })
		},
		WEBSOCKET_CLOSE: (state, url) => {
			// 注意这里有时序问题，
			// 如果 uni.connectSocket 还没回调 uni.onSocketOpen，而先调用 uni.closeSocket，那么就做不到关闭 WebSocket 的目的。
			// 必须在 WebSocket 打开期间调用 uni.closeSocket 才能关闭。
			if (state.socketIsOpen) {
				state.socketTask.close()
				state.socketIsOpen = false
			}
		},
		SAVE_WALLET_TYPE:  (state, value) => {
			state.walletType = value
		},
		SET_INDEX:(state,value)=>{
			state.index=value;
		}
	},
	actions: {
		saveMnemonic({ commit }, value) {
			commit('SAVE_MNEMONIC', value)
		},
		saveAddrData({ commit }, value) {
			commit('SAVE_ADDR_DATA', value)
		},
		redirectToBackupPage({ commit }, value) {
			commit('REDIRECT_TO_BACKUP_PAGE', value)
		},
		
		websocketInit({ commit }, value) {
			commit('WEBSOCKET_INIT', value)
		},
		websocketSend({ commit }, value) {
			commit('WEBSOCKET_SEND', value)
		},
		websocketClose({ commit }, value) {
			commit('WEBSOCKET_CLOSE', value)
		},
		saveWalletType({ commit }, value) {
			commit("SAVE_WALLET_TYPE", value)
		},
	}
})

export default store