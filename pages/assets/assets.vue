<template>
	<view class="content">
		<uni-nav-bar @clickLeft='back()' left-icon="back" left-text="返回" :title="title" color="#fff" background-color="#020e46"></uni-nav-bar>
		<view class="introduce containerWrapper">
			介绍
		</view>
		<hs-nav-menu @click='changeIndex()' :data="menu" :activeIndex="activeIndex" @changeIndex="changeIndex"></hs-nav-menu>
		<view class="assetsList containerWrapper">
			<view @click="navigate(item)" v-for="(item, i) in assetsList" :key="i + 'key'" class="table">
				<view class="tableLeft">
					<view class="tabTop">
						<image class="icon" v-if="item.denom === 'HST'" src="../../assets/common/logo.png" mode=""></image>
						<image class="icon" v-else src="../../assets/common/symbol_none.svg" mode=""></image>
						<text class="denom">{{item.denom}}</text>
					</view>
					<view class="tabBottom">
						<text>{{item.time}}</text>
					</view>
				</view>
				<view class="tableRight">
					<text>{{item.type === 'in' ? '+' : '-'}} {{item.value}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				menu: [
					{
						name: '全部',
						value: 'all'
					}, {
						name: '转出',
						value: 'out'
					}, {
						name: '转入',
						value: 'in'
					}, {
						name: '失败',
						value: 'fail'
					},
				],
				assetsList: [
					{
						denom: 'HST',
						time: '2020-09-16 / 16:54:25',
						value: 26,
						type: 'in',
						success: true,
					}, {
						denom: 'HST',
						time: '2020-09-16 / 12:35:05',
						value: 34,
						type: 'out',
						success: false
					}, {
						denom: 'ACOIN',
						time: '2020-09-16 / 12:35:05',
						value: 95,
						type: 'in',
						success: false
					}, {
						denom: 'ACOIN',
						time: '2020-09-16 / 12:35:05',
						value: 33,
						type: 'out',
						success: true
					},
				],
				oAssetsList: [],
				activeIndex: 'all'
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
				if (val !== 'all' && val !== 'fail') {
					this.assetsList = this.oAssetsList.filter(item => item.type === val)
				} else if (val === 'fail') {
					this.assetsList = this.oAssetsList.filter(item => !item.success)
				} else {
					this.assetsList = this.oAssetsList
				}

			},
			navigate(item) {
				uni.navigateTo({ url: `/pages/assetsDetail/assetsDetail?item=${JSON.stringify(item)}` })
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
		.introduce {
			font-size: 36rpx;
			margin: 20rpx 0;
			height: 300rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.assetsList {
			margin: 10rpx 40rpx;
			padding-top: 40rpx;
			.table {
				display: flex;
				justify-content: space-between;
				margin: 0 30rpx 30rpx;
				box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
				border-radius: 5px;
				padding: 20rpx;
				.tableLeft {
					display: flex;
					flex-direction: column;
					.tabTop {
						display: flex;
						margin-bottom: 20rpx;
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
					.tabBottom {
						margin-left: 10rpx;
					}
				}
				.tableRight {
					font-size: 36rpx;
					display: flex;
					align-items: center;
				}
			}
		}
	}
</style>
