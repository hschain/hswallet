<template>
	<view class="importMnemonic">
		<view class="header">
			<image @click="back" class="back" src="../../static/common/back.png" mode=""></image>
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
						placeholder="请输入24个助记词单词,并使用空格分隔"
						placeholder-style="#666"
					/>
				</u-form-item>
			</u-form>
			<view @click="startImport()" class="importBtn greenBtn">开始导入</view>
		</view>
	</view>
</template>

<script>
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
								return value.split(' ').length >= 24
							},
							message: '助记词不足24个', 
							trigger: ['blur'],
						}, {
							validator: (rule, value, callback) => {
								return value.split(' ').length <= 24
							},
							message: '助记词超过24个', 
							trigger: ['blur'],
						}
					]
				}
			}
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			startImport() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						let value = this.form.value
						this.$store.dispatch('saveMnemonic', value)
						let addr = this.$chain('https://testnet.hschain.io/', 'hst01').getAddress(value)
						if (uni.getStorageSync('mnemonicData') && this.secret.decrypt(uni.getStorageSync('mnemonicData'))[addr]) {
							uni.setStorageSync('backupMnemonic', true)
						}
						
						let _this = this
						uni.showToast({
							title: '助记词导入成功',
							success() {
								setTimeout(() => {
									if (uni.getStorageSync('account')) {
										let addr = _this.$chain('https://testnet.hschain.io/', 'hst01').getAddress(_this.$store.state.mnemonic)
										let account = _this.secret.decrypt(uni.getStorageSync('account'))
										account[addr] = {
											name: 'HST', 
											key: _this.$store.state.mnemonic,
										}
										let userWallet = []
										for (let idx in account) {
											userWallet.push({
												addr: idx,
												name: account[idx].name
											})
										}
										_this.$store.commit('SAVE_USER_WALLET', userWallet)
										_this.$store.commit('SET_WALLETNAME', 'HST')
										uni.setStorageSync('userAddress', addr)
										uni.setStorage({
											key: 'account',
											data: _this.secret.encrypt(account)
										})
										uni.switchTab({
											url: '../main/main'
										})
									} else {
										uni.navigateTo({
											url: `../setPw/setPw`
										})
									}
								},1000)
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
		color: #fff;
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
		margin-top: 160rpx;
			.title {
				font-size: 40rpx;
				margin-bottom: 100rpx;
			}
			.inputValue {
				width: 600rpx;
				color: #fff;
				/deep/ .u-input__textarea {
					color: #fff;
				}
			}
			.importBtn {
				margin-top: 50rpx;
				width: 300rpx;
				margin-top: 150rpx;
			}
		}

	}
</style>
