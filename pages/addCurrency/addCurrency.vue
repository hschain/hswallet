<template>
    <view class="addCurrency">
        <view class="top">
            <image @click="back" class="back" src="../../static/common/ic_back.png" mode=""></image>
            <view class="topTitle">添加币种</view>
        </view>
        <u-input v-model="value"
                 type="text" 
                 :border="true" 
                 border-color="#DDDDE0" 
                 placeholder="请输入Token名称或合约地址" 
                 :height="96" 
                 :focus="true" />
        <view>
            <view class="title">首页资产</view>
            <view class="assetsList">
                        <view  v-for="item in assetsList" :key="item.denom" class="table ">
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
                            <view class="border"></view>
                        </view>
                </view>
            </view>
        
    </view>
</template>
<script>
export default {
    name:'addCurrency',
    data(){
        return {
            walletName: '', //钱包名称
            value: '',
            addr: '', 
            assetsList:[{
                value:0,
            }],
            userWallet: [],
        }
    },
    onShow() {
			this.addr = uni.getStorageSync('userAddress')
			if (!this.$store.state.walletName && uni.getStorageSync('account')) {
				let acc = this.secret.decrypt(uni.getStorageSync('account'));
				this.walletName = acc[this.addr].name
				for (let idx in acc) {
					this.userWallet.push({
						addr: idx,
						name: acc[idx].name
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
			}
			
			//如果vuex存在助记词缓存，则清空助记词
			if (this.$store.state.mnemonic) this.$store.dispatch('saveMnemonic', '')
		},
    mounted(){
            document.querySelector('.u-input').style.borderRadius = '24px';
            document.querySelector('.u-input').style.width = '91.46%';
            document.querySelector('.u-input').style.position = 'absolute';
            document.querySelector('.u-input').style.left = '50%';
            document.querySelector('.u-input').style.transform = 'translate(-50%,0)';
            document.querySelector('.u-input').style.marginTop = '16px';
            document.querySelector('.u-input').style.paddingLeft = '17.5%';
		},
    methods:{
        back() {
				uni.navigateBack()
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

    .addCurrency{
        overflow: hidden;
        .top{
            width: 100%;
            height: 118rpx;
            border-bottom: 1px solid #DDDDE0;
           .back {
				width: 50rpx;
                height: 40rpx;
                position: absolute;
                top: 42rpx;
                left: 32rpx;
            }
            .topTitle{
                font-size: 34rpx;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #1F1F1F;
                position: absolute;
                top: 42rpx;
                left: 50%;
                transform: translate(-50%,0);
            }
        }
        .title{
            color: #1F1F1F;
            font-size: 32rpx;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            position: absolute;
            top: 280rpx;
            left: 32rpx;
        } 
        
		.assetsList {
                // margin: 40rpx;
               position: absolute;
               top: 168px;
            //    left: 16px;
				.table {
                    width: 686rpx;
					border-radius: 10rpx;
                    margin: 0 0 30rpx;
                    .border{
                        width: 644rpx;
                        height: 4rpx;
                        background: #F3F3F7;
                        margin-left: 110rpx;
                    }
					.tableWrapper {
						// width: 750rpx;
						padding: 50rpx 0rpx;
						display: flex;
                        justify-content: space-between;
                        margin-left: 32rpx;
						// background-color: transparent;
						.tableLeft {
                            display: flex;
                            color: #1F1F1F;
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
                            color: #1F1F1F;
						}
					}
				}
		}
		
    }
        
</style>