<template>
	<view class="setPw">
		<view class="header">
			<image @click="back" class="back" src="../../static/common/ic_back.png" mode=""></image>
		</view>
		<view class="inputPassword">
			<view class="pinTip">{{secondCheck ? '再次验证密码' : '设置密码'}}</view>
			<u-message-input v-show="!secondCheck" active-color="#888" inactive-color="#1F1F1F" :breathe="true" :maxlength="6" :focus="true" :dot-fill="true" @change="inputPw" ></u-message-input>
			<u-message-input v-show="secondCheck" active-color="#888" inactive-color="#1F1F1F" :breathe="true" :maxlength="6" :dot-fill="true" @change="inputPw" ></u-message-input>
		</view>
		<view class="confirmCheck" @click="check()">确定</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		name: 'setPw',
		data() {
			return {
				errorType: ['message', 'border'],
				pw: '',
				confirmPw: '',
				secondCheck: false, //页面切换至二次确认的标记
			}
		},
		methods: {
			back() {
				this.secondCheck ? this.secondCheck = false : uni.navigateBack()
			},
			//一次输入密码或者二次输入密码
			inputPw(e) {
				this.secondCheck ? this.confirmPw = e : this.pw = e
			},
			//点击验证密码并下一步跳转
			check() {
				if (this.secondCheck) {
					if (this.confirmPw.length !== 6) {
						this.showToast('验证密码不足六位')
						return
					}
					
					if (this.pw !== this.confirmPw) {
						this.showToast('验证密码错误')
						return
					}
					
					//存储数据并跳转路由
					if(!uni.getStorageSync('account')){
						let addr = this.$wallet(this.$store.state.walletType).getAddress(this.$store.state.mnemonic)
						let account = {}
						this.$store.commit('SET_WALLETNAME', this.$store.state.walletType)
						uni.setStorageSync('userAddress', addr)
						let userWallet = [{
							addr,
							name: this.$store.state.walletType
						}]
						this.$store.commit('SAVE_USER_WALLET', userWallet)
						account[addr] = {
							name: this.$store.state.walletType, 
							key: this.$store.state.mnemonic,
						}
						uni.setStorage({
							key: 'account',
							data: this.secret.encrypt(account)
						})
					}
					uni.setStorageSync('localPw', this.$md5(this.pw))
					uni.setStorageSync('backupMnemonic', true)
					uni.showToast({
						title: '密码设置成功',
						success() {
							setTimeout(() => {
								uni.switchTab({
									url: '../main/main'
								})
							},1000)
						}
					})
				} else {
					if (this.pw.length !== 6) {
						this.showToast('请输入六位密码')
					} else {
						this.secondCheck = true
					}
				}
			},
			showToast(title) {
				this.$refs.uToast.show({
					title,
					type: 'error',
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.setPw {
		overflow: hidden;
		color: #1F1F1F;
		.header {
			margin: 100rpx 40rpx 0;
			.back {
				width: 50rpx;
				height: 40rpx;
			}
		}

		.inputPassword {
			margin-bottom: 25vh;
			.pinTip{
				margin: 50rpx 0;
				font-size: 68rpx;
				text-align: center;
			}
			.inputText{
				margin: 40rpx 0;
			}
		}
		.confirmCheck {
			font-size: 32rpx;
			width: 686rpx;
			height: 96rpx;
			font-weight: 400;
			line-height: 96rpx;
			text-align: center;
			color: #fff;
			background: url('../../static/common/button_gold.png') no-repeat;
			background-size: 100% 100%;
			position: absolute;
			left: 50%;
			transform: translate(-50%,0);
		}
	}
</style>
