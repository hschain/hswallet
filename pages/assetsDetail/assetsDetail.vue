<template>
	<view class="content">
		<!-- <view style="height: var(--status-bar-height);background-color: var(--mainColor);"></view> -->
		<view class="detail greenContainer">
			<view class="showDetail containerWrap">
				<image v-if="assetData.success" class="icon" src="../../static/common/yes.png" mode=""></image>
				<image v-else class="icon" src="../../static/common/wrong.png" mode=""></image>
				<text class="tip">{{!assetData.success ? '失败' : '成功'}}</text>
				<text>{{assetData.time}}</text>
			</view>
		</view>
		<view class="amountDetail greenContainer">
			<view class="containerWrap containerBox">
				<view class="amountMsg">
					<text>金额</text>
					<text>{{assetData.type === 'in' ? '+' : '-'}}{{assetData.value + ' ' + assetData.denom}}</text>
				</view>
				<view class="txsDetail">
					<view class="txDetailBox" v-for="(item, index) in assetData.details" :key="index + 'index'">
						<view class="txDetailContent">
							<view class="">
								{{item.name}}
							</view>
							<view class="value">
								{{item.value || '-'}}
							</view>
						</view>
					</view>
				</view>	
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
			}
		},
		onLoad(value) {
			// this.assetData = JSON.parse(value.item) 
			this.$u.api.getAssetsList({}, '/' + value.hash).then(res => {
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
						item.messages[0].events.message.sender === uni.getStorageSync('userAddress') ? this.assetData.type = 'out' : this.assetData.type = 'in'
						if (/^u/i.test(item.messages[0].events.transfer.denom)) {
							this.assetData.denom = item.messages[0].events.transfer.denom.slice(1);
							this.assetData.value = (item.messages[0].events.transfer.amount / 1000000).toFixed(6);
						}
					})
				}
			})
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			changeIndex(val) {
				if (val !== 'all') {
					this.assetsList = this.oAssetsList.filter(item => item.type === val)
				} else {
					this.assetsList = this.oAssetsList
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		
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
				.icon {
					width: 100rpx;
					height: 100rpx;
				}
				.tip {
					margin: 10rpx 0;
				}
			}
		}
		.amountDetail {
			margin: 30rpx 40rpx;
			font-size: 28rpx;
			.containerBox {
				padding: 40rpx 0;
				.amountMsg {
					display: flex;
					justify-content: space-between;
					padding: 40rpx 30rpx;
					border: 1px solid #ccc;
					// box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.2);
					border-radius: 5px;
					margin: 0 20rpx;
				}
				.txsDetail {
					border: 1px solid #ccc;
					border-radius: 5px;
					margin: 30rpx 20rpx 0;
					height: 50vh;
					.txDetailBox {
						margin: 40rpx;
						.txDetailContent {
							display: flex;
							justify-content: space-between;
							.value {
								width: 60%;
								word-break: break-word;
							}
						}
					}
				}
			}
		}
	}
</style>
