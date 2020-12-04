<template>
	<view class="receipt">
		<view class="containerBox purpleContainer">
			<view class="boxWrapper">
				<view class="content">
					扫二维码，转入{{ this.$store.state.walletType }}
				</view>
				<view class="qrCodeBox">
					<view class="boxWrapper">
						<qrCode :imgText="imgText"></qrCode>						
					</view>
				</view>
				<view class="showAddressBox" @click="onCopy">
					{{ addr }}
				</view>
				<view class="copyBtn" @click="onCopy">复制</view>
			</view>
		</view>
		<view class="bottom">
			<image class="bottomLogo" src="../../static/svg/img_logo_gray.svg" mode=""></image>
			<view class="bottomTitle">HS Wallet</view>
		</view>
	</view>
</template>

<script>
	import qrCode from '../../components/qrCode.vue'
	import QR from "../../common/js/wxqrcode.js"
	export default {
		name: 'receipt',
		components: { qrCode },
		data() {
			return {
				addr: uni.getStorageSync('userAddress') || '', //地址
				imgText: '' //二维码内容
			}
		},
		onLoad() {
			let acc = this.secret.decrypt(uni.getStorageSync('account'));
			this.addr =  Object.keys(acc)[0]
			let params = {
				address: this.addr
			}
			this.imgText = QR.createQrCodeImg( JSON.stringify(params), {  
				 size: parseInt(200)  
			})
		},
		filters: {
			hash: function (value) {
			  return value.slice(0, 10) + " … " + value.slice(-10);
			},
		},
		created(){
			// document.querySelector('.uni-page-head').style.background = '#1F1F1F';
			// document.querySelector('.uni-page-head').style.color = '#fff';
			// document.querySelector('.uni-btn-icon').style.color = '#fff';
		},
		methods: {
			// 复制地址
			onCopy() {
				this.showAddr = true
				//#ifdef H5
				uni.showToast({
					title: '内容已复制'
				})
				//#endif
				//#ifndef H5
				uni.setClipboardData({
					data: this.addr
				})
				//#endif
			},
		}
	}
</script>

<style>
	html {
		background-color:#1F1F1F;
	}
</style>
<style lang="scss" scoped>
	.receipt {
		background: #1F1F1F;
		.containerBox {
			width: 622rpx;
			height: 840rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			margin: 64rpx;
			background: #fff;
			position: relative;
			.boxWrapper {
				.content {
					color: #bcbcbc;
					font-size: 30rpx;
					text-align: center;
					position: absolute;
					top: 58rpx;
					left: 50%;
					transform: translate(-50%,0);
				}
				.qrCodeBox{
					display: flex;
					justify-content: center;
					.boxWrapper {
						padding: 16rpx;
						background-color: #fff;
					}
				}
				.showAddressBox {
					width: 526rpx;
					word-wrap : break-word;
					padding: 20rpx 30rpx 60rpx;
					text-align: center;
					font-size: 36rpx;
					color: #1F1F1F;
					font-family:gilroy-bold;
				}
				.copyBtn{
					width: 526rpx;
					height: 96rpx;
					background: url('../../static/common/button_gold.png') no-repeat;
					background-size: 100% 100%;
					text-align: center;
					line-height: 96rpx;
					position:absolute;
				}
			}
		}
		.bottom{
			width: 100%;
			// background: olivedrab;
			margin-top: 240rpx;
			text-align: center;
			.bottomLogo{
				width: 80rpx;
				height: 80rpx;
			}
			.bottomTitle{
				font-size: 32rpx;
				font-family: Gilroy-Regular, Gilroy;
				font-weight: 400;
				color: #404040;
			}
		}
	}
</style>
