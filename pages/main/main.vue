<template>
	<view class="content">
		<view class="top">
			<u-navbar back-icon-name="list" :custom-back="selectWallet" back-icon-color="#fff" style="font-weight: 600;" title-color="#fff" :border-bottom="false" title="钱包" :background="{background}"></u-navbar>
			<view class="headerWrapper">
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
					<view class="address" @click="onCopy()">
						{{addr | hash}}
					</view>
					<view class="cash">
						{{hideBalance ? '****' : '$ ' + assetsList[0].value}}
					</view>
				</view>
				<image class="btnLogo" src="../../static/common/img_taichi.png" mode=""></image>
				<view class="containerWrapBottom">
					
					<view class="transfer" @click="navigate('../transfer/transfer')">
						<u-icon class="icon" name="../../static/common/ic_deposit.png" :color="btnIconColor" custom-prefix="project-icon" size="30"></u-icon>
						<view class="contents">
							转账
						</view>
					</view>
					<view class="collection" @click="navigate('../receipt/receipt')">
						<u-icon class="icon" name="../../static/common/ic_withdraw.png" :color="btnIconColor" custom-prefix="project-icon" size="30"></u-icon>
						<view class="contents">
							收款
						</view>
					</view>
					<!-- <view class="boxWrapper" @click="info">
						<u-icon class="icon" name="dig" :color="btnIconColor" custom-prefix="project-icon" size="30"></u-icon>
						<view class="content yellowFont">
							PoB
						</view>
					</view> -->
				</view>
			</view>
		</view>
		
		<view class="assets">
			<view class="containerWrap">
				<view class="title">
					<text>资产</text>
				</view>
				<u-icon class="addIcon" size="40" name="../../static/common/circlePlus.png" color="#000" @click="gotoAddCurrency"></u-icon>
				<view class="assetsList">
					<view @click="enterAssets(item)" v-for="item in assetsList" :key="item.denom" class="table">
						<view class="tableWrapper">
							<view class="tableLeft">
								<image class="icon" v-if="item.denom === 'HST'" src="../../static/common/logo.png" mode=""></image>
								<image class="icon" v-else src="../../static/common/symbol_none.svg" mode=""></image>
								<text class="denom">{{item.denom}}</text>
							</view>
							<view class="tableRight">
								<text>{{hideBalance ? '****' : item.amount + ' '}}</text>
								<text>{{hideBalance ? '****' : '$ ' + item.value}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- <u-popup v-model="changeWalletDialog" mode="bottom" border-radius="20" :closeable="true">
			<view class="changeWalletDialog">
				<view class="headerTip">
					<u-icon class="icon" size="40" name="../../static/common/circlePlus.png" color="#000" @click="addNewAddress"></u-icon>
					<view class="title">
						钱包列表
					</view>
				</view>
				<scroll-view scroll-y="true" class="containerBox">
					<view class="yellowContainer addressBox" v-for="(item, index) in userWallet" :key="index + 'name'" @click="switchUserAddress(item)">
						<view class="containerWrap">
							<view class="walletInfo">
								<view class="name">
									{{item.name}}
								</view>
								<view class="addr">
									{{item.addr | hash}}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup> -->
		
		<u-action-sheet @click="selectOption" :list="optionList" v-model="addNewAddrDialog" :cancel-btn="true" border-radius="20"></u-action-sheet>
		
		<updateTip  ref="updateTipNav" :formMain="true"></updateTip>
	</view>
</template>

<script>
	import updateTip from '../../components/updateTip.vue'
	export default {
		name: 'mainPage',
		components: { updateTip },
		data() {
			return {
				walletName: '', //钱包名称
				addr: '', //当前使用地址
				assetsList: [
					{
						value: 0
					}
				],
				hideBalance: false ,//隐藏余额
				newestUpdate: false, //是否为最新版本
				backupMnemonic: uni.getStorageSync('backupMnemonic') || false, //是否已备份助记词
				background: {
					backgroundColor: '#fff',
				},
				changeWalletDialog: false, //弹起钱包选择弹框
				addNewAddrDialog: false, //添加新地址弹框
				optionList: [
					{
						text: '创建钱包',
						fontSize: 32,
						color: '#000'
					}, {
						text: '导入钱包',
						fontSize: 32,
						color: '#000'
					}
				],
				btnIconColor: '#bea41e',
				userWallet: [], //当前用户多个钱包信息
			}
		},
		onLoad() {
			//延时调用，防止在android上plus方法未准备完毕，导致代码无法往下执行
			setTimeout(() => {
				this.getUpdate()			
			}, 500)
		},
		onShow() {
			this.addr = uni.getStorageSync('userAddress')
			if (!this.$store.state.walletName && uni.getStorageSync('account')) {
				let acc = this.secret.decrypt(uni.getStorageSync('account'));
				this.walletName = acc[this.addr].name
				for (let idx in acc) {
					this.userWallet.push({
						addr: idx,
						name: acc[idx].name,
						type: acc[idx].type
					})
				}
				this.$store.commit('SAVE_USER_WALLET', this.userWallet)
				this.$store.commit('SET_WALLETNAME', this.walletName)
			} else {
				this.walletName = this.$store.state.walletName
				this.userWallet = this.$store.state.userWallet
			}
			//是否隐藏资金
			uni.getStorageSync('hideBalance') ? this.hideBalance = true : this.hideBalance = false
			
			//如果用户已注册账户地址，则执行接下来的命令
			if (uni.getStorageSync('account')) {
				this.getAssets()
				
				// if (!this.$store.state.socketIsOpen) {
				// 	this.$store.dispatch('websocketInit', "wss://testnet.hschain.io/api/v1/ws")
				// 	let _this = this
				// 	let wsParams = {
				// 		address: this.addr,
				// 		app: 'HSWallet',
				// 		page: 'app',
				// 		signal: 'connect'
				// 	}
				// 	this.$store.state.socketTask.onOpen(res => {
				// 		this.$store.state.socketTask.send({
				// 			data: JSON.stringify(wsParams),
				// 			async success() {
				// 				console.log('发送connect信息成功');
				// 			}
				// 		})
				// 	})
				// }
			}
			
			//如果vuex存在助记词缓存，则清空助记词
			if (this.$store.state.mnemonic) this.$store.dispatch('saveMnemonic', '')
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
			gotoAddCurrency(){
				uni.navigateTo({
					url: '../addCurrency/addCurrency'
				})
			},
			info() {
				// #ifdef APP-PLUS
				plus.nativeUI.toast('主网映射后开放')
				// #endif
			},
			getAssets () {
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
			},
			getUpdate() {
				if (uni.getStorageSync('account')) { //如果用户已注册账号，则会检测版本更新
					let platform = ''
					let version = ''
					// #ifdef APP-PLUS
					plus.os.name === 'Android' ? platform = 'Android' : platform = 'Ios'
					version = 'v' + plus.runtime.version
					// #endif
					this.$u.api.getVersion({
						address: uni.getStorageSync('userAddress'),
						version,
						app: 'HSWallet',
						platform
					}).then(res => {
						if (version !== res.data.version) {
							this.$store.commit('SAVE_UPDATE_RES', res)
							this.$refs.updateTipNav.showDialog()
						}
					})
				}
			},
			// 复制地址
			onCopy() {
				//#ifndef H5
				uni.setClipboardData({
					data: this.addr
				})
				//#endif
			},
			//选择钱包
			selectWallet() {
				uni.navigateTo({url: '../walletList/walletList'})
			},
			//添加新的钱包地址
			addNewAddress() {
				this.addNewAddrDialog = true
			},
			//创建或导入钱包
			selectOption(index) {
				//index: 操作下标
				if(index === 0) { // 创建
					uni.navigateTo({url: '../safetyTips/safetyTips'})
				} else { // 导入
					uni.navigateTo({url: '../importMnemonic/importMnemonic'})
				}
				this.changeWalletDialog = false
			},
			//切换用户地址
			switchUserAddress(item) {
				console.log("点击后的itme:",item);
				this.addr =  item.addr
				this.walletName = item.name
				this.$store.commit('SET_WALLETNAME', item.name)
				uni.setStorageSync('userAddress', item.addr)
				this.getAssets()
				this.changeWalletDialog = false
				//刷新页面
				uni.reLaunch({
					url: '../main/main'
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
		.top{
			width: 100%;
			height: 530rpx;
			background: #3C3C3D;
			.headerWrapper {
				display: flex;
				flex-direction: column;
				color: #fff;		
				.containerWrapTop {
					width:94%;
					height:240rpx;
					background: linear-gradient(225deg, #E6C99B 0%, #C6A471 100%);
					box-shadow: 0px 24px 24px -24px rgba(212, 180, 131, 0.3);
					border-radius: 16px;
					box-sizing: border-box;
					position: absolute;
					top: 100rpx;
					left: 50%;
					transform: translate(-50%,0);
					.walletName {
						margin: 30rpx;
					}
					.address {
						margin: 10rpx 30rpx;
						font-size: 28rpx;
						color: #FCC350;
					}
					.cash {
						display: flex;
						justify-content: flex-end;
						margin: 30rpx 30rpx 40rpx;
						font-size: 40rpx;
					}
				}
				.btnLogo{
				width: 44px;
				height: 42px;
				position: absolute;
				left: 50%;
				top: 393rpx;
				transform: translate(-50%,0);
				z-index: 1;
			}
				.containerWrapBottom {
					width: 100%;
					border-radius:0 0 12rpx 12rpx;
					box-sizing: border-box;
					display: flex;
					justify-content: center;
					position: absolute;
					top: 390rpx;
					font-size: 32rpx;
					.contents{
						text-align: center;
						line-height: 88rpx;
					}	
					.transfer{
						width: 340rpx;
						height: 88rpx;
						background: #1F1F1F;
						border-radius: 22px 0px 0px 22px;
						border: 1px solid #1F1F1F;
						.icon {
							position: absolute;
							left: 140rpx;
							top: 30rpx;
						}
					}
					.collection{
						width: 340rpx;
						height: 88rpx;
						background: #fff;
						border-radius: 0px 22px 22px 0px;
						border: 1px solid #1F1F1F;
						color: #1F1F1F;
						.icon {
							position: absolute;
							left: 450rpx;
							top: 30rpx;
						}
					}
					// .boxWrapper {
					// 	width: 100%;
					// 	margin: 30rpx 0;
					// 	padding: 0 30rpx;
					// 	font-size: 32rpx;
					// 	border-left: 1rpx solid #423008;
					// 	display: flex;
					// 	justify-content: center;
					// 	&:first-child {
					// 		border-left: 0rpx solid #fff;
					// 	}
						
					// }
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
			color: #1F1F1F;
			.title {
				font-size: 32rpx;
				font-weight: 500;
				position: absolute;
				left: 32rpx;
				margin-top: 20rpx;
			}
			.addIcon{
				position: absolute;
				right: 32rpx;	
				margin-top: 20rpx;
			}
			.assetsList {
				margin: 40rpx;
				.table {
					border-radius: 10rpx;
					margin: 0 0 30rpx;
					.tableWrapper {
						width: 750rpx;
						padding: 50rpx 32rpx;

						display: flex;
						justify-content: space-between;
						// background-color: transparent;
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
		// .changeWalletDialog {
		// 	color: #000000;
		// 	position: relative;
		// 	.headerTip {
		// 		margin: 30rpx 0 40rpx;
		// 		.icon {
		// 			position: absolute;
		// 			left: 30rpx;
		// 		}
		// 		.title {
		// 			text-align: center;
		// 			font-size: 40rpx;
		// 		}
		// 	}
		// 	.containerBox {
		// 		padding: 30rpx 0;
		// 		height: 600rpx;
		// 		.addressBox {
		// 			margin-bottom: 30rpx;
		// 			.walletInfo {
		// 				color: #fff;
		// 				padding: 30rpx;
		// 				.name {
		// 					font-size: 36rpx;
		// 				}
		// 				.addr {
		// 					text-align: end;
		// 				}
		// 			}
		// 		}
		// 	}
		// }
	}
</style>
