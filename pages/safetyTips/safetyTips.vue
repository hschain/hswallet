<template>
	<view class="safetyTips">
		<view class="header">
			<image @click="back" class="back" src="../../assets/common/back.png" mode=""></image>
		</view>
		<view class="tip">
			<text class="headerTip">安全第一</text>
			<text style="margin-bottom: 40rpx;">您将看到您的助记词，它是您存取资产的密钥，请您确保将其备份在其他安全的地方，不要和任何人分享！</text>
			<text>如果您遗失了手机或卸载了本程序，您可以通过助记词恢复资产！</text>
		</view>
		<view class="bottomSize">
			<button class="btn" @click="notice" type="primary">我已明白！</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'safetyTips',
		onLoad() {
			uni.removeStorage({
				key: 'mnemonic'
			})
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			notice() {
				uni.navigateTo({
					url: '../createMnemonic/createMnemonic'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.safetyTips {
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
		}
		.bottomSize {
			.btn {
				width: 400rpx;
				margin: 0 auto 40rpx;
			}
		}
	}
</style>
