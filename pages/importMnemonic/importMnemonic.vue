<template>
	<view class="importMnemonic">
		<!-- <view v-if="showlod" class="loading"><u-loading class="load" mode="flower" show size="200"></u-loading></view> -->
		<view class="header">
			<image @click="back" class="back" src="../../static/svg/ic_back.svg" mode=""></image>
		</view>
		<view class="textWrapper">
			<view class="title">
				导入助记词
			</view>
			<u-form :model="form" ref="uForm" :error-type="errorType">
				<u-form-item class="inputText" prop="value" :border-bottom="false">
					<u-input 
						class="inputValue"
						v-model="form.value"
						type="textarea"
						:border="true"
						:height="180"
						:auto-height="true"
						maxlength="300"
						:clearable="false"
						placeholder="请输入12个助记词单词,并使用空格分隔"
						placeholder-style="#666"
					/>
				</u-form-item>
			</u-form>
			<u-button @click="startImport()" class="importBtn">开始导入</u-button>
		</view>
	</view>
</template>

<script>
const bip39 = require('bip39');
	export default {
		name: 'importMnemonic',
		data() {
			return {
				errorType: ['message', 'border'],
				form: {
					value: '',
				},
				rules: {
					value: [
						{
							required: true, 
							message: '输入框不能为空', 
							trigger: ['blur'],
						}, {
							validator: (rule, value, callback) => {
								return value.split(' ').length >= 12
							},
							message: '助记词不足12个', 
							trigger: ['blur'],
						}, {
							validator: (rule, value, callback) => {
								return value.split(' ').length <= 12
							},
							message: '助记词超过12个', 
							trigger: ['blur'],
						}
					]
				},
				nameIndex:this.$store.state.walletType=='HST'?uni.getStorageSync('hstnameIndex'):uni.getStorageSync('ethnameIndex'),
				accountList:uni.getStorageSync('account'),
				addr:''
			}
		},
		onShow(){
			
		},
		onReady(){
			// setTimeout(() => {
			// 	this.addr = this.$wallet(this.$store.state.walletType).getAddress(this.form.value)
			// }, 500);
			this.nameIndex=this.$store.state.walletType=='HST'?uni.getStorageSync('hstnameIndex'):uni.getStorageSync('ethnameIndex');
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			//点击开始校验并导入助记词,根据不同场景做相应处理
			startImport() {
				// this.showlod=true;
				uni.showLoading({
					title: ' '
				});
				this.$refs.uForm.validate(valid => {
					if (valid) {
						let value = this.form.value
						this.$store.dispatch('saveMnemonic', value)
						if (!bip39.validateMnemonic(value)){
							uni.showToast({
								title: '助记词有误',
								icon:"none"
							})
						}
						let addr = this.$wallet(this.$store.state.walletType).getAddress(this.form.value)			
						// if (uni.getStorageSync('mnemonicData') && this.secret.decrypt(uni.getStorageSync('mnemonicData'))[addr]) {
							// uni.setStorageSync(addr+'backupMnemonic', true)
						// }
						
						let _this = this
						uni.showToast({
							title: '助记词导入成功',
							success() {
								uni.hideLoading();
								// setTimeout(() => {
									// this.showlod=false;
									// if (uni.getStorageSync('account')) {
															
									// 	let account = _this.secret.decrypt(uni.getStorageSync('account'))
									// 	account[addr] = {
									// 		name: _this.$store.state.walletType+`-${_this.nameIndex}`, 
									// 		key: _this.$store.state.mnemonic,
									// 		type:_this.$store.state.walletType
									// 	}
									// 	let userWallet = []
									// 	for (let idx in account) {
									// 		userWallet.push({
									// 			addr: idx,
									// 			name: account[idx].name,
									// 			type: account[idx].type
									// 		})
									// 	}
									// 	// this.showlod=true;
									// 	_this.$store.commit('SAVE_USER_WALLET', userWallet)
									// 	_this.$store.commit('SET_WALLETNAME', _this.$store.state.walletType)
									// 	uni.setStorageSync('userAddress', addr)
										
									// 	uni.setStorage({
									// 		key: 'account',
									// 		data: _this.secret.encrypt(account)
									// 	})
									// 	if (uni.getStorageSync('localPw')) {
									// 		_this.$store.state.walletType=='HST'?uni.setStorageSync('hstnameIndex',_this.nameIndex+1):uni.setStorageSync('ethnameIndex',_this.nameIndex+1)
									// 		_this.$store.commit('SAVE_NAMEINDEX', _this.nameIndex+1)
									// 		uni.switchTab({
									// 			url: '../main/main'
									// 		})
									// 	} else {
									// 		uni.navigateTo({
									// 			url: `../setPw/setPw`
									// 		})
									// 	}
									// } else {
									// 	uni.navigateTo({
									// 		url: `../setPw/setPw`
									// 	})
									// }
								// },1000)
								_this.$store.commit('SET_WALLETNAME', _this.$store.state.walletType+`-${_this.nameIndex}`)
								uni.setStorageSync('userAddress', addr)				
								let accounts=_this.accountList?_this.secret.decrypt(_this.accountList):{}
								let userWallet = _this.accountList?_this.$store.state.userWallet:[{addr,name: _this.$store.state.walletType+`-${_this.nameIndex}`,type:_this.$store.state.walletType}]
								if (_this.accountList) {
										userWallet.push({
											addr: addr,
											name: _this.$store.state.walletType+`-${_this.nameIndex}`, 
											type:_this.$store.state.walletType
										})
								}
								_this.$store.commit('SAVE_USER_WALLET', userWallet)
								accounts[addr] = {
									name: _this.$store.state.walletType+`-${_this.nameIndex}`, 
									key: _this.$store.state.mnemonic,
									type:_this.$store.state.walletType
								}
								uni.setStorage({
									key: 'account',
									data: _this.secret.encrypt(accounts)
								})
								if (uni.getStorageSync('localPw')) {
									uni.switchTab({
										url: '../main/main'
									})
								} else {
									uni.navigateTo({
										url: `../setPw/setPw`
									})
								}	
								this.$store.state.walletType=='HST'?uni.setStorageSync('hstnameIndex',this.nameIndex+1):uni.setStorageSync('ethnameIndex',this.nameIndex+1)
							}
						})
					}
				})
				
			},
			onReady() {
				this.$refs.uForm.setRules(this.rules);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.importMnemonic {
		overflow: hidden;
		color: #1F1F1F;
		.loading{
			width: 160px;
			height: 160px;
			background: rgba($color: #000000, $alpha: 0.3);
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			.load{
				position: absolute;
				top: 30px;
				left: 30px;
				
			}
		}
		.header {
			margin: 100rpx 40rpx 0;
			.back {
				width: 50rpx;
				height: 40rpx;
			}
		}
		.textWrapper {
		display: flex;
		align-items: center;
		flex-direction: column;
		// margin-top: 160rpx;
			.title {
				font-size: 68rpx;
				margin-bottom: 100rpx;
				position: relative;
				top: 20rpx;
				right: 168rpx;
			}
			.inputValue {
				width: 686rpx;
				color: #fff;
				// /deep/ .u-input__textarea {
				// 	color: #fff;
				// }
				margin-bottom: 100rpx;
			}
			.importBtn {
				width: 686rpx;
				height: 96rpx;
				margin: 0 auto 40rpx;
				color: #fff;
				background: url('../../static/common/button_gold.png') no-repeat;
				background-size: 100% 100%;
			}
		}

	}
</style>
