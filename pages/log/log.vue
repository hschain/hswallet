<template>
	<view class="log">
		<view class="tipBlock" v-for="(item, index) in publishData" :key="'pub' + index">
			<view class="timer">
				{{item.time}}
			</view>
			<view class=" contentBox">
				<view class="content">
						{{item.content}}						
				</view>
			</view>
			<view class="border"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'log',
		data() {
			return {
				publishData: [],
			}
		},
		onLoad() {
			this.getAnnouncement()
		},
		methods: {
			getAnnouncement() {
				
				this.publishData = [
					{
						content: 'HS Wallet 12/11 初始版',
						time: '2020-12-011 18:13:56'
					},
				]
			},
		}
	}
</script>

<style lang="scss">
	.log {
		padding-top: 40rpx;
		.tipBlock {
			padding: 0 40rpx 40rpx;
			.timer {
				// padding: 20rpx 0rpx;
				color: #909195;
				font-size: 24rpx;
			}
			.contentBox {
				width: 100%;
				// padding: 20rpx 0;
				.content {
					color: #1F1F1F;
					font-size: 32rpx;
				}
			}
			.border{
				width: 718rpx;
				height: 3rpx;
				background: #F3F3F7;
				// background: #1F1F1F;
				margin-top: 20rpx;
			}
		}
	}
</style>