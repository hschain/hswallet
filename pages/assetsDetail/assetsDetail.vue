<template>
<view>
	<view class="content" v-if="Type.type=='HST'">
		<view class="detail">
			<view class="showDetail">
				<image v-if="assetData.success" class="icon" src="../../static/common/img_success.png" mode=""></image>
				<image v-else class="icon" src="../../static/common/img_fail.png" mode=""></image>
				<text :class="['tip',assetData.success?'green':'red']">{{assetData.success? '成功' : '失败'}}</text>
				<text class="time">{{assetData.time}}</text>
				<text class="amount">{{assetData.type === 'in' ? '+ ' : '- '}}{{assetData.value+' HST'}}</text>
			</view>
		</view>
		
		<view class="amountDetail ">
			<view class="fee">
				<text class="title">矿工费</text>
				<text class="number">{{0+' HST'}}</text>
				<view class="calculation">GasPrice(24.00 GWEI) * Gas(112,956)</view>
				<view class="border"></view>
			</view>
			<view class="collection">
				<text class="title">收款地址</text>
				<text class="addr">{{assetData.details.to.value}}</text>
			</view>
			<view class="transfer">
				<text class="title">付款地址</text>
				<text class="addr">{{assetData.details.from.value}}</text>
				<view class="border"></view>
			</view>
			<view class="hash">
				<text class="title">交易哈希</text>
				<view class="addre">{{assetData.details.txHash.value}}</view>
			</view>
			<view class="check" @click="goto(assetData.details.txHash.value)">查询详细信息></view>
		</view>
	</view>
	<view class="content" v-else-if="Type.type=='ETH'">
		<view class="detail">
			<view class="showDetail">
				<image v-if="details.result=='SUCCESS'" class="icon" src="../../static/common/img_success.png" mode=""></image>
				<image v-else class="icon" src="../../static/common/wrong.png" mode=""></image>
				<text :class="['tip',details.result=='SUCCESS'?'green':'red']">{{details.result=='SUCCESS'? '成功' : '失败'}}</text>
				<text class="time">{{timestampToTime(details.tx_timestamp)}}</text>
				<text class="amount">{{details.to === '0x85464b207d7c1fce8da13d2f3d950c796e399a9c' ? '+ ' : '- '}}{{details.amount+' ETH'}}</text>
			</view>
		</view>
		
		<view class="amountDetail ">
			<view class="fee">
				<text class="title">矿工费</text>
				<text class="number">{{details.fee+' ETH'}}</text>
				<view class="calculation">GasPrice(24.00 GWEI) * Gas(112,956)</view>
				<view class="border"></view>
			</view>
			<view class="collection">
				<text class="title">收款地址</text>
				<text class="addr">{{details.to}}</text>
			</view>
			<view class="transfer">
				<text class="title">付款地址</text>
				<text class="addr">{{details.from}}</text>
				<view class="border"></view>
			</view>
			<view class="hash">
				<text class="title">交易哈希</text>
				<view class="addre">{{details.tx_hash}}</view>
			</view>
			<view class="check" @click="goto(details.tx_hash)">查询详细信息></view>
		</view>
	</view>
</view>
	
	
</template>

<script>
	import { formatTime } from '../../common/js/common.js'
	export default {
		data() {
			return {
				title: '',
				assetData: {
					details: {
						txHash: {
							name: '交易hash',
								value: '',
							},
									
							from: {
								name: '来源',
								value: '',
							},
							to: {
								name: '去向',
								value: '',
							},
					}	
				},
				walletType:'',
				details:{},
				Type:{},	
		}
	},
		onShow(){
			let accs = this.secret.decrypt(uni.getStorageSync('account'));
			this.Type=accs[uni.getStorageSync('userAddress')];
			this.walletType=this.$store.state.walletType;
			if (this.Type.type=='ETH'&&!uni.getStorageSync('ERC20addr')) {
				uni.request({
						url:'http://47.242.65.77:5676/eth/access/eth_list',
						data:{limit: 10,start:0,type:'ALL',address:uni.getStorageSync('userAddress').toLocaleLowerCase()},
						header: {
							'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
						},
						success: (res) => {
							if (res.data) {
								this.details=res.data.content[this.$store.state.index];
							}
						},
					})
			}else if(this.Type.type=='ETH'&& uni.getStorageSync('ERC20addr')){
				uni.request({
						url:'http://47.242.65.77:5676/eth/access/rc20_list',
						data:{limit: 10,start:0,type:'ALL',address:uni.getStorageSync('userAddress').toLocaleLowerCase(),contract_address:uni.getStorageSync('ERC20addr').toLocaleLowerCase()},
						header: {
							'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
						},
						success: (res) => {
							if (res.data) {
								// this.details.result=res.data.content[this.index].result;
								// this.details.time=res.data.content[this.index].time;
								// this.details.amount=res.data.content[this.index].amount;
								// this.details.hash=res.data.content[this.index].tx_hash;
								// this.details.to=res.data.content[this.index].to;
								// this.details.from=res.data.content[this.index].from;
								// this.details.fee=res.data.content[this.index].fee;
								// this.details.type=res.data.content[this.index].to=='0x85464b207d7c1fce8da13d2f3d950c796e399a9c'?'in':'out';
								this.details=res.data.content[this.$store.state.index];
							}
						},
					})
			}
			
					
		},
		onLoad(value) {
			//获取当前交易hash信息
			let accs = this.secret.decrypt(uni.getStorageSync('account'));
			this.Type=accs[uni.getStorageSync('userAddress')];
			// this.walletType=this.$store.state.walletType;
			if (this.Type.type=='HST') {
				this.$u.api.getAssetsList({}, '/' + value.hash).then(res => {
					if (res.data) {
						
						res.data.forEach(item => {
							this.assetData = {
								denom: '',
								time: this.Time(item.timestamp),
								value: 0,
								type: '',
								success: item.messages[0].success,
								details: {
									txHash: {
										name: '交易hash',
										value: item.tx_hash,
									},
									height: {
										name: '区块高度',
										value: item.height,
									},
									from: {
										name: '来源',
										value: item.messages[0].events.message.sender,
									},
									to: {
										name: '去向',
										value: item.messages[0].events.transfer.recipient,
									},
									memo: {
										name: '备注',
										value: item.memo
									}
								}
							}
						
							item.messages[0].events.message.sender === uni.getStorageSync('userAddress') ? this.assetData.type = 'out' : this.assetData.type = 'in'
							if (/^u/i.test(item.messages[0].events.transfer.denom)) {
								this.assetData.denom = item.messages[0].events.transfer.denom.slice(1);
								this.assetData.value = (item.messages[0].events.transfer.amount / 1000000).toFixed(6);
							}
						})
						
					}
				}).catch(err=>{
					
				})
			}
		},
		methods:{
			goto(item){
				
				if(this.Type.type=='ETH'){
					uni.navigateTo({
						url: `../etheric/etheric?url=https://cn.etherscan.com/tx/${item}`
					})
				}else if(this.Type.type=='HST'){
					uni.navigateTo({
						url: `../etheric/etheric?url=https://scan.hschain.io/#/transactions/${item}`
					})
				}
				
			},
			Time(item) {
				let arr = item.slice(0, -1).split("T");
				let arr2=arr[1].split(":");
				let hours=(arr2[0]*1)+8
				let timeStr=arr[0] + " " + hours+':'+arr2[1]+':'+arr2[2]
				// let tiemstr=arr[0] + " " + arr[1] + " GMT+0000"
				// let timeStamp = new Date(tiemstr).getTime();
				
				// return this.timestampToTime(timeStamp/1000)
				return timeStr
			},
			timestampToTime(timestamp) {
				var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var Y = date.getFullYear() + '-';
				var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
				var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
				var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
				var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
				var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
				return Y+M+D+h+m+s;
   			},
		}
}
</script>

<style lang="scss" scoped>
	.green{
		color: #52CC95;
	}
	.red{
		color: #D04B63;
	}
	.border{
		width: 718rpx;
		height: 2rpx;
		background: #F3F3F7;
		position: absolute;
		bottom: 0;
		right: 0;
	}
	.title{
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #909195;
	}
	.addr{
		// width: 474rpx;
		width: 247px;
		font-size: 24rpx;
		font-family: Gilroy-Regular, Gilroy;
		font-weight: 400;
		color: #1F1F1F;
		margin-left: 96rpx;
		word-break: break-all;
		// overflow: hidden;
		position: absolute;
		top: 40rpx;
		left: 130rpx;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.detail {
			.showDetail {
				font-size: 30rpx;
				padding: 20rpx 0;
				display: flex;
				align-items: center;
				flex-direction: column;
				padding: 20rpx 0;
				color: #1f1f1f;
				.icon {
					width: 64rpx;
					height: 64rpx;
				}
				.tip {
					margin: 10rpx 0;
				}
				.time{
					font-size: 24rpx;
					color: #909195;
				}
				.amount{
					margin-top: 48rpx;
					font-family: gilroy-regular;
				}
			}
		}
		.amountDetail {
			width: 100%;
			margin: 30rpx 40rpx;
			font-size: 28rpx;
			margin-top: 64rpx;
			font-family: gilroy-regular;
			.fee{
				height: 144rpx;
				padding: 40rpx 32rpx;
				// border: 1px solid #000;
				position: relative;
				.number{
					font-size: 24rpx;
					font-family: Gilroy-Regular, Gilroy;
					font-weight: 400;
					color: #1F1F1F;
					margin-left: 126rpx;
				}
				.calculation{
					font-size: 24rpx;
					font-family: Gilroy-Regular, Gilroy;
					font-weight: 400;
					color: #909195;
					margin-left: 192rpx;
				}
			}
			.collection{
				height: 144rpx;
				padding: 40rpx 32rpx;
				// border: 1px solid #000;
				position: relative;
			}
			.transfer{
				height: 144rpx;
				padding: 40rpx 32rpx;
				// border: 1px solid #000;
				position: relative;
			}
			.hash{
				height: 144rpx;
				padding: 40rpx 32rpx;
				// border: 1px solid #000;
				position: relative;
				.addre{
					width: 247px;
					font-size: 24rpx;
					font-family: Gilroy-Regular, Gilroy;
					font-weight: 400;
					color: #1F1F1F;
					word-break: break-all;
					position: absolute;
					top: 40rpx;
					left: 226rpx;
				}
			}
			.check{
				font-size: 32rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #1F1F1F;
				margin-top: 96rpx;
				text-align: center;
				text-decoration:underline;
			}
		}
	}
</style>
