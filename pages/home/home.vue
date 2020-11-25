<template>
	<view class="home">
		<!-- <image class="bg" src='../../static/common/bg_taichi.png'></image> -->
		<view class="tip">
			<image class="logo" src="../../static/common/img_logo.png" mode=""></image>
			HS Wallet
		</view>
		<view class="title">欢迎使用HSWallet，下一步您可以创建钱包或导入已有钱包</view>
		<view class="bottomSize">
			<view class="createBtn" @click="create">创建钱包</view>
			<view class="importBtn" @click="importWallet">导入钱包</view>
			<image class="btnLogo" src="../../static/common/img_taichi.png" mode=""></image>
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
		onBackPress() {
			//改变用户回退行为，否则会回退到main页面，无法再进入home页面
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
					// url: '../safetyTips/safetyTips'  chooseType
					url: '../chooseType/chooseType?type=create'
				})
			},
			importWallet() {
				uni.navigateTo({
					// url: '../importMnemonic/importMnemonic'
					url: '../chooseType/chooseType?type=import'
				})
			}
		}
	}
</script>

<style lang="scss">
	.home {
		overflow: hidden;
		width: 100%;
		height: 1624rpx;
		background: url('../../static/common/bg_taichi.png') no-repeat;
		background-size:100% 100%;
		position: relative;
		.tip {
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			padding: 12vw;
			font-size: 24px;
			flex-direction: column;
			color: #fff;
			position: absolute;
			top: 126px;
			left: 50%;
			transform: translate(-50%,0);
			.logo {
				width: 128rpx;
				height: 128rpx;
				margin-bottom: 20px;
			}
		}
		.title{
			font-size: 16px;
			z-index: 10;
			color: #000;
			text-align: center;
			padding: 0 16px;
			position: absolute;
			top: 356px;
		}
		.bottomSize {
			width: 100%;
			position: absolute;
			top: 416px;
			.createBtn {
				font-size: 30rpx;
				width: 50%;
				height: 44px;
				color: #fff;
				text-align: center;
				line-height: 44px;
				background: #1F1F1F;
				border-radius: 22px 0px 0px 22px;
				border: 1px solid #1F1F1F;
				position: absolute;
				left: 16px;
			}
			.importBtn {
				font-size: 30rpx;
				width: 46%;
				height: 44px;
				background: #fff;
				color: #000;
				text-align: center;
				line-height: 44px;
				border-radius: 0px 22px 22px 0px;
				border: 1px solid #1F1F1F;
				position: absolute;
				right: 16px;
			}
			.btnLogo{
				width: 44px;
				height: 42px;
				position: absolute;
				left: 50%;
				top: 1px;
				transform: translate(-50%,0);
			}
		}
	}
</style>
