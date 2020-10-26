<template>
	<view class="content">
		
		<view class="headerWrapper yellowContainer">
			<view class="containerWrapTop">
				<view class="walletName">
					<u-section
						font-size="42"
						:show-line="false"
						color="#fff"
						sub-color="#fff"
						:title="walletName"
						sub-title="..."
						:arrow="false"
						@click="navigate('../management/management')"
					></u-section>
				</view>
				<view class="address">
					{{addr | hash}}
				</view>
				<view class="cash">
					{{hideBalance ? '****' : '$ ' + assetsList[0].value}}
				</view>
			</view>
			<view class="containerWrapBottom">
				<view class="boxWrapper" @click="navigate('../transfer/transfer')">
					<view class="content yellowFont">
						转账
					</view>
				</view>
				<view class="boxWrapper" @click="navigate('../receipt/receipt')">
					<view class="content yellowFont">
						收款
					</view>
				</view>
				<view class="boxWrapper" @click="info">
					<view class="content yellowFont">
						PoB
					</view>
				</view>
			</view>
		</view>
		
		<view class="assets yellowContainer">
			<view class="containerWrap">
				<view class="title">
					<text>资产</text>
				</view>
				<view class="assetsList">
					<view @click="enterAssets(item)" v-for="item in assetsList" :key="item.denom" class="table">
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
		
		<updateTip  ref="updateTipNav" :newestUpdate="newestUpdate"></updateTip>
	</view>
</template>

<script>
	import updateTip from '../../components/updateTip.vue'
	export default {
		name: 'mainPage',
		components: { updateTip },
		data() {
			return {
				walletName: '',
				addr: '',
				assetsList: [
					{
						value: 0
					}
				],
				hideBalance: false ,//隐藏余额
				newestUpdate: false, //是否为最新版本
				backupMnemonic: uni.getStorageSync('backupMnemonic') || false
			}
		},
		onLoad() {
			this.getUpdate()
			if (!this.$store.state.walletName) {
				let acc = this.secret.decrypt(uni.getStorageSync('account'));
				this.addr =  Object.keys(acc)[0]
				this.walletName = acc[this.addr].name
				this.$store.commit('SET_WALLETNAME', this.walletName)
				this.$store.commit('SAVE_MY_ADDRESS', this.addr)
			}
		},
		onShow() {
			this.walletName = this.$store.state.walletName
			this.addr = this.$store.state.myAddr
			uni.getStorageSync('hideBalance') ? this.hideBalance = true : this.hideBalance = false
			if (uni.getStorageSync('account')) {
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
			enterAssets(item) {
				uni.navigateTo({ url: `/pages/assets/assets?val=${item.denom}` })
			},
			navigate(url) {
				uni.navigateTo({url})
			},
			info() {
				// #ifdef APP-PLUS
				plus.nativeUI.toast('敬请期待')
				// #endif
			},
			getUpdate() {
				if (uni.getStorageSync('account')) { //如果用户已注册账号，则会检测版本更新
					let platform = ''
					// #ifdef APP-PLUS
					window.plus.os.name === 'Android' ? platform = 'Android' : platform = 'ios'
					// #endif
					this.$u.api.getVersion({
						app: 'HSWallet',
						platform
					}).then(res => {
						console.log(res);
					})
				}
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
			.containerWrapTop {
				width:calc(100% - .6rpx);
				height:calc(100% - .6rpx);
				// background:linear-gradient(132deg,rgba(19,78,51,1) 0%,rgba(9,32,53,1) 100%);
				background:linear-gradient(132deg,rgba(6, 23, 16,1) 0%,rgba(9,32,53,1) 100%);
				border-radius:12rpx 12rpx 0 0;
				box-sizing: border-box;
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
					margin: 30rpx 30rpx 40rpx;
					font-size: 40rpx;
				}
			}
			.containerWrapBottom {
				margin-top: 1rpx;
				width:calc(100% - .6rpx);
				height:calc(100% - .6rpx);
				// background:linear-gradient(132deg,rgba(19,78,51,1) 0%,rgba(9,32,53,1) 100%);
				background:linear-gradient(132deg,rgba(6, 23, 16,1) 0%,rgba(9,32,53,1) 100%);
				border-radius:0 0 12rpx 12rpx;
				box-sizing: border-box;
				display: flex;
				justify-content: space-between;
				.boxWrapper {
					width: 100%;
					margin: 30rpx 0;
					font-size: 32rpx;
					border-left: 1rpx solid #423008;
					&:first-child {
						border-left: 0rpx solid #fff;
					}
				}
			}
		}
		.btnBox {
			margin-bottom: 30rpx;
			.boxWrapper {
				padding: 30rpx 0;
				display: flex;
				justify-content: space-between;
				.content {
					margin: 0 25rpx;
					.btn {
						text-align: center;
						padding: 15rpx 0;
					}
				}
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
