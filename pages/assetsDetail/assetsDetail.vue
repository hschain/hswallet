<template>
<view>
	<view class="content" v-if="walletType=='HST'">
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
	<view class="content" v-else-if="walletType=='ETH'">
		<view class="detail">
			<view class="showDetail">
				<image v-if="details.result=='SUCCESS'" class="icon" src="../../static/common/img_success.png" mode=""></image>
				<image v-else class="icon" src="../../static/common/wrong.png" mode=""></image>
				<text :class="['tip',details.result=='SUCCESS'?'green':'red']">{{details.result=='SUCCESS'? '成功' : '失败'}}</text>
				<text class="time">{{formatDate(details.tx_timestamp)}}</text>
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
				assetData: {},
				walletType:'',
				details:{}
			}
		},
		onShow(){
			this.walletType=this.$store.state.walletType;
			if (this.walletType=='ETH') {
				uni.request({
						url:'http://8.129.187.233:25676/eth/access/eth_list',
						data:{limit: 10,start:0,type:'ALL',address:uni.getStorageSync('userAddress').toLocaleLowerCase()},
						header: {
							'content-type': 'application/json;charset=UTF-8' //自定义请求头信息
						},
						success: (res) => {
							console.log(res,this.$store.state.index);
							if (res.data) {
								this.details=res.data.content[this.$store.state.index];
							}
						},
					})
			}else{
				uni.request({
						url:'http://8.129.187.233:25676/eth/access/eth_list',
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
			this.walletType=this.$store.state.walletType;
			if (this.walletType=='HST') {
				console.log('HST');
				this.$u.api.getAssetsList({}, '/' + value.hash).then(res => {
					console.log('res',res.data);
					if (res.data) {
						res.data.forEach(item => {
							this.assetData = {
								denom: '',
								time: formatTime(item.timestamp, true),
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
							console.log('this.assetData',this.assetData);
							item.messages[0].events.message.sender === uni.getStorageSync('userAddress') ? this.assetData.type = 'out' : this.assetData.type = 'in'
							if (/^u/i.test(item.messages[0].events.transfer.denom)) {
								this.assetData.denom = item.messages[0].events.transfer.denom.slice(1);
								this.assetData.value = (item.messages[0].events.transfer.amount / 1000000).toFixed(6);
							}
						})
					}
				}).catch(err=>{
					console.log(err);
				})
			}else if (this.walletType=='ETH') {
					
		}
		},
		methods:{
			goto(item){
				console.log(item);
				if(this.walletType=='ETH'){
					uni.navigateTo({
						url: `../etheric/etheric?url=https://cn.etherscan.com/tx/${item}`
					})
				}
				
			},
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
		width: 474rpx;
		font-size: 24rpx;
		font-family: Gilroy-Regular, Gilroy;
		font-weight: 400;
		color: #1F1F1F;
		margin-left: 96rpx;
		// word-break: break-all;
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
