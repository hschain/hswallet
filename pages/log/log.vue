<template>
	<view class="log">
		<view class="tipBlock" v-for="(item, index) in publishData" :key="'pub' + index">
			<view class="timer">
				{{item.time}}
			</view>
			<view class="greenContainer">
				<view class="containerWrap contentBox">
					<view class="content">
						{{item.content}}						
					</view>
				</view>
			</view>
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
						content: 'HSWallet 初始版本发布',
						time: '2020-10-28 11:50:56'
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
				padding: 20rpx 40rpx;
			}
			.contentBox {
				padding: 20rpx;
				.content {
				}
			}
		}
	}
</style>