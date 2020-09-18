<template>
	<view class="content">
		<uni-nav-bar @clickLeft='back()' left-icon="back" left-text="" title="详情"></uni-nav-bar>
		<view class="detail containerWrapper">
			<image class="icon" src="../../assets/common/yes.png" mode=""></image>
		</view>
		<view class="assetsList containerWrapper">
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				assetsList: [
					{
						denom: 'HST',
						time: '2020-09-16 / 16:54:25',
						value: 26,
						type: 'in'
					}, {
						denom: 'ACOIN',
						time: '2020-09-16 / 12:35:05',
						value: 34,
						type: 'out'
					},
				],
			}
		},
		onLoad(value) {
			this.title = value.val
			this.oAssetsList = this.assetsList
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
			font-size: 32rpx;
			margin: 20rpx 0;
			display: flex;
			align-items: center;
			flex-direction: column;
			padding: 20rpx 0;
			.icon {
				width: 100rpx;
				height: 100rpx;
			}
		}
		.assetsList {
			margin: 10rpx 40rpx;
			padding-top: 40rpx;
			
		}
	}
</style>
