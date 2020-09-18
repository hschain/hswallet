<template>
	<view class="home">
		<view class="tip">
			<image class="logo" src="../../assets/common/HSTLOGO.png" mode=""></image>
			欢迎使用HSWallet，下一步您可以创建钱包或导入已有钱包
		</view>
		<view class="bottomSize">
			<button class="btn" @click="create" type="primary">创建钱包</button>
			<button class="btn" type="primary">导入钱包</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'home',
		methods: {
			create() {
				uni.navigateTo({
					url: '../safetyTips/safetyTips'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.home {
		.tip {
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			height: 50vh;
			padding: 12vw;
			font-size: 36rpx;
			display: flex;
			flex-direction: column;
			.logo {
				width: 100rpx;
				height: 100rpx;
				margin-bottom: 60rpx;
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
