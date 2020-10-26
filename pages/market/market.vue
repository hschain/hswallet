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
			<swiper-item v-for="(sub, name) in assetsList" :key="name">
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
				assetsList: {},
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
			this.assetsList = {
				self: [],
				hot: [],
				rank: [],
			}
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
	$hei: 80vh;
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
			height: $hei;
			margin-top: 20rpx;
			.assetsList {
				background-color: #fff;
				height: calc(#{$hei} - 4vh);
				.listWrapper {
					// margin: 40rpx 0 0;
					.isEmpty{
						display: flex;
						justify-content: center;
						align-items: center;
						height: calc(#{$hei} - 4vh - 6rpx);
					}
				}
			}
		}
	}
</style>
