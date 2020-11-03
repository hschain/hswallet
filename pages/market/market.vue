<template>
	<view class="content">
		<view class="tabMenu">
			<u-tabs-swiper 
				ref="tabs"
				:list="menu"
				active-color="rgb(193, 153, 108)"
				inactive-color="#909399"
				:is-scroll="false"
				bar-width = "90"
				font-size="32"
				current="0"
				bg-color="#000"
				:current="activeIndex"
				@change="changeIndex"
			></u-tabs-swiper>
		</view>
		<swiper class="swiperCard" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item>
				<view class="yellowContainer">
					<scroll-view scroll-y="true" class="assetsList containerWrap" @scrolltolower="getAssetsList(true)" scroll-with-animation="true">
						<view class="listWrapper">
							<view v-if="!market_self.length" class="isEmpty">
								<u-empty text="暂无信息" mode="data"></u-empty>
							</view>
							<view v-else class="selfList" v-for="(item, index) in market_self" :key="index + 'self'">
								<view class="leftContent">
									<view class="titleWrapper">
										<image class="icon" v-if="item.denom === 'HST'" src="../../static/common/logo.png" mode=""></image>
										<image class="icon" v-else src="../../static/common/usdtLogo.png" mode=""></image>
										<view class="title">
											{{item.title + '-' + item.denom}}											
										</view>
									</view>
									<view class="value">
										{{item.value}}
									</view>
								</view>
								<view class="rightContent">
									<view class="ratio">
										{{item.ratio}}
									</view>
									<view class="trend" :style="{backgroundColor: item.color}">
										{{(item.trend === "up" ? "+" : item.trend === "down" ? "-" : "" ) + item.percentage}}
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="yellowContainer">
					<scroll-view scroll-y="true" class="assetsList containerWrap" @scrolltolower="getAssetsList(true)" scroll-with-animation="true">
						<view class="listWrapper">
							<view class="isEmpty">
								<u-empty text="暂无信息" mode="data"></u-empty>
							</view>
						</view>
					</scroll-view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="yellowContainer">
					<scroll-view scroll-y="true" class="assetsList containerWrap" @scrolltolower="getAssetsList(true)" scroll-with-animation="true">
						<view class="listWrapper">
							<view class="isEmpty">
								<u-empty text="暂无信息" mode="data"></u-empty>
							</view>
						</view>
					</scroll-view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import { formatTime } from '../../common/js/common.js'
	export default {
		name: 'assets',
		data() {
			return {
				customStyle: {
					color: 'white',
					backgroundColor: '#67c8e5'
				},
				menu: [
					{
						name: '自选',
					}, {
						name: '热门',
					}, {
						name: '涨幅榜',
					}
				],
				loadText: {
					loadmore: '点击或上拉加载更多',
					loading: '正在加载',
					nomore: '没有更多了'
				},
				market_self: [],
				market_hot: [],
				market_rank: [],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				activeIndex: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				limit: 10,
				paging: {}, //列表数据量细节
				loadStatus: 'loadmore', //底部加载状态
				balance: 0, //账户总额
				hideBalance: false //隐藏余额
			}
		},
		onLoad(value) {
			 uni.setNavigationBarTitle({
			 	title: value.val
			 })
		},
		onShow() {
			// 临时静态数据，后期可参考并处理成此结构开发，或者自行更改成其他结构体
			
			// this.market_self = [
			// 	{
			// 		title: 'HST',
			// 		denom: 'USDT',
			// 		value: 'HSwap TVL:$30M',
			// 		ratio: '1:0.06000',
			// 		percentage: '66.00%',
			// 		trend: 'up',
			// 		color: 'red'
			// 	}, {
			// 		title: 'ETH',
			// 		denom: 'USDT',
			// 		value: 'HSwap TVL:$100K',
			// 		ratio: '1:388.0650',
			// 		percentage: '5.00%',
			// 		trend: 'down',
			// 		color: 'green'
			// 	}, {
			// 		title: 'ETH',
			// 		denom: 'HST',
			// 		value: 'HSwap TVL:$888K',
			// 		ratio: '1:888.888',
			// 		percentage: '8.00%',
			// 		trend: 'up',
			// 		color: 'red'
			// 	}, {
			// 		title: 'BTC',
			// 		denom: 'HST',
			// 		value: 'HSwap TVL:$666K',
			// 		ratio: '1:666.666',
			// 		percentage: '6.00%',
			// 		trend: 'up',
			// 		color: 'red'
			// 	}, {
			// 		title: 'ACoin',
			// 		denom: 'HST',
			// 		value: 'HSwap TVL:$1M',
			// 		ratio: '1:0.03000',
			// 		percentage: '1.00%',
			// 		trend: 'down',
			// 		color: 'green'
			// 	}, {
			// 		title: 'BCoin',
			// 		denom: 'HST',
			// 		value: 'HSwap TVL:$666K',
			// 		ratio: '1:0.05000',
			// 		percentage: '0.00%',
			// 		trend: 'equal',
			// 		color: 'grey'
			// 	}, {
			// 		title: 'CCoin',
			// 		denom: 'HST',
			// 		value: 'HSwap TVL:$333K',
			// 		ratio: '1:333.333',
			// 		percentage: '3.00%',
			// 		trend: 'up',
			// 		color: 'red'
			// 	}, {
			// 		title: 'DCoin',
			// 		denom: 'HST',
			// 		value: 'HSwap TVL:$666K',
			// 		ratio: '1:0.05000',
			// 		percentage: '0.00%',
			// 		trend: 'equal',
			// 		color: 'grey'
			// 	},
			// ]
		},
		methods: {
			changeIndex(val) {
				this.swiperCurrent = val
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.tabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.activeIndex = current;
			},
		}
	}
</script>

<style lang="scss">
	$hei: 100vh;
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.tabMenu{
			width: 90%;
		}
		.swiperCard{
			width: 100%;
			height: calc(#{$hei} - 75rpx - 94px);
			margin-top: 20rpx;
			.assetsList {
				background-color: #fff;
				height: calc(#{$hei} - 80rpx - 94px);
				padding: 10rpx 0;
				.listWrapper {
					// margin: 40rpx 0 0;
					.isEmpty{
						display: flex;
						justify-content: center;
						align-items: center;
						height: calc(#{$hei} - 86rpx - 94px);
					}
					.selfList {
						display: flex;
						justify-content: space-between;
						padding: 30rpx;
						border-bottom: 1rpx solid #565759;
						.leftContent {
							.titleWrapper {
								margin-bottom: 10rpx;
								display: flex;
								align-items: center;
								.icon {
									width: 40rpx;
									height: 40rpx;
									border-radius: 50%;
									margin-right: 12rpx;
								}
								.title {
									font-size: 32rpx;
								}
							}
							.value {
								font-size: 22rpx;
							}
						}
						.rightContent {
							display: flex;
							align-items: center;
							.ratio {
								margin-right: 30rpx;
							}
							.trend {
								padding: 20rpx;
								border-radius: 10rpx;
								min-width: 150rpx;
								text-align: center;
							}
						}
					}
				}
			}
		}
	}
</style>
