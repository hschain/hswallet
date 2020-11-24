<template>
	<view class="walletList">
		<view class="header">
			<image @click="back" class="back" src="../../static/common/ic_back.png" mode=""></image>
            <text class="title">选择钱包</text>
		</view>
			<view class="changeWalletDialog">
				<scroll-view scroll-y="true" class="containerBox">
					<view class="addressBox" v-for="(item, index) in userWallet" :key="index + 'name'" @click="switchUserAddress(item)">
						<view :class="['containerWrap',selected==item.addr?'hei':'bai']">
                            <image v-if="item.type=='HST'" class="icons" src="../../static/common/chain_hst.png" mode=""></image>
                            <image v-else-if="item.type=='ETH'" class="icons" src="../../static/common/chain_eth.png" mode=""></image>
                            <image v-if="selected==item.addr" class="selected" src="../../static/common/ic_checked.png" mode=""></image>
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
            <view class="footer">
                <view class="create" @click="createWallet">
                     <image  class="createIcon" src="../../static/common/ic_create_gray.png" mode=""></image>
                    创建钱包
                </view>
                <view class="import" @click="importWallet">
                    <image  class="createIcon" src="../../static/common/ic_import_gray.png" mode=""></image>
                    导入钱包
                </view>
                <view class="border"></view>
            </view>
	</view>
</template>

<script>
	export default {
		name: 'walletList',
		data() {
			return {
                sdn:true,
                userWallet: [],//钱包列表
                walletName:'',//钱包名称
                selected:'',
			}
        },
        onShow() {
                this.selected=uni.getStorageSync('userAddress');
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
                console.log("钱包列表",this.userWallet);
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
			back() {
				uni.navigateBack()
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
			//创建,导入钱包
			createWallet(){
                uni.navigateTo({
					url: '../chooseType/chooseType?type=create'
				})
            },
            importWallet(){
                uni.navigateTo({
					url: '../chooseType/chooseType?type=import'
				})
            },
            //切换用户地址
			switchUserAddress(item) {
				// console.log("点击后的itme:",item);
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
		}
	}
</script>

<style lang="scss" scoped>
    .bai{
        color: #1F1F1F;
        background: #fff;
        border: 1px solid #1F1F1F;
    }
    .hei{
        color: #fff;
        background: #1F1F1F;
        border: 1px solid #697EE4;
    }
	.walletList {
        // height: 1624rpx;
        overflow: hidden;
		// color: #000;
		.header {
            margin: 100rpx 40rpx 0;
			.back {
				width: 40rpx;
				height: 32rpx;
            } 
            .title{
                font-size: 34rpx;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #1F1F1F;
                position: absolute;
                left: 50%;
                transform: translate(-50%,0);
            }
        }
        .changeWalletDialog {
			color: #000000;
			position: relative;
			.headerTip {
				margin: 30rpx 0 40rpx;
				.icon {
					position: absolute;
					left: 30rpx;
				}
				.title {
					text-align: center;
					font-size: 40rpx;
				}
			}
			.containerBox {
				padding: 30rpx 0;
                height: 1400rpx;
                overflow: hidden;
				.addressBox {
                    margin-bottom: 30rpx;
                    .containerWrap{
                        width: 686rpx;
                        height: 160rpx;
                        border-radius: 16px;
                        position: relative;
                        // position: absolute;
                        // left: 50%;
                        // transform: translate(-50%,0);
                        margin-left: 32rpx;
                        .selected{
                            width: 32rpx;
                            height: 30rpx;
                            position: absolute;
                            top: 64rpx;
                            right: 32rpx;
                        }
                    }
                    .icons{
                        width: 64rpx;
                        height: 64rpx;
                        position: absolute;
                        left: 32rpx;
                        top: 48rpx;
                        // margin:48rpx 32rpx;
                    }
					.walletInfo {
						// color: #fff;
						// padding: 30rpx;
						.name {
                            font-size: 36rpx;
                            margin-left: 80rpx;
                            position: absolute;
                            left: 40rpx;
                            top:44rpx;
						}
						.addr {
                            text-align: end;
                            position: absolute;
                            left: 120rpx;
                            top:84rpx;
                            color: #909195;
                            font-size: 24rpx;
						}
					}
				}
			}
        }
        .footer{
            width: 100%;
            height: 168rpx;           
            background: rgba(255, 255, 255, 0.9);
            border-top: 2px solid rgba(0, 0, 0, 0.16);
            display: flex;
            justify-content: center;
            position: fixed;
            bottom: 0;
            left: 0;
            .createIcon{
                width: 44rpx;
                height: 44rpx;
                // position: absolute;
                margin-top: 60rpx;
                margin-right: 20rpx;
            }
            .create{
                width: 50%;
                height: 100%;
                line-height: 168rpx;
                display: flex;
                justify-content: center;
            }
            .import{
                width: 50%;
                height: 100%;
                line-height: 168rpx;
                display: flex;
                justify-content: center;
            }
            .border{
                width: 4rpx;
                height: 58rpx;
                background: #F3F3F7;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
            }
        }
	}
</style>
