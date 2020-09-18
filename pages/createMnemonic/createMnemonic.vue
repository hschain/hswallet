<template>
	<view class="createMnemonic">
		<view class="header">
			<image @click="back" class="back" src="../../assets/common/back.png" mode=""></image>
		</view>
		<view class="tip">
			<view v-show="!confirm">
				<text class="headerTip">助记词</text>
				<view class="content">
					<text class="mnemonic" v-for="(item, i) in mnemonic.split(' ')" :key="i+'key'">{{item}}</text>
				</view>				
			</view>
			<view v-show="confirm">
				<view class="sure" style="font-size: 46rpx;">您确定已将您的助记词备份了吗？</view>
				<view class="sure">如果您遗失了手机或卸载了本程序必须使用助记词才能恢复您的资产！</view>
			</view>
		</view>
		<view class="bottomSize">
			<view v-show="!confirm">
				<button
					class="btn" 
					v-clipboard:copy="mnemonic"
					v-clipboard:success="onCopy"
					type="default"
				>复制</button>
				<button class="btn" @click="backup" type="primary">我已备份</button>				
			</view>
			<view v-show="confirm">
				<button class="btn" @click="check" type="primary">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'createMnemonic',
		data() {
			return {
				mnemonic: uni.getStorageSync('mnemonic') || require('bip39').generateMnemonic(256),
				confirm: false,
			}
		},
		methods: {
			back() {
				this.confirm ? this.confirm = false : uni.navigateBack()
			},
			onCopy() {
				uni.showToast({
					title: '复制成功'
				})
			},
			backup() {
				uni.setStorage({
					key: 'mnemonic',
					data: this.mnemonic
				})
				this.confirm = true
			},
			check() {
				uni.navigateTo({
					url: '../pinCode/pinCode'
				})				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.createMnemonic {
		.header {
			margin: 100rpx 40rpx 0;
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
			}
			.content {
				margin-top: 60rpx;
				display: grid;
				grid-template-columns: 1fr 1fr 1fr;
				grid-gap: 30rpx 0;
				font-size: 26rpx;
				.mnemonic {
					width: 20vw;
				}
			}
			.sure {
				margin: 50rpx 30rpx;
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
