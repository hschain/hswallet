<template>
	<view class="content">
		<!-- <view style="height: var(--status-bar-height);background-color: var(--mainColor);"></view> -->
		<view class="headerWrapper purpleContainer">
			<view class="containerWrap">
				<view class="walletName">
					<u-section
						font-size="42"
						:show-line="false"
						color="#fff"
						sub-color="#fff"
						:title="walletName"
						sub-title="..."
						:arrow="false"
						@click="figure"
					></u-section>
				</view>
				<view class="address purpleFont">
					{{addr | hash}}
				</view>
				<view class="cash">
					{{hideBalance ? '****' : '$ ' + assetsList[0].value}}
				</view>
			</view>
		</view>
		<view class="assets yellowContainer">
			<view class="containerWrap">
				<view class="title">
					<text>资产</text>
				</view>
				<view class="assetsList">
					<view @click="navigate(item)" v-for="item in assetsList" :key="item.denom" class="table">
						<view class="tableWrapper">
							<view class="tableLeft">
								<image class="icon" v-if="item.denom === 'HST'" src="../../static/common/logo.png" mode=""></image>
								<image class="icon" v-else src="../../static/common/symbol_none.svg" mode=""></image>
								<text class="denom">{{item.denom}}</text>
							</view>
							<view class="tableRight">
								<text>{{hideBalance ? '****' : item.amount + ' ' + item.denom}}</text>
								<text>{{hideBalance ? '****' : '$ ' + item.value}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'mainPage',
		data() {
			return {
				walletName: '',
				addr: '',
				assetsList: [
					{
						value: 0
					}
				],
				hideBalance: false //隐藏余额
			}
		},
		onShow() {
			uni.getStorageSync('hideBalance') ? this.hideBalance = true : this.hideBalance = false
			if (uni.getStorageSync('account')) {
				let acc = this.secret.decrypt(uni.getStorageSync('account'));
				this.addr =  Object.keys(acc)[0]
				this.walletName = acc[this.addr].name
				this.$u.api.getAssets(this.addr).then(res => {
					this.assetsList = res.data.result.value.coins
					this.assetsList.forEach((item) => {
						if (/^u/i.test(item.denom)) {
							item.denom = item.denom.slice(1).toUpperCase();
							item.amount = (item.amount / 1000000).toFixed(6);
						}
						item.price = (item.price*1).toFixed(6)
						item.value = (item.price*item.amount).toFixed(6)
					});
				})
			}
		},
		filters: {
			hash: function (value) {
			  return value.slice(0, 12) + " … " + value.slice(-12);
			},
		},
		methods: {
			navigate(item) {
				// this.$store.commit('SAVE_MY_ADDRESS', this.addr)
				this.$store.commit('SAVE_MY_ADDRESS', this.addr)
				uni.navigateTo({ url: `/pages/assets/assets?val=${item.denom}` })
			},
			figure() {
				uni.navigateTo({
					url: '/pages/management/management'
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.headerWrapper {
			display: flex;
			flex-direction: column;
			margin: 20rpx 0 30rpx;
			color: #fff;
			.walletName {
				margin: 30rpx;
			}
			.address {
				margin: 10rpx 30rpx;
				font-size: 36rpx;
			}
			.cash {
				display: flex;
				justify-content: flex-end;
				margin: 30rpx 30rpx;
				font-size: 40rpx;
			}
		}
		.assets {
			display: flex;
			flex-direction: column;
			color: #fff;
			.title {
				margin: 30rpx 30rpx 0;
				font-size: 46rpx;
				font-weight: 500;
			}
			.assetsList {
				margin: 40rpx;
				.table {
					border-radius: 10rpx;
					margin: 0 0 30rpx;
					.tableWrapper {
						padding: 20rpx;
						display: flex;
						justify-content: space-between;
						background-color: transparent;
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
	}
</style>
