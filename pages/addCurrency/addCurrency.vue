<template>
    <view class="addCurrency">
        <view class="top">
            <image @click="back" class="back" src="../../static/svg/ic_back.svg" mode=""></image>
            <view class="topTitle">添加币种</view>
        </view>
        <view class="inputs">
            <image class="search" src="../../static/svg/ico_search.svg" ></image>
            <u-input v-model="keyword"
                 type="text" 
                 placeholder="请输入Token名称或合约地址" 
                 :height="96" 
                 :custom-style="{borderRadius:'24px',paddingLeft:'36px'}" 
                 @input="onSearch" :focus="true"/>
                 
        </view>
        
        <view v-if="!keyword">
            <view class="title">首页资产</view>
            <view class="assetsList">
                        <view  v-for="(item,index) in walletType=='HST' ? assetsList : ETHassetsList" :key="walletType=='HST' ? item.denom : item.value" class="table ">
                            <view class="tableWrapper">
                                <view class="tableLeft">
                                    <image class="icon" v-if="walletType=='HST'" src="../../static/common/logo.png" mode=""></image>
								    <image class="icon" v-else-if="walletType === 'ETH'" :src="item.logo" mode=""></image>
								    <image class="icon" v-else src="../../static/common/symbol_none.svg" mode=""></image>
                                    <text class="denom">{{walletType=='HST'?item.denom:item.label}}</text>
                                    <view class="addre">{{item.value | hash}}</view>
                                </view>
                            </view>
                            <image class="assetsEdit"  src="../../static/svg/ic_remove.svg" mode="" @click="removeAssets(index)"></image>
                            <view class="border"></view>
                        </view>
            </view>
        </view> 

        <view v-if="keyword">
                <view class="assetsList tokenList">
                    <view v-if="!tokenList" class="isEmpty">
                        <u-empty text="暂无数据" mode="search" src="../../static/common/img_blank.png"></u-empty>
                    </view>
                    <view v-for="(item,index) in tokenList" :key="item.value" class="table">
                        <view class="tableWrapper">
                            <view class="tableLeft">
                                <image class="icon" :src="item.logo" mode="widthFix" lazy-load></image>
                                    <text class="denom">{{item.label}}</text>
                                    <text class="addre">{{ item.value | hash}}</text>
                            </view>
                        </view>
                        <image class="assetsEdit" src="../../static/svg/ic_add.svg" mode="" @click="addAssets(index)"></image>
                        <view class="border"></view>
                    </view>
                </view>
		</view>
    </view>
</template>
<script>
import util from '@/common/js/util.js'

export default {
    name:'addCurrency',
    data(){
        return {
            walletName: '', //钱包名称
            walletType:'',
            value: '',
            addr: '', 
            keyword: '',
            assetsList:[{
                value:0,
            }],
            userWallet: [],
            tokenList: [],
            isEmpty: false,
            ETHassetsList:[],
        }
    },
    onShow() {
            this.walletType=this.$store.state.walletType;
            this.addr = uni.getStorageSync('userAddress')
            this.ETHassetsList = util.getAssets(this.addr);
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
    filters: {
			hash: function (value) {
			  return value.slice(0, 12) + " … " + value.slice(-12);
			},
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
        onSearch(event) {
				this.tokenList = []
				this.isEmtpy = false

				if (!this.keyword) {
					return
				}

				let preKeyword = this.keyword
				this.lastTimestamp = event.timeStamp

				var _that = this
				setTimeout(function() {
					if (preKeyword != _that.keyword) {
						return
					}
					uni.showLoading()
					uni.request({
						url: 'https://cn.etherscan.com/searchHandler',
						data: {
							term: _that.keyword,
							filterby: 2,
						},
						success: (res) => {
							uni.hideLoading()
							let tokens = res.data
							tokens.map(async (item) => {
								if (item.split('\t')[1]) {
                                    let decimal = await _that.$wallet("ETH").getDecimal(item.split('\t')[1])
									_that.tokenList.push({
										label: item.split('\t')[0],
										value: item.split('\t')[1],
										desc: item.split('\t')[2],
										typeval: item.split('\t')[3],
										checkMark: item.split('\t')[4],
                                        logo: "https://cn.etherscan.com/token/images/" + item.split('\t')[5],
                                        decimal: decimal
									})
								}
							})
							_that.isEmpty = !_that.tokenList.length
						}
					})
				}, 1000)
            },
            addAssets(index){
                console.log(this.tokenList[0].desc.split('$')[1]);
				util.setAsset(this.addr, this.tokenList[index]);
                uni.showToast({
					title: '添加成功'
				})
            },
            removeAssets(index){
				util.removeAsset(this.addr, this.ETHassetsList[index])
				this.ETHassetsList.splice(index, 1);				
                uni.showToast({
					title: '删除成功'
				})
            },
    }
}
</script>
<style>
   
</style>
<style lang="scss" scoped>
$hei: 100vh;
    .addCurrency{
        overflow: hidden;
        margin-top: 44rpx;
        position: relative;
        // padding-top: 44rpx;
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
        .inputs{
            border-radius: 24px;
            width: 686rpx;
            position: relative;
            left: 50%;
            transform:translate(-50%,0);
            border:1px solid #DDDDE0;
            margin-top: 32rpx;
            padding-right: 20rpx;
            .search{
                width: 44rpx;
                height: 44rpx;
                position: absolute;
                top: 24rpx;
                left: 20rpx;
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
            z-index: 11;
        } 
        
		.assetsList {
            &.tokenList {
				top: 128px;
				width: 100%;
				.isEmpty {
					display: flex;
					justify-content: center;
					align-items: center;
					height: calc(#{$hei} - 680rpx);
					border: 2px solid #fff;
				}
			}
            z-index: 22;
            // margin: 100rpx;
            margin-top: 100rpx;
				.table {
                    width: 100%;
                    height: 128rpx;
					border-radius: 10rpx;
                    // margin: 0 0 30rpx;
                    position: relative;
                    .border{
                        width: 644rpx;
                        height: 3rpx;
                        background: #F3F3F7;
                        position: absolute;
                        top: 124rpx;
                        right: 0;
                    }
					.tableWrapper {
                        // width: 750rpx;
                        height: 120rpx;
						padding: 20rpx 32rpx;
						display: flex;
                        justify-content: space-between;
                        position: absolute;
                        left: 0px;
                        // margin-left: 32rpx;
						// background-color: transparent;
						.tableLeft {
                            display: flex;
                            color: #1F1F1F;
                            width: 600rpx;
                            font-family: gilroy-regular;
							.icon {
								width: 64rpx;
								height: 64rpx;
                                border-radius: 50px;
                                margin-top: 6px;
								margin-right: 30rpx;
							}
							.denom {
								font-size: 32rpx;
								line-height: 60rpx;
                            }
                            .address {
                                font-size: 24rpx;
                                color: #909195;
						    }
                            .addre{
                                font-size: 12px;
                                font-family: Gilroy-Regular, Gilroy;
                                font-weight: 400;
                                color: #909195;
                                position: absolute;
                                top: 64rpx;
                                left: 124rpx;
                            }
						}
                       
						.tableRight {
							display: flex;
							flex-direction: column;
                            align-items: flex-end;
                            color: #1F1F1F;
						}
					}
                    .assetsEdit{
                            width: 44rpx;
                            height: 44rpx;
                            position: absolute;
                            right: 34rpx;
                            top: 50%;
                            transform: translate(0,-50%);
                    }
				}
		}
		
    }
        
</style>

