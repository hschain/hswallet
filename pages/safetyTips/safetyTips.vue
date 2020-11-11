<template>
	<view class="safetyTips">
		<view class="header">
			<image @click="back" class="back" src="../../static/common/back.png" mode=""></image>
		</view>
		<view class="tip">
			<text class="headerTip">安全第一</text>
			<text class="tipText">您将看到您的助记词，它是您存取资产的密钥，请您确保将其备份在其他安全的地方，不要和任何人分享！</text>
			<text class="">如果您遗失了手机或卸载了本程序，您可以通过助记词恢复资产！</text>
		</view>
		<view class="bottomSize">
			<u-button class="btn greenBtn" @click="notice">立即备份</u-button>
			<view v-if="!redirectToBackupPage" class="btn greyBtn" style="color: #fff;" @click="later">
				稍后备份
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'safetyTips',
		data() {
			return {
				redirectToBackupPage: this.$store.state.toBackupPage || false,
			}
		},
		onShow() {
			if (!this.$store.state.mnemonic) {
				this.$store.dispatch('saveMnemonic', require('bip39').generateMnemonic(256))
			}
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			//立即备份
			notice() {
				uni.navigateTo({
					url: '../createMnemonic/createMnemonic'
				})
			},
			//稍后备份
			later() {
				if (uni.getStorageSync('account')) {
					let addr = this.$chain(this.$url, this.$chainId).getAddress(this.$store.state.mnemonic)
					let account = this.secret.decrypt(uni.getStorageSync('account'))
					account[addr] = {
						name: 'HST', 
						key: this.$store.state.mnemonic,
					}
					let userWallet = []
					for (let idx in account) {
						userWallet.push({
							addr: idx,
							name: account[idx].name
						})
					}
					this.$store.commit('SAVE_USER_WALLET', userWallet)
					this.$store.commit('SET_WALLETNAME', 'HST')
					uni.setStorageSync('userAddress', addr)
					uni.setStorage({
						key: 'account',
						data: this.secret.encrypt(account)
					})
					uni.switchTab({
						url: '../main/main'
					})
				} else {
					uni.navigateTo({
						url: '../setPw/setPw'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.safetyTips {
		color: #fff;
		.header {
			margin: 100rpx 40rpx 40rpx;
			.back {
				width: 50rpx;
				height: 40rpx;
			}
		}
		.tip {
			display: flex;
			height: 50vh;
			padding: 12vw;
			font-size: 30rpx;
			display: flex;
			flex-direction: column;
			.headerTip {
				font-size: 60rpx;
				margin: 40rpx 0 100rpx;
			}
			.tipText {
				margin-bottom: 40rpx;
			}
		}
		.bottomSize {
			.btn {
				width: 300rpx;
				margin: 0 auto 40rpx;
				color: #000;
			}
		}
	}
</style>
