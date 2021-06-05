<template>
	<view class="content">
		<!-- <view style="height: var(--status-bar-height);background-color: var(--mainColor);"></view> -->
		<view class="introduce ">
			<image v-if="currencyName=='HST'" class="walletIcon" src="../../static/common/coin_HST.png" mode=""></image>
			<image v-if="currencyName=='HST0'" class="walletIcon" src="../../static/common/coin_HST0.png" mode="">
			</image>
			<image v-if="currencyName=='TWT'" class="walletIcon" src="../../static/common/coin_TWT.png" mode=""></image>
			<image v-if="currencyName=='TWT0'" class="walletIcon" src="../../static/common/coin_TWT0.png" mode="">
			</image>
			<image v-if="currencyName=='HSC'" class="walletIcon" src="../../static/main/hsc.png" mode=""></image>
			<image v-if="Type.type=='ETH'" class="walletIcon" :src="imgsrc" mode=""></image>
			<image
				v-if="currencyName!='HST'&&currencyName!='HST0'&currencyName!='TWT'&&currencyName!='TWT0'&&currencyName!='HSC'&&Type.type!='ETH'"
				class="walletIcon" src="../../static/common/coin_default.png" mode=""></image>
			<view class="detail ">
				<view class="value">
					{{hideBalance ? "****" : formatDecimal(account,4)}}
				</view>
				<view class="title">
					账户总额
				</view>
			</view>
		</view>
		<view class="separated"></view>
		<!-- 切换菜单 -->
		<view class="tabMenu">
			<u-tabs-swiper ref="tabs" :list="menu" active-color="#000" inactive-color="#909399" :is-scroll="false"
				bar-width="150" font-size="32" bg-color="#fff" :current="activeIndex" @change="changeIndex">
			</u-tabs-swiper>
		</view>
		<view class="swiperBorder"></view>
		<!-- 菜单列表 -->
		<swiper class="swiperCard" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item v-for="(sub, name) in assetsList" :key="name">
				<view class="">
					<scroll-view scroll-y="true" class="assetsList " @scrolltolower="getAssetsList(true)"
						scroll-with-animation="true">
						<view class="listWrapper">
							<view v-if="!assetsList[name].length" class="isEmpty">
								<u-empty text="暂无数据" mode="data" src="../../static/common/img_blank.png"></u-empty>
							</view>
							<view v-else @click="Type.type=='HST'?navigate(item,i):ETHnavigate(item,i)"
								v-for="(item, i) in assetsList[name]" :key="i + 'key'"
								:class="['table',currentIndex== i?'active':'']">
								<view class="tableLeft">
									<view class="tabTop">
										<image class="icon" v-if="item.type=='in'" src="../../static/svg/ic_deposit.svg"
											mode=""></image>
										<image v-if="item.type=='out'" class="icon"
											src="../../static/svg/ic_withdraw.svg" mode=""></image>
										<image v-if="item.result=='ERROR'" class="icon"
											src="../../static/svg/ic_failed.svg" mode=""></image>
										<text v-if="Type.type=='HST'" class="denom">{{item.denom}}</text>
										<view class="address" v-if="Type.type=='ETH'">{{item.from | hash}}</view>
										<view class="address" v-if="Type.type=='HECO'">{{item.from | hash}}</view>
										<view class="address" v-if="Type.type=='Binance'">{{item.from | hash}}</view>
										<view class="tiem">{{item.time}}</view>
									</view>
									<!-- <view class="tabBottom">{{item.time}}</view> -->
								</view>
								<view class="tableRight">
									<text v-if="Type.type=='HST'">{{item.type === 'in' ? '+' : '-'}}
										{{hideBalance ? "****" : formatDecimal(item.value,4)}}</text>
									<text v-else-if="Type.type=='ETH'">{{item.type === 'in' ? '+' : '-'}}
										{{hideBalance ? "****" : item.amount}}</text>
									<text v-else-if="Type.type=='HECO'">{{item.type === 'in' ? '+' : '-'}}
										{{hideBalance ? "****" : formatDecimal(item.amount/1000000,4)}}</text>
										<text v-else-if="Type.type=='Binance'">{{item.type === 'in' ? '+' : '-'}}
											{{hideBalance ? "****" : formatDecimal(item.amount/1000000,4)}}</text>
								</view>
								<view class="border"></view>
							</view>
							<!-- <u-loadmore style="display: -webkit-box" v-if="assetsList[name].length" :status="loadStatus" margin-bottom="30" :load-text="loadText" @loadmore="getAssetsList(true)" icon-type="flower"/>	 -->
						</view>
					</scroll-view>
				</view>
			</swiper-item>
		</swiper>

		<view class="bottomBar">
			<view :class="['collection',collection?'active':'']">
				<u-icon class="icon" name="../../static/svg/ic_deposit.svg" custom-prefix="project-icon" size="100">
				</u-icon>
				<view class="createBtn" :custom-style="customStyle" @click="receipt">收款</view>
			</view>
			<view :class="['transfer',transfers?'active':'']">
				<u-icon class="icon" name="../../static/svg/ic_withdraw.svg" custom-prefix="project-icon" size="100">
				</u-icon>
				<view class="importBtn" type="primary" @click="transfer">转账</view>
			</view>
			<image class="btnLogo" src="../../static/svg/img_taichi.svg" mode=""></image>
		</view>
	</view>
</template>

<script>
	import {
		formatTime
	} from '../../common/js/common.js'
	import {
		ethers
	} from "@/common/js/ethers.js"
	import { hecoUrl,BinanceUrl } from '@/common/js/wallet.js'
	
	export default {
		name: 'assets',
		data() {
			return {
				btnIconColor: '#bea41e',
				customStyle: {
					color: 'white',
					backgroundColor: '#67c8e5',
				},
				menu: [{
					name: '全部',
				}, {
					name: '转出',
				}, {
					name: '转入',
				}, {
					name: '失败',
				}, ],
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
				hideBalance: false, //隐藏余额
				denom: '', //货币单位
				currencyName: '',
				walletType: '',
				account: '0.000000',
				Type: {},
				imgsrc: '',
				currentIndex: -1,
				transfers: false,
				collection: false,
				hecoUrl: hecoUrl, // 火币网链接
				BinanceUrl: BinanceUrl, // 币安
			}
		},
		onLoad(value) {
			// console.log(hecoUrl)
			let accs = this.secret.decrypt(uni.getStorageSync('account'));
			this.Type = accs[uni.getStorageSync('userAddress')];
			//根据进入时选择的币种，将其展示在标题栏上
			if (this.Type.type == 'HST') {
				uni.setNavigationBarTitle({
					title: value.val
				})
				this.denom = value.denom.slice(1);
				this.currencyName = value.val
			} else if (this.Type.type == 'ETH') {

				uni.setNavigationBarTitle({
					title: value.val
				})
				this.denom = value.val.toLowerCase()
				this.currencyName = value.val
				this.imgsrc = value.logo
			} else if (this.Type.type == 'HECO') {

				uni.setNavigationBarTitle({
					title: value.val
				})
				this.denom = value.val.toLowerCase()
				this.currencyName = value.val
				this.imgsrc = value.logo
				this.account = value.balance
			}else if (this.Type.type == 'Binance') {

				uni.setNavigationBarTitle({
					title: value.val
				})
				this.denom = value.val.toLowerCase()
				this.currencyName = value.val
				this.imgsrc = value.logo
				this.account = value.balance
			}
			this.denom = 'u' + this.denom;
			// console.log(this.denom)
		},
		async onShow() {
			// uni.showLoading({
			// 			title: '加载中',
			// 			mask:true
			// 		});
			let accs = this.secret.decrypt(uni.getStorageSync('account'));
			this.Type = accs[uni.getStorageSync('userAddress')];
			this.walletType = this.$store.state.walletType;

			if (this.Type.type != 'HST' && this.currencyName != 'ETH' && this.currencyName != 'HSC'&& this.currencyName != 'Binance') {
				this.$wallet("ETH").getTokenBalance(uni.getStorageSync('userAddress'), uni.getStorageSync('ERC20addr'))
					.then(res => {

						this.account = ethers.utils.formatEther(result)
					}).catch(err => {
						this.account = 0.0
					})
			} else if (this.currencyName == 'ETH') {
				let result = await this.$wallet('ETH').getBalance(uni.getStorageSync('userAddress'))
				this.account = ethers.utils.formatEther(result)
			} else if (this.currencyName == 'HSC') {
				// let result = await this.$wallet('HECO').getBalance(uni.getStorageSync('userAddress'))
				// this.account = ethers.utils.formatEther(result)
			}else if(this.currencyName == 'Binance'){
				
			}

			this.$store.commit('SET_QUERY_INFO_FLAG', true)
			this.assetsList = {
				all: [],
				out: [],
				in: [],
				err: []
			}

			this.queryNewAssetsList()
			this.getAssetsList()
			this.queryAssetsList()
			// this.wsSendMsg('in')
			// this.$store.state.socketTask.onMessage(res => {

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
			hash: function(value) {
				return value.slice(0, 6) + " … " + value.slice(-6);
			},
		},
		methods: {
			Time(item) {
				var date = new Date(item); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
				var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
				var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
				var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				return Y + M + D + h + m + s;

				// let arr = item.slice(0, -1).split("T");
				// let arr2 = arr[1].split(":");
				// let hours = (arr2[0] * 1) + 8
				// let timeStr = arr[0] + " " + hours + ':' + arr2[1] + ':' + arr2[2]
				// let tiemstr=arr[0] + " " + arr[1] + " GMT+0000"
				// let timeStamp = new Date(tiemstr).getTime();

				// return this.timestampToTime(timeStamp/1000)
				// return timeStr
			},
			timestampToTime(timestamp) {
				var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
				var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
				var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
				var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				return Y + M + D + h + m + s;
			},
			formatDecimal(num, i) {
				num = num.toString()
				let index = num.indexOf('.')
				if (index !== -1) {
					num = num.substring(0, i + index + 1)
				} else {
					num = num.substring(0)
				}
				return parseFloat(num).toFixed(i)
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
				if (this.currencyName == 'ETH') {
					uni.request({
						url: 'http://47.242.65.77:5676/eth/access/eth_list',
						data: {
							address: uni.getStorageSync('userAddress').toLocaleLowerCase(),
							limit: 20,
							start: 0
						},
						header: {
							'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
						},
						success: (res) => {
							// console.log(res);
							if (res.data) {
								let i = 0;
								res.data.content.forEach(item => {

									let obj = {
										fee: item.fee,
										txHash: item.tx_hash,
										result: item.result,
										from: item.from,
										to: item.to,
										amount: item.amount,
										type: item.to == uni.getStorageSync('userAddress')
											.toLocaleLowerCase() ? 'in' : 'out',
										time: this.timestampToTime(item.tx_timestamp),
										id: i++
									}
									this.assetsList.all.push(obj)

								})
								this.assetsList.out = this.assetsList.all.filter(item => item.type === 'out')
								this.assetsList.in = this.assetsList.all.filter(item => item.type === 'in')
								this.assetsList.err = this.assetsList.all.filter(item => item.isError =='1')
							}

						},
						fail: (err) => {
							console.log(err);
						},
					})
					uni.hideLoading();
				} else if (this.Type.type == 'HECO' && this.currencyName == 'HSC') {

					uni.request({
						url: this.hecoUrl, // 根据环境切换
						data:{
							'module':'account',
							'action':'tokentx',
							'address':uni.getStorageSync('userAddress').toLocaleLowerCase(),
							'startblock':0,
							'endblock':99999999,
							'sort':'desc',
							'apikey':'STREDA3BHNE99FM7VXZ44DV385EF1CAG41'
							// address:uni.getStorageSync('userAddress').toLocaleLowerCase(),limit:20,start:0
						},
						header: {
							'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
						},
						success: (res) => {
							// console.log(res);
							if (res.data) {
								let i=0;
								res.data.result.forEach(item => {

									let obj = {
										// fee:item.fee,
										txHash: item.hash,
										result:item.isError,
										from:item.from,
										to:item.to,
										amount:item.value,
										type:item.to==uni.getStorageSync('userAddress').toLocaleLowerCase()?'in':'out',
										time: this.timestampToTime(item.timeStamp),
										id:i++
									}
									this.assetsList.all.push(obj)

								})
								this.assetsList.out = this.assetsList.all.filter(item => item.type === 'out')
								this.assetsList.in = this.assetsList.all.filter(item => item.type === 'in')
								this.assetsList.err = this.assetsList.all.filter(item => item.isError=='1')
							}

						},
						fail:(err)=>{
							console.log(err);
						},
					})
					uni.hideLoading();
				} else if (this.Type.type == 'Binance' && this.currencyName == 'HSC') {

					uni.request({
						url: this.BinanceUrl, // 根据环境切换
						data:{
							'module':'account',
							'action':'tokentx',
							'address':uni.getStorageSync('userAddress').toLocaleLowerCase(),
							'startblock':0,
							'endblock':99999999,
							'sort':'desc',
							'apikey':this.secret.decrypt(uni.getStorageSync('account'))[0]
							// address:uni.getStorageSync('userAddress').toLocaleLowerCase(),limit:20,start:0
						},
						header: {
							'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
						},
						success: (res) => {
							// console.log(res);
							if (res.data) {
								let i=0;
								res.data.result.forEach(item => {

									let obj = {
										// fee:item.fee,
										txHash: item.hash,
										result:item.isError,
										from:item.from,
										to:item.to,
										amount:item.value,
										type:item.to==uni.getStorageSync('userAddress').toLocaleLowerCase()?'in':'out',
										time: this.timestampToTime(item.timeStamp),
										id:i++
									}
									this.assetsList.all.push(obj)

								})
								this.assetsList.out = this.assetsList.all.filter(item => item.type === 'out')
								this.assetsList.in = this.assetsList.all.filter(item => item.type === 'in')
								this.assetsList.err = this.assetsList.all.filter(item => item.isError=='1')
							}

						},
						fail:(err)=>{
							console.log(err);
						},
					})
					uni.hideLoading();
				}else if (this.Type.type == 'ETH' && this.currencyName != 'ETH' && this.currencyName != 'HSC') {
					uni.request({
						url: 'http://47.242.65.77:5676/eth/access/rc20_list',
						data: {
							limit: this.limit,
							start: 0,
							type: 'ALL',
							address: uni.getStorageSync('userAddress').toLocaleLowerCase(),
							contract_address: uni.getStorageSync('ERC20addr').toLocaleLowerCase()
						},
						header: {
							'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
						},
						success: (res) => {
							if (res.data) {
								// res.data.reverse();
								let i = 0;
								res.data.content.forEach(item => {
									let obj = {
										fee: item.fee,
										txHash: item.tx_hash,
										result: item.result,
										from: item.from,
										to: item.to,
										amount: item.amount,
										type: item.to == uni.getStorageSync('userAddress')
											.toLocaleLowerCase() ? 'in' : 'out',
										time: this.timestampToTime(item.tx_timestamp),
										id: i++
									}
									this.assetsList.all.push(obj)
								})
								this.assetsList.out = this.assetsList.all.filter(item => item.type === 'out')
								this.assetsList.in = this.assetsList.all.filter(item => item.type === 'in')
								this.assetsList.err = this.assetsList.all.filter(item => item.result ==
									'ERROR')
							}

						},
					})
					uni.hideLoading();
				}
			},
			//请求资产详情
			queryAssetsList(lazyLoad, loadStatus, params) {
				if (this.Type.type == 'HST') {
					// this.$u.api.getAssets(uni.getStorageSync('userAddress')).then(res => {
					// 		let coins = res.data.result.value.coins
					// 		if (/^u/i.test(coins[0].denom)) {
					// 			coins[0].amount = (coins[0].amount / 1000000).toFixed(6);
					// 		}
					// 		this.account = coins[0].amount

					// })
					this.$u.api.getAssetsList({
						limit: 9999,
						address: uni.getStorageSync('userAddress'),
						// address:'hsc1wqznqd37hve7mdk759e25svw5597rw5gglle9f',
						timetable: 'history',
						denom: this.denom
					}).then(res => {
						if (!lazyLoad) this.paging = res.paging
						if (res.data) {
							res.data.forEach(item => {
								let obj = {
									denom: '',
									time: this.Time(item.timestamp),
									value: 0,
									type: '',
									success: item.messages[0].success,
									txHash: item.tx_hash
								}
								item.messages[0].events.message.sender === uni.getStorageSync(
									'userAddress') ? obj.type = 'out' : obj.type = 'in'
								if (/^u/i.test(item.messages[0].events.transfer.denom)) {
									obj.denom = item.messages[0].events.transfer.denom.slice(1);
									obj.value = (item.messages[0].events.transfer.amount / 1000000)
										.toFixed(6);
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
						res.paging.total * 1 <= this.assetsList.all.length ? this.loadStatus = 'nomore' : this
							.loadStatus = 'loadmore'
					})
				}
			},
			// 获取资产详情
			getAssetsList(lazyLoad) {
				if (this.Type.type == 'HST') {
					uni.getStorageSync('hideBalance') ? this.hideBalance = true : this.hideBalance = false
					let params = {
						limit: 10,
						address: uni.getStorageSync('userAddress'),
						// address:'hsc1wqznqd37hve7mdk759e25svw5597rw5gglle9f',
						timetable: 'new',
						denom: this.denom
					}
					if (lazyLoad) {
						params.begin = this.paging.end - 1
					} else {
						this.$u.api.getAssets(uni.getStorageSync('userAddress')).then(res => {
							let coins = res.data.result.value.coins
							
							coins.forEach(item => {
	
								if (item.denom == this.denom) {
									this.account = (item.amount / 1000000).toFixed(6)
								}
							})


						})
					}
					// if (this.loadStatus === 'loadmore'&&lazyLoad) {
					// 	this.loadStatus = 'loading'
					// 	this.queryAssetsList(lazyLoad,this.loadStatus,params);
					// }else{


					// }
				}
			},
			navigate(item, index) {
				this.currentIndex = index
				setTimeout(() => {
					this.currentIndex = -1
				}, 200);
				uni.navigateTo({
					url: `/pages/assetsDetail/assetsDetail?hash=${item.txHash}`
				})
			},
			ETHnavigate(item, index) {
				this.$store.commit('SET_INDEX', item.id)
				uni.navigateTo({
					url: `/pages/assetsDetail/assetsDetail`
				})
			},
			//转账
			transfer() {
				this.transfers = true
				setTimeout(() => {
					this.transfers = false
				}, 300)
				if (this.currencyName != 'ETH' && this.Type.type != 'HST') {
					uni.setStorageSync('ERC20transfer', true)
				}
				uni.navigateTo({
					url: `../transfer/transfer?name=${this.Type.type=='HST'?this.currencyName+'&denom='+this.denom:this.currencyName}`
				})
			},
			//收款
			receipt() {
				// console.log(this.denom.slice(1))
				this.collection = true
				setTimeout(() => {
					this.collection = false
				}, 300)
				uni.navigateTo({
					url: '../receipt/receipt?denom='+this.denom
				})
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
	.active {
		background: #ccc;
		opacity: 0.3;
	}

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

			.walletIcon {
				width: 64rpx;
				height: 64rpx;
				position: relative;
				left: 50%;
				transform: translate(-50%, 0);
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

				.title {
					color: #909195;
				}
			}
		}

		.separated {
			width: 750rpx;
			height: 32rpx;
			background: #F7F7F7;
			margin-bottom: 20rpx;
		}

		.swiperBorder {
			width: 100%;
			height: 3rpx;
			background: #F3F3F7;
			margin-top: -6rpx;
		}

		.tabMenu {
			width: 90%;
		}

		.swiperCard {
			width: 100%;
			height: calc(#{$hei} - 680rpx);
			margin-top: 20rpx;

			.assetsList {
				background: #fff;
				height: calc(#{$hei} - 680rpx);

				.listWrapper {
					border: 2px solid #fff;

					.isEmpty {
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

								.address {
									margin-left: 9px;
									color: #1f1f1f;
									font-family: gilroy-regular;
								}

								.tiem {
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

						.border {
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

			.transfer {
				.icon {
					width: 22px;
					height: 22px;
					z-index: 22;
					position: absolute;
					left: 460rpx;
					top: 30rpx;
				}
			}

			.collection {
				.icon {
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

			.btnLogo {
				width: 88rpx;
				height: 84rpx;
				position: absolute;
				left: 50%;
				top: 12rpx;
				transform: translate(-50%, 0);
			}
		}
	}
</style>
