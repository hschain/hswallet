<template>
	<view class="content">
		<!-- <view style="height: var(--status-bar-height);background-color: var(--mainColor);"></view> -->
		<view class="introduce greenContainer">
			<view class="detail containerWrap">
				<view class="value greenFont">
					{{hideBalance ? "****" : this.balance}}
				</view>
				<view class="title">
					账户总额
				</view>
			</view>
		</view>
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
							<view v-if="!assetsList[name].length" class="isEmpty">
								<u-empty text="暂无信息" mode="data"></u-empty>
							</view>
							<view v-else @click="navigate(item)" v-for="(item, i) in assetsList[name]" :key="i + 'key'" class="table">
								<view class="tableLeft">
									<view class="tabTop">
										<image class="icon" v-if="item.denom === 'HST'" src="../../static/common/logo.png" mode=""></image>
										<image class="icon" v-else src="../../static/common/symbol_none.svg" mode=""></image>
										<text class="denom">{{item.denom}}</text>
									</view>
									<view class="tabBottom">
										{{item.time}}
									</view>
								</view>
								<view class="tableRight">
									<text>{{item.type === 'in' ? '+' : '-'}} {{hideBalance ? "****" : item.value}}</text>
								</view>
							</view>
							<u-loadmore v-show="assetsList[name].length" :status="loadStatus" margin-bottom="30" :load-text="loadText" @loadmore="getAssetsList(true)" icon-type="flower"/>	
						</view>
					</scroll-view>
				</view>
			</swiper-item>
		</swiper>
		
		<view class="bottomBar">
			<view class="btn yellowBtn" :custom-style="customStyle" @click="receipt">收款</view>
			<view class="btn greenBtn" type="primary" @click="transfer">转账</view>
		</view>
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
						name: '全部',
					}, {
						name: '转出',
					}, {
						name: '转入',
					}, {
						name: '失败',
					},
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
				all: [],
				out: [],
				in: [],
				err: []
			}
			this.getAssetsList()
		},
		onHide() {
		},
		methods: {
			back() {
				uni.navigateBack()
			},
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
			getAssetsList(lazyLoad) {
				uni.getStorageSync('hideBalance') ? this.hideBalance = true : this.hideBalance = false
				let params = {
					limit: this.limit,
					address: this.$store.state.myAddr
				}
				if (lazyLoad) {
					params.begin = this.paging.end - 1
				} else {
					this.$u.api.getAssets(this.$store.state.myAddr).then(res => {
						let coins = res.data.result.value.coins
						if (/^u/i.test(coins[0].denom)) {
							coins[0].amount = (coins[0].amount / 1000000).toFixed(6);
						}
						this.balance = coins[0].amount
					})
				}
				if (this.loadStatus === 'loadmore') {
					this.loadStatus = 'loading'
					this.$u.api.getAssetsList(params).then(res => {
						this.paging = res.paging
						if (res.data) {
							res.data.forEach(item => {
								let obj = {
									denom: '',
									time: formatTime(item.timestamp, true),
									value: 0,
									type: '',
									success: item.messages[0].success,
									txHash: item.tx_hash
								}
								item.messages[0].events.message.sender === this.$store.state.myAddr ? obj.type = 'out' : obj.type = 'in'
								if (/^u/i.test(item.messages[0].events.transfer.denom)) {
									obj.denom = item.messages[0].events.transfer.denom.slice(1);
									obj.value = (item.messages[0].events.transfer.amount / 1000000).toFixed(6);
								}
								this.assetsList.all.push(obj)
							})
							this.assetsList.out = this.assetsList.all.filter(item => item.type === 'out')
							this.assetsList.in = this.assetsList.all.filter(item => item.type === 'in')
							this.assetsList.err = this.assetsList.all.filter(item => !item.success)
						}
						res.paging.total*1 <= this.assetsList.all.length ? this.loadStatus = 'nomore' : this.loadStatus = 'loadmore'
					})
				}
			},
			navigate(item) {
				uni.navigateTo({ url: `/pages/assetsDetail/assetsDetail?hash=${item.txHash}` })
			},
			//转账
			transfer() {
				uni.navigateTo({ url: '../transfer/transfer' })
			},
			//收款
			receipt() {
				uni.navigateTo({ url: '../receipt/receipt' })
			}
		}
	}
</script>

<style lang="scss">
	$hei: 52vh;
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.introduce {
			font-size: 36rpx;
			margin: 20rpx 0;
			height: 300rpx;
			.detail {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				.value {
					margin-bottom: 20rpx;
					font-size: 50rpx;
				}
			}
		}
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
					margin: 0;
					.isEmpty{
						display: flex;
						justify-content: center;
						align-items: center;
						height: calc(#{$hei} - 4vh - 6rpx);
					}
					.table {
						display: flex;
						justify-content: space-between;
						margin: 20rpx 30rpx 10rpx;
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
		}
		.bottomBar {
			position: fixed;
			left: 0;
			bottom: 0;
			z-index: 998;
			border-top: 1px solid rgba(0, 0, 0, 0.2);
			display: flex;
			justify-content: space-between;
			width: 100vw;
			padding: 10rpx 5vw;
			.btn {
				width: 330rpx;
				margin: 0;
			}
		}
	}
</style>
