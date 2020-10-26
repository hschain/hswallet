import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		walletName: '', //钱包名称
		mnemonic: '', //助记词
		addrData: {}, //转账对方具体地址数据
		myAddr: '', //个人地址
		toBackupPage: false, //从其他页面进入备份页
		
		socketTask: null,
		socketIsOpen: false,
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
		SET_WALLETNAME: (state, value) => {
			state.walletName = value
		},
		REDIRECT_TO_BACKUP_PAGE: (state, value) => {
			state.toBackupPage = value
		},
		
		WEBSOCKET_INIT: (state, url) => {
			// 防止重复连接
			if(state.socketIsOpen) return
			
			state.socketTask = uni.connectSocket(
				{
					url,
					success() {
						console.log('websocket连接成功');
					}
				}
			)
			state.socketTask.onOpen(res => {
				state.socketIsOpen = true;
				console.log('websocket打开成功');
				state.socketTask.onMessage(res => {
					console.log('收到服务器内容: ');
					console.log(res);
				})
			})
			// 监听关闭
			state.socketTask.onClose(()=>{
				console.log('连接已关闭');
				state.socketIsOpen = false;
				state.socketTask = null;
			})
			// 监听错误
			state.socketTask.onError(()=>{
				console.log('连接错误');
				state.socketIsOpen = false;
				state.socketTask = null;
			})
		},
		WEBSOCKET_SEND: (state, msg) => {
			state.socketTask.onOpen(res => {
				console.log('ws发送中');
				state.socketTask.send({
					data: msg,
					async success() {
						console.log('发送成功');
					}
				})
			})
		},
		WEBSOCKET_CLOSE: (state, url) => {
			// 注意这里有时序问题，
			// 如果 uni.connectSocket 还没回调 uni.onSocketOpen，而先调用 uni.closeSocket，那么就做不到关闭 WebSocket 的目的。
			// 必须在 WebSocket 打开期间调用 uni.closeSocket 才能关闭。
			if (state.socketIsOpen) {
				state.socketTask.close()
			}
		},
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
	}
})

export default store