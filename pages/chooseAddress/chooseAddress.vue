<template>
	<view class="chooseAddress">
		<view class="header">
			<image @click="back" class="back" src="../../static/common/ic_back.png" mode=""></image>
            <text class="title">选择地址类型</text>
		</view>
        <view class="topBoder"></view>
        <view class="typeList">
            <view class="hst" @click="onSelect()">
                <image  class="hstLogo" src="../../static/common/chain_hst.png" mode=""></image>
                <view class="walletTitle">
                    <view class="HSTwallet">HST</view>
                    <view class="small">HSchain</view>
                </view>
                <image  class="arrowRight" src="../../static/common/arrow_right.png" mode=""></image>
                <view class="shortBoder"></view>
            </view>
            <view class="eth" @click="onSelect()">
                <image  class="hstLogo" src="../../static/common/chain_eth.png" mode=""></image>
                <view class="walletTitle">
                    <view class="HSTwallet">ETH</view>
                    <view class="small">Ethereum</view>
                </view>
                <image  class="arrowRight" src="../../static/common/arrow_right.png" mode=""></image>
                <view class="shortBoder"></view>
            </view>
        </view>
	</view>
</template>

<script>
	export default {
		name: 'chooseAddress',
		data() {
			return {
                type:''
			}
        },
        // onLoad(data) { //option为object类型，会序列化上个页面传递的参数
		// 	this.type=data.type;
        // },
		methods: {
			back() {
				uni.navigateBack()
            },
			onSelect() {
				// this.$store.dispatch('saveWalletType', type)
                    uni.navigateTo({
					    url: '../transfer/newAddress'
				    })				
			}
		}
	}
</script>
<style lang="scss" scoped>
	.chooseAddress {
        overflow: hidden;
        color: #000;
        margin-top: 20rpx;
		.header {
            margin: 60rpx 40rpx 0;
            // position: absolute;
            // top: 100rpx;
            // left: 40rpx;
			.back {
				width: 20px;
				height: 16px;
            } 
            .title{
                font-size: 17px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #1F1F1F;
                position: absolute;
                left: 50%;
                transform: translate(-50%,0);
            }
        }
        .topBoder{
                width: 100%;
                height: 1px;
                box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.16);
                margin-top: 10px;
            }
            .typeList{
                .hst{
                    width: 100%;
                    height: 64px;
                    padding: 16px;
                    position: relative;
                    box-sizing: border-box;
                    .hstLogo{
                        width: 32px;
                        height: 32px;
                    }
                    .walletTitle{
                        position: absolute;
                        left: 64px;
                        top: 16px;
                        .HSTwallet{
                            font-size: 16px;
                            font-family: Gilroy-Regular, Gilroy;
                            font-weight: 400;
                            color: #1F1F1F;
                        }
                        .small{
                            font-size: 12px;
                            font-family: Gilroy-Regular, Gilroy;
                            font-weight: 400;
                            color: #909195;
                            margin-top: -5px;
                        }
                        
                    }
                    .arrowRight{
                            width: 16px;
                            height: 16px;
                            position: absolute;
                            top: 24px;
                            right: 16px;
                        }
                    .shortBoder{
                        width: 80%;
                        height: 1px;
                        background: #F3F3F7;
                        position: absolute;
                        bottom: 0;
                        right: 0;
                    }
                }
                .eth{
                    width: 100%;
                    height: 64px;
                    padding: 16px;
                    position: relative;
                    box-sizing: border-box;
                    .hstLogo{
                        width: 32px;
                        height: 32px;
                    }
                    .walletTitle{
                        position: absolute;
                        left: 64px;
                        top: 16px;
                        .HSTwallet{
                            font-size: 16px;
                            font-family: Gilroy-Regular, Gilroy;
                            font-weight: 400;
                            color: #1F1F1F;
                        }
                        .small{
                            font-size: 12px;
                            font-family: Gilroy-Regular, Gilroy;
                            font-weight: 400;
                            color: #909195;
                            margin-top: -5px;
                        }
                        
                    }
                    .arrowRight{
                            width: 16px;
                            height: 16px;
                            position: absolute;
                            top: 24px;
                            right: 16px;
                        }
                    .shortBoder{
                        width: 80%;
                        height: 1px;
                        background: #F3F3F7;
                        position: absolute;
                        bottom: 0;
                        right: 0;
                    }
                }
            }
	}
</style>
