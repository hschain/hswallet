<template>
	<view class="receipt">
		<view class="containerBox purpleContainer">
			<view class="containerWrap boxWrapper">
				<view class="content">
					扫二维码，转入HSC
				</view>
				<view class="qrCodeBox">
					<view class="boxWrapper">
						<qrCode :imgText="imgText"></qrCode>						
					</view>
				</view>
				<view class="showAddressBox">
					{{addr | hash}}
				</view>
			</view>
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
				addr: '', //地址
				imgText: ''
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
		methods: {
		}
	}
</script>

<style lang="scss">
	.receipt {
		.containerBox {
			background-color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			margin: 10vh auto 0;
			.boxWrapper {
				.content {
					color: #bcbcbc;
					font-size: 30rpx;
					margin: 60rpx 0 10rpx;
					text-align: center;
				}
				.qrCodeBox{
					display: flex;
					justify-content: center;
					margin: 30rpx 0;
					.boxWrapper {
						padding: 16rpx;
						background-color: #fff;
					}
				}
				.showAddressBox {
					padding: 20rpx 30rpx 60rpx;
					text-align: center;
					font-size: 36rpx;
				}
			}
		}
	}
</style>
