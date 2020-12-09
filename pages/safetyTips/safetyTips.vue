<template>
	<view class="safetyTips">
		<view class="header">
			<image @click="back" class="back" src="../../static/svg/ic_back.svg" mode=""></image>
		</view>
		<view class="tip">
			<text class="headerTip">安全第一</text>
			<view class="circle"></view>
			<text class="tipText">您将看到您的助记词，它是您存取资产的密钥，请您确保将其备份在其他安全的地方，不要和任何人分享！</text>
			<view class="circle"></view>
			<text class="tipText">如果您遗失了手机或卸载了本程序，您可以通过助记词恢复资产！</text>
		</view>
		<view class="bottomSize">
			<u-button class="immediately" @click="notice">立即备份</u-button>
			<!-- <view v-if="!redirectToBackupPage" class="later" @click="later">
				稍后备份
			</view> -->
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
				this.$store.dispatch('saveMnemonic', require('bip39').generateMnemonic(128))
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
				let address = this.$wallet(this.$store.state.walletType).getAddress(this.$store.state.mnemonic)
				uni.setStorageSync(address+'backupMnemonic', false)
				if (uni.getStorageSync('account')) {
					let addr = this.$wallet(this.$store.state.walletType).getAddress(this.$store.state.mnemonic)
					let account = this.secret.decrypt(uni.getStorageSync('account'))
					account[addr] = {
						name: this.$store.state.walletType, 
						type: this.$store.state.walletType,
						key: this.$store.state.mnemonic,
					}
					let userWallet = []
					for (let idx in account) {
						userWallet.push({
							addr: idx,
							name: account[idx].name,
							type: account[idx].type,
						})
					}
					this.$store.commit('SAVE_USER_WALLET', userWallet)
					this.$store.commit('SET_WALLETNAME', this.$store.state.walletType)
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
		overflow: hidden;
		.header {
			margin: 100rpx 40rpx 40rpx;
			.back {
				width: 50rpx;
				height: 40rpx;
			}
		}
		.tip {
			padding:0 16px;
			display: flex;
			flex-direction: column;
			color: #1F1F1F;
			.headerTip {
				font-size: 50rpx;
				margin: 40rpx 0 100rpx;
				font-size: 34px;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
			}
			.circle{
				width: 16rpx;
				height: 16rpx;
				border: 2px solid #909195;
				border-radius: 50%;
				position: relative;
				top: 30rpx;
			}
			.tipText {
				margin-bottom: 40rpx;
				font-size: 16px;
				margin-left: 64rpx;
			}
		}
		.bottomSize {
			.immediately {
				width: 686rpx;
				height: 96rpx;
				margin: 0 auto 40rpx;
				color: #fff;
				background: url('../../static/common/button_gold.png') no-repeat;
				background-size: 100% 100%;
				// box-shadow:inset 0px 4px 16px 0px rgba(212, 180, 131, 0.4), 0px 0px 3px 0px #F7DDB5;
				position: absolute;
				top: 800rpx;
				left: 50%;
				transform: translate(-50%,0);
			}
			.later{
				width: 686rpx;
				height: 96rpx;
				color: #000;
				border-radius: 4px;
				font-size: 32rpx;
				text-align: center;
				line-height: 96rpx;
				border: 1px solid #1F1F1F;
				position: absolute;
				top: 920rpx;
				left: 50%;
				transform: translate(-50%,0);
			}
		}
	}
</style>
