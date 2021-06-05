<template>
	<view class="home" >
		<view class="tip">
			<image class="logo" src="../../static/svg/img_logo.svg" mode=""></image>
		<text class="walletName">HS Wallet</text>
		</view>
		<view class="title">欢迎使用HSWallet，下一步您可以创建钱包或导入已有钱包</view>
		<view class="bottomSize">
			<view>
				<image class="btnicon1" src="../../static/svg/ic_create_green.svg" mode=""></image>
				<view class="createBtn" @click="create">创建钱包</view>
			</view>
			<view>
				<view class="importBtn" @click="importWallet">导入钱包</view>
				<image class="btnicon2" src="../../static/svg/ic_import_blue.svg" mode=""></image>
			</view>
			<image class="btnLogo" src="../../static/svg/img_taichi.svg" mode=""></image>
			
		</view>
	</view>
</template>

<script>
	export default {
		name: 'home',
		data() {
			return {
				first: null,
				
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
		onShow(){
			uni.setStorageSync('hstnameIndex',1)
			uni.setStorageSync('ethnameIndex',1)
			uni.setStorageSync('heconameIndex',1) // heco
			uni.setStorageSync('binancenameIndex',1) // binance
		},
		methods: {
			create() {
				uni.navigateTo({
					url: '../chooseType/chooseType?type=create'
				})
			},
			importWallet() {
				uni.navigateTo({
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
		min-height: 1636rpx;
		background: url('../../static/common/bg_taichi.png') no-repeat;
		background-size:100% 100%;
		position: relative;
		.tip {
			width: 300rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			padding: 12vw;
			font-size: 24px;
			flex-direction: column;
			color: #fff;
			position: absolute;
			top: 252rpx;
			left: 50%;
			transform: translate(-50%,0);
			.logo {
				width: 128rpx;
				height: 128rpx;
				margin-bottom: 40rpx;
			}
			.walletName{
				width: 240rpx;
				font-family: gilroy-bold;
				font-size: 24px;
			}
		}
		.title{
			font-size: 32rpx;
			z-index: 10;
			color: #000;
			text-align: center;
			padding: 0 32rpx;
			position: absolute;
			top: 712rpx;
		}
		.bottomSize {
			width: 100%;
			position: absolute;
			top: 832rpx;
			.btnicon1{
				width: 44rpx;
				height: 44rpx;
				position: absolute;
				top: 18rpx;
				left: 112rpx;
				z-index: 22;
			}
			.btnicon2{
				width: 44rpx;
				height: 44rpx;
				position: absolute;
				top: 18rpx;
				right: 266rpx;
				z-index: 25;
			}
			.createBtn {
				font-size: 30rpx;
				width: 50%;
				height: 88rpx;
				color: #fff;
				text-align: center;
				line-height: 88rpx;
				background: #1F1F1F;
				border-radius: 22px 0px 0px 22px;
				border: 2rpx solid #1F1F1F;
				position: absolute;
				left: 32rpx;
			}
			.importBtn {
				font-size: 30rpx;
				width: 46%;
				height: 88rpx;
				background: #fff;
				color: #000;
				text-align: center;
				line-height: 88rpx;
				border-radius: 0px 22px 22px 0px;
				border: 2rpx solid #1F1F1F;
				position: absolute;
				right: 32rpx;
			}
			.btnLogo{
				width: 88rpx;
				height: 84rpx;
				position: absolute;
				left: 50%;
				top: 2rpx;
				transform: translate(-50%,0);
			}
		}
	}
</style>
