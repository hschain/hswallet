<template>
	<view class="home">
		<view class="tip">
			<image class="logo" src="../../static/common/logo.png" mode=""></image>
			欢迎使用HSWallet，下一步您可以创建钱包或导入已有钱包
		</view>
		<view class="bottomSize">
			<view class="btn greenBtn" @click="create">创建钱包</view>
			<view class="btn greenBtn" @click="importWallet">导入钱包</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'home',
		data() {
			return {
				first: null
			}
		},
		onShow() {
			this.$store.dispatch('saveMnemonic', '')
		},
		onBackPress() {
			if (!this.first) {
				this.first = new Date().getTime()
				plus.nativeUI.toast("再按一次退出应用", {
					duration: "short"
				});
				setTimeout(() => {
					this.first = null
				}, 1000)
			} else {
				if (new Date().getTime() - this.first < 1500) {
					plus.runtime.quit()
				}
			}
			return true //return true的意思是禁止返回到上一个界面
		},
		methods: {
			create() {
				uni.navigateTo({
					url: '../safetyTips/safetyTips'
				})
			},
			importWallet() {
				uni.navigateTo({
					url: '../importMnemonic/importMnemonic'
				})
			}
		}
	}
</script>

<style lang="scss">
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
			color: #fff;
			.logo {
				width: 150rpx;
				height: 150rpx;
				margin-bottom: 60rpx;
			}
		}
		.bottomSize {
			.btn {
				font-size: 30rpx;
				width: 300rpx;
				margin: 0 auto 40rpx;
				color: #000;
			}
		}
	}
</style>
