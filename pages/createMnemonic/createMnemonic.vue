<template>
	<view class="createMnemonic">
		<view class="header">
			<image @click="back" class="back" src="../../static/common/back.png" mode=""></image>
		</view>
		<view v-show="!confirm" class="tip greenContainer">
			<view class="tipWrapper containerWrap">
				<view>
					<text class="headerTip">助记词</text>
					<view class="content">
						<text class="mnemonic" v-for="(item, i) in mnemonic.split(' ')" :key="i+'key'">{{item}}</text>
					</view>				
				</view>			
			</view>
		</view>
		<view v-show="confirm" class="tip">
			<view class="tipWrapper">
				<view>
					<view class="sure" style="font-size: 46rpx;">您确定已将您的助记词备份了吗？</view>
					<view class="sure">如果您遗失了手机或卸载了本程序必须使用助记词才能恢复您的资产！</view>
				</view>	
			</view>
		</view>
		<view class="bottomSize">
			<view v-show="!confirm">
				<!-- #ifdef H5-->
				<u-button
					class="btn yellowBtn" 
					v-clipboard:copy="mnemonic"
					v-clipboard:success="onCopy"
				>复制</u-button>
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<u-button class="btn yellowBtn" @click="onCopy">复制</u-button>
				<!-- #endif -->
				<u-button class="btn greenBtn" @click="backup">我已备份</u-button>				
			</view>
			<view v-show="confirm">
				<u-button class="btn greenBtn" @click="check">确认</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'createMnemonic',
		data() {
			return {
				mnemonic: this.$store.state.mnemonic || require('bip39').generateMnemonic(256),
				confirm: false,
			}
		},
		methods: {
			back() {
				this.confirm ? this.confirm = false : uni.navigateBack()
			},
			// 复制
			onCopy() {
				//#ifdef H5
				uni.showToast({
					title: '内容已复制'
				})
				//#endif
				//#ifndef H5
				uni.setClipboardData({
					data: this.mnemonic
				})
				//#endif
			},
			//已备份
			backup() {
				this.confirm = true
				// const bip39 = require('bip39');
				// const bip32 = require('bip32');
				// const bech32 = require('bech32');
				// const seed = bip39.mnemonicToSeedSync(this.mnemonic);
				// const node = bip32.fromSeed(seed);
				// const child = node.derivePath("m/44'/118'/0'/0/0");
				// const words = bech32.toWords(child.identifier);
				// bech32.encode(this.bech32MainPrefix, words)
				this.$store.dispatch('saveMnemonic', this.mnemonic)
			},
			// 确认已备份
			check() {
				uni.navigateTo({
					url: '../setPw/setPw'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.createMnemonic {
		color: #fff;
		.header {
			margin: 100rpx 40rpx 0;
			.back {
				width: 50rpx;
				height: 40rpx;
			}
		}
		.tip {
			display: flex;
			height: 60vh;
			font-size: 30rpx;
			display: flex;
			flex-direction: column;
			margin: 40rpx auto;
			.tipWrapper {
				padding: 10vw;
				margin: 0;
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
