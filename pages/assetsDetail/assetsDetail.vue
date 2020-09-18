<template>
	<view class="content">
		<uni-nav-bar @clickLeft='back()' left-icon="back" left-text="返回" title="详情" color="#fff" background-color="#020e46"></uni-nav-bar>
		<view class="detail containerWrapper">
			<image v-if="assetData.success" class="icon" src="../../assets/common/yes.png" mode=""></image>
			<image v-else class="icon" src="../../assets/common/wrong.png" mode=""></image>
			<text class="tip">{{assetData.success ? '成功' : '失败'}}</text>
			<text>{{assetData.time}}</text>
		</view>
		<view class="amountDetail containerWrapper">
			<view class="amountMsg">
				<text>金额</text>
				<text>{{assetData.type === 'in' ? '+' : '-'}}{{assetData.value + ' ' + assetData.denom}}</text>
			</view>
			<view class="txsDetail">
				交易详情
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				assetData: {},
			}
		},
		onLoad(value) {
			this.assetData = JSON.parse(value.item) 
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			changeIndex(val) {
				if (val !== 'all') {
					this.assetsList = this.oAssetsList.filter(item => item.type === val)
				} else {
					this.assetsList = this.oAssetsList
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.detail {
			font-size: 24rpx;
			margin: 20rpx 0;
			display: flex;
			align-items: center;
			flex-direction: column;
			padding: 20rpx 0;
			.icon {
				width: 100rpx;
				height: 100rpx;
			}
			.tip {
				margin: 10rpx 0;
			}
		}
		.amountDetail {
			margin: 10rpx 40rpx;
			padding : 40rpx 0;
			.amountMsg {
				display: flex;
				justify-content: space-between;
				padding: 40rpx 30rpx;
				border: 1px solid #ccc;
				// box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.2);
				font-size: 24rpx;
				border-radius: 5px;
				margin: 0 20rpx;
			}
			.txsDetail {
				display: flex;
				margin: 30rpx 20rpx 0;
				height: 50vh;
				justify-content: center;
				align-items: center;
				border: 1px solid #ccc;
				border-radius: 5px;
			}
		}
	}
</style>
