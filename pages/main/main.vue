<template>
	<view class="content">
		<uni-nav-bar right-text="[ . . . ]" title="钱包" color="#fff" background-color="var(--mainColor)"></uni-nav-bar>
		<view class="headerWrapper containerWrapper">
			<view class="walletName">
				<text>自定义钱包名</text>
				<view class="">
					...
				</view>
			</view>
			<view class="address">
				{{addr}}
			</view>
			<view class="cash">
				￥{{cash}}
			</view>
		</view>
		<view class="assets containerWrapper">
			<view class="title">
				<text>资产</text>
			</view>
			<view class="assetsList">
				<view @click="navigate(item)" v-for="item in assetsList" :key="item.denom" class="table">
					<view class="tableLeft">
						<image class="icon" v-if="item.denom === 'HST'" src="../../assets/common/logo.png" mode=""></image>
						<image class="icon" v-else src="../../assets/common/symbol_none.svg" mode=""></image>
						<text class="denom">{{item.denom}}</text>
					</view>
					<view class="tableRight">
						<text>{{item.price}}</text>
						<text>￥{{item.value}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addr: 'hsc1q9yscsuwlqdhyfahw88vml7wtl4gsgu3qe5lng',
				cash: 185151,
				assetsList: [
					{
						denom: 'HST',
						price: 481542141,
						value: 456411
					}, {
						denom: 'ACOIN',
						price: 81849154,
						value: 81644
					},
				]
			}
		},
		onLoad() {
			// console.log(this.$chain)
		},
		methods: {
			navigate(item) {
				uni.navigateTo({ url: `/pages/assets/assets?val=${item.denom}` })
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
		.headerWrapper {
			display: flex;
			flex-direction: column;
			margin: 20rpx 0;
			.walletName {
				margin: 20rpx;
				font-size: 30rpx;
				display: flex;
				justify-content: space-between;
			}
			.address {
				margin: 10rpx 20rpx;
			}
			.cash {
				display: flex;
				justify-content: flex-end;
				margin: 30rpx 20rpx;
				font-size: 32rpx;
			}
		}
		.assets {
			display: flex;
			flex-direction: column;
			.title {
				margin: 30rpx 30rpx 0;
				font-size: 36rpx;
			}
			.assetsList {
				margin: 40rpx;
				.table {
					display: flex;
					justify-content: space-between;
					margin: 0 0 30rpx;
					box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
					border-radius: 5px;
					padding: 20rpx;
					.tableLeft {
						display: flex;
						.icon {
							width: 60rpx;
							height: 60rpx;
							border-radius: 50px;
							margin-right: 20rpx;
						}
						.denom {
							font-size: 32rpx;
							line-height: 60rpx;
						}
					}
					.tableRight {
						display: flex;
						flex-direction: column;
						align-items: flex-end;
					}
				}
			}
		}
	}
</style>
