<template>
	<view class="content">
		<!-- <view style="height: var(--status-bar-height);background-color: var(--mainColor);"></view> -->
		<view class="introduce ">
			<image v-show="walletName=='HST'" class="walletIcon" src="../../static/common/logo.png" mode=""></image>
			<image v-show="walletName=='ETH'" class="walletIcon" src="../../static/common/ETH.png" mode=""></image>
			<view class="detail ">
				<view class="value">
					{{hideBalance ? "****" : account}}
				</view>
				<view class="title">
					账户总额
				</view>
			</view>
		</view>
		<view class="separated"></view>
		<!-- 切换菜单 -->
		<view class="tabMenu">
			<u-tabs-swiper 
				ref="tabs"
				:list="menu"
				active-color="#000"
				inactive-color="#909399"
				:is-scroll="false"
				bar-width = "150"
				font-size="32"
				current="0"
				bg-color="#fff"
				:current="activeIndex"
				@change="changeIndex"
			></u-tabs-swiper>
		</view>
		<view class="swiperBorder"></view>
		<!-- 菜单列表 -->
		<swiper class="swiperCard" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item v-for="(sub, name) in assetsList" :key="name">
				<view class="">
					<scroll-view scroll-y="true" class="assetsList " @scrolltolower="getAssetsList(true)" scroll-with-animation="true">
						<view class="listWrapper">
							<view v-if="!assetsList[name].length" class="isEmpty">
								<u-empty text="暂无数据" mode="data" src="../../static/common/img_blank.png"></u-empty>
							</view>
							<view v-else @click="walletName=='HST'?navigate(item):ETHnavigate(item)" v-for="(item, i) in assetsList[name]" :key="i + 'key'" class="table">
								<view class="tableLeft">
									<view class="tabTop">
										<image class="icon" v-if="item.type=='in'" src="../../static/svg/ic_deposit.svg" mode=""></image>
										<image v-if="item.type=='out'" class="icon" src="../../static/svg/ic_withdraw.svg" mode=""></image>
										<image v-if="item.result=='ERROR'" class="icon" src="../../static/svg/ic_failed.svg" mode=""></image>
										<text v-if="walletName=='HST'" class="denom">{{item.denom}}</text>
										<view class="address" v-if="walletName=='ETH'" >{{item.from | hash}}</view>
										<view class="tiem">{{item.time}}</view>
									</view>
									<!-- <view class="tabBottom">{{item.time}}</view> -->
								</view>
								<view class="tableRight">
									<text v-show="walletName=='HST'">{{item.type === 'in' ? '+' : '-'}} {{hideBalance ? "****" : item.value}}</text>
									<text v-show="walletName=='ETH'">{{item.type === 'in' ? '+' : '-'}} {{hideBalance ? "****" : item.amount}}</text>
								</view>
								<view class="border"></view>
							</view>
							<u-loadmore style="display: -webkit-box" v-if="assetsList[name].length" :status="loadStatus" margin-bottom="30" :load-text="loadText" @loadmore="getAssetsList(true)" icon-type="flower"/>	
						</view>
					</scroll-view>
				</view>
			</swiper-item>
		</swiper>
		
		<view class="bottomBar">
			<view class="collection">
				<u-icon class="icon" name="../../static/svg/ic_deposit.svg" custom-prefix="project-icon" size="100"></u-icon>
				<view class="createBtn" :custom-style="customStyle" @click="receipt">收款</view>
			</view>
			<view class="transfer">
				<u-icon class="icon" name="../../static/svg/ic_withdraw.svg"  custom-prefix="project-icon" size="100"></u-icon>
				<view class="importBtn" type="primary" @click="transfer">转账</view>
			</view>
			<image class="btnLogo" src="../../static/svg/img_taichi.svg" mode=""></image>
		</view>
	</view>
</template>

<script>
	import { formatTime } from '../../common/js/common.js'
	import { ethers } from "@/common/js/ethers.js"
	export default {
		name: 'assets',
		data() {
			return {
				btnIconColor: '#bea41e',
				customStyle: {
					color: 'white',
					backgroundColor: '#67c8e5',
					
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
				hideBalance: false ,//隐藏余额
				denom: '', //货币单位
				currencyName:'',
				walletName:'',
				account:0
			}
		},
		onLoad(value) {
			//根据进入时选择的币种，将其展示在标题栏上
			 uni.setNavigationBarTitle({
			 	title: value.val
			 })
			 this.denom = 'u' + value.val.toLowerCase()
			 this.currencyName=value.val

		},
		async onShow() {
			this.walletName=this.$store.state.walletName;
			if (this.currencyName!='HST' && this.currencyName!='ETH') {
				let result=await this.$wallet("ETH").getTokenBalance(uni.getStorageSync('userAddress'),uni.getStorageSync('ERC20addr'))
				this.account=ethers.utils.formatEther(result)
			}else if(this.currencyName=='ETH'){
				let result=await this.$wallet('ETH').getBalance(uni.getStorageSync('userAddress'))
				
				this.account=ethers.utils.formatEther(result)
				
			}
			
			this.$store.commit('SET_QUERY_INFO_FLAG', true)
			this.assetsList = {
				all: [],
				out: [],
				in: [],
				err: []
			}
			this.getAssetsList()
			this.queryNewAssetsList()
			// this.wsSendMsg('in')
			// this.$store.state.socketTask.onMessage(res => {
			// 	console.log(res);
			// })
		},
		onBackPress() {
			this.$store.commit('SET_QUERY_INFO_FLAG', false)
			// this.wsSendMsg('out')
		},
		onHide() {
			this.$store.commit('SET_QUERY_INFO_FLAG', false)
			// this.wsSendMsg('out')
		},
		filters: {
			hash: function (value) {
			  return value.slice(0, 6) + " … " + value.slice(-6);
			},
		},
		methods: {
			formatDate(date) {
				if (date) {
					var date = new Date(date*1);
					var YY = date.getFullYear() + '-';
					var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
					var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
					var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
					var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
					var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
					return YY + MM + DD +" "+hh + mm + ss;
				} else {
					return ''
				}
			},
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
			// 获取最新资产详情
			queryNewAssetsList() {
				if(this.currencyName=='HST'){
					let params = {
						limit: this.limit,
						address: uni.getStorageSync('userAddress'),
						// address:'hsc1wqznqd37hve7mdk759e25svw5597rw5gglle9f',
						timetable: 'now',
						denom: this.denom
					}
					this.$u.api.getAssetsList(params).then(res => {
						if (res.data) {
							res.data.reverse()
							res.data.forEach(item => {
								let obj = {
									denom: '',
									time: formatTime(item.timestamp, true),
									value: 0,
									type: '',
									success: item.messages[0].success,
									txHash: item.tx_hash
								}
								item.messages[0].events.message.sender === uni.getStorageSync('userAddress') ? obj.type = 'out' : obj.type = 'in'
								if (/^u/i.test(item.messages[0].events.transfer.denom)) {
									obj.denom = item.messages[0].events.transfer.denom.slice(1);
									obj.value = (item.messages[0].events.transfer.amount / 1000000).toFixed(6);
								}
								this.assetsList.all.unshift(obj)
							})
							// this.assetsList.all.forEach(item => {
							// 	item.type === 'out' ? this.assetsList.out.push(item) : this.assetsList.in.push(item)
							// 	if (!item.success) this.assetsList.err.push(item)
							// })
							this.assetsList.out = this.assetsList.all.filter(item => item.type === 'out')
							this.assetsList.in = this.assetsList.all.filter(item => item.type === 'in')
							this.assetsList.err = this.assetsList.all.filter(item => !item.success)
						}
					}).finally(() => {
						setTimeout(() => {
							if (this.$store.state.queryNewInfoflag) {
								this.queryNewAssetsList()
							}
						}, 5000)
					})
				}else if(this.currencyName=='ETH'){
					uni.request({
						url:'http://8.129.187.233:25676/eth/access/eth_list',
						data:{limit: this.limit,start:1,type:'ALL',address:uni.getStorageSync('userAddress')},
						header: {
							'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
						},
						success: (res) => {
							console.log("交易明细",res.data);
							if (res.data) {
								// res.data.reverse();
								let i=0;
								res.data.content.forEach(item => {
									let obj = {
										fee:item.fee,
										txHash: item.tx_hash,
										result:item.result,
										from:item.from,
										to:item.to,
										amount:item.amount,
										type:item.to==uni.getStorageSync('userAddress')?'in':'out',
										time: this.formatDate(item.tx_timestamp, true),
										id:i++
									}
									this.assetsList.all.push(obj)
								})
								this.assetsList.out = this.assetsList.all.filter(item => item.type === 'out')
								this.assetsList.in = this.assetsList.all.filter(item => item.type === 'in')
								this.assetsList.err = this.assetsList.all.filter(item => item.result=='ERROR')
								console.log('全',this.assetsList);
							}
						},
					})
				}else{
					uni.request({
						url:'http://8.129.187.233:25676/eth/access/rc20_list',
						data:{limit: this.limit,start:1,type:'ALL',address:uni.getStorageSync('userAddress'),contract_address:uni.getStorageSync('ERC20addr')},
						header: {
							'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
						},
						success: (res) => {
							console.log("ERC20交易明细",res.data);
							if (res.data) {
								// res.data.reverse();
								let i=0;
								res.data.content.forEach(item => {
									let obj = {
										fee:item.fee,
										txHash: item.tx_hash,
										result:item.result,
										from:item.from,
										to:item.to,
										amount:item.amount,
										type:item.to==uni.getStorageSync('userAddress')?'in':'out',
										time: this.formatDate(item.tx_timestamp, true),
										id:i++
									}
									this.assetsList.all.push(obj)
								})
								this.assetsList.out = this.assetsList.all.filter(item => item.type === 'out')
								this.assetsList.in = this.assetsList.all.filter(item => item.type === 'in')
								this.assetsList.err = this.assetsList.all.filter(item => item.result=='ERROR')
							}
						},
					})
				}
			},
			//请求资产详情
			queryAssetsList(lazyLoad,loadStatus,params){
				this.$u.api.getAssetsList(params).then(res => {
					if (!lazyLoad) this.paging = res.paging
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
							item.messages[0].events.message.sender === uni.getStorageSync('userAddress') ? obj.type = 'out' : obj.type = 'in'
							if (/^u/i.test(item.messages[0].events.transfer.denom)) {
								obj.denom = item.messages[0].events.transfer.denom.slice(1);
								obj.value = (item.messages[0].events.transfer.amount / 1000000).toFixed(6);
							}
							this.assetsList.all.push(obj)
						})
						// this.assetsList.all.forEach(item => {
						// 	item.type === 'out' ? this.assetsList.out.push(item) : this.assetsList.in.push(item)
						// 	if (!item.success) this.assetsList.err.push(item)
						// })
						this.assetsList.out = this.assetsList.all.filter(item => item.type === 'out')
						this.assetsList.in = this.assetsList.all.filter(item => item.type === 'in')
						this.assetsList.err = this.assetsList.all.filter(item => !item.success)
					}
					res.paging.total*1 <= this.assetsList.all.length ? this.loadStatus = 'nomore' : this.loadStatus = 'loadmore'
				})
			},
			// 获取资产详情
			getAssetsList(lazyLoad) {
				uni.getStorageSync('hideBalance') ? this.hideBalance = true : this.hideBalance = false
				let params = {
					limit: this.limit,
					address: uni.getStorageSync('userAddress'),
					// address:'hsc1wqznqd37hve7mdk759e25svw5597rw5gglle9f',
					timetable: 'history',
					denom: this.denom
				}
				if (lazyLoad) {
					console.log(lazyLoad);
					params.begin = this.paging.end-1
					console.log(this.paging);
				} else {
					console.log(2222222);
					this.$u.api.getAssets(uni.getStorageSync('userAddress')).then(res => {
						let coins = res.data.result.value.coins
						if (/^u/i.test(coins[0].denom)) {
							coins[0].amount = (coins[0].amount / 1000000).toFixed(6);
						}
						this.account = coins[0].amount
						console.log('res',res);
					})
				}
				if (this.loadStatus === 'loadmore') {
					this.loadStatus = 'loading'
					console.log('loding',params);
					this.queryAssetsList(lazyLoad,this.loadStatus,params);
				}else{
					console.log(params);
					// this.queryAssetsList(lazyLoad,this.loadStatus,params);
				}
			},
			navigate(item) {
				console.log(item);
				uni.navigateTo({ url: `/pages/assetsDetail/assetsDetail?hash=${item.txHash}` })
			},
			ETHnavigate(item){
				this.$store.commit('SET_INDEX', item.id)
				uni.navigateTo({ url: `/pages/assetsDetail/assetsDetail` })
			},
			//转账
			transfer() {
				if (this.currencyName!='ETH' && this.currencyName!='HST') {
					uni.setStorageSync('ERC20transfer',true)
				}
				uni.navigateTo({ url: '../transfer/transfer' })
			},
			//收款
			receipt() {
				uni.navigateTo({ url: '../receipt/receipt' })
			},
			//向后端发送进入此页面或者离开此页面消息
			wsSendMsg(signal) {
				let wsParams = {
					address: uni.getStorageSync('userAddress'),
					app: 'HSWallet',
					page: 'tx',
					signal
				}
				this.$store.dispatch('websocketSend', wsParams)
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
		.introduce {
			font-size: 36rpx;
			margin: 20rpx 0;
			height: 300rpx;
			.walletIcon{
				width: 64rpx;
				height: 64rpx;
				position: relative;
				left: 50%;
				transform: translate(-50%,0);
				margin-bottom: 20rpx;
			}
			.detail {
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				.value {
					margin-bottom: 20rpx;
					font-size: 50rpx;
					color: #C19A5F;
					font-family: gilroy-regular;
				}
				.title{
					color: #909195;
				}
			}
		}
		.separated{
			width: 750rpx;
			height: 32rpx;
			background: #F7F7F7;
			margin-bottom: 20rpx;
		}
		.swiperBorder{
			width: 100%;
			height: 3rpx;
			background: #F3F3F7;
			margin-top: -6rpx;
		}
		.tabMenu{
			width: 90%;
		}
		.swiperCard{
			width: 100%;
			height: calc(#{$hei} - 680rpx);
			margin-top: 20rpx;
			.assetsList {	
				background: #fff;
				height: calc(#{$hei} - 680rpx);
				.listWrapper {
					border: 2px solid #fff;
					.isEmpty{
						display: flex;
						justify-content: center;
						align-items: center;
						height: calc(#{$hei} - 680rpx);
						border: 2px solid #fff;
					}
					>uni-view {
						display: none;
					}
					.table {
						display: flex;
						justify-content: space-between;
						padding: 40rpx 50rpx 30rpx;
						// box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
						// border-radius: 5px;
						position: relative;
						.tableLeft {
							display: flex;
							flex-direction: column;
							.tabTop {
								display: flex;
								margin-bottom: 20rpx;
								.icon {
									width: 44rpx;
									height: 44rpx;
									border-radius: 50px;
									margin-right: 20rpx;
								}
								.denom {
									font-size: 32rpx;
									// line-height: 60rpx;
									color: #1f1f1f;
									margin-left: 9px;
								}	
								.address{
									margin-left: 9px;
									color: #1f1f1f;
									font-family: gilroy-regular;
								}	
								.tiem{
									color: #909195;
									position: absolute;
									top: 80rpx;
									left: 130rpx;
								}					
							}
							.tabBottom {
								margin-left: 10rpx;
								color: #1f1f1f;
							}
						}
						.tableRight {
							font-size: 36rpx;
							display: flex;
							align-items: center;
							color: #1f1f1f;
							font-family: gilroy-regular;
						}
						.border{
							width: 610rpx;
							height: 3rpx;
							background: #F3F3F7;
							position: absolute;
							right: 0;
							bottom: 0rpx;
						}
					}
				}
			}
		}
		.bottomBar {
			position: fixed;
			left: 0;
			bottom: 120rpx;
			z-index: 998;
			display: flex;
			justify-content: space-between;
			width: 100vw;
			padding: 10rpx 5vw;
			.transfer{
				.icon{
					width: 22px;
					height: 22px;
					z-index: 22;
					position: absolute;
					left: 460rpx;
					top: 30rpx;
				}
			}
			.collection{
				.icon{
					width: 22px;
					height: 22px;
					z-index: 22;
					position: absolute;
					left: 136rpx;
					top: 30rpx;
				}
			}
			.createBtn {
				font-size: 30rpx;
				width: 50%;
				height: 88rpx;
				color: #fff;
				text-align: center;
				line-height: 44px;
				background: #1F1F1F;
				border-radius: 22px 0px 0px 22px;
				border: 1px solid #1F1F1F;
				position: absolute;
				left: 16px;
			}
			.importBtn {
				font-size: 30rpx;
				width: 46%;
				height: 88rpx;
				background: #fff;
				color: #000;
				text-align: center;
				line-height: 44px;
				border-radius: 0px 22px 22px 0px;
				border: 1px solid #1F1F1F;
				position: absolute;
				right: 16px;
			}
			.btnLogo{
				width: 88rpx;
				height: 84rpx;
				position: absolute;
				left: 50%;
				top:12rpx;
				transform: translate(-50%,0);
			}
		}
	}
</style>
