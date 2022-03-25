<template>
	<view class="chooseType">
		<view class="header">
			<image @click="back" class="back" src="../../static/svg/ic_back.svg" mode=""></image>
            <text class="title">选择钱包类型</text>
		</view>
        <view class="topBoder"></view>
        <view class="typeList">
            <view class="hst" @click="onSelect('HST')">
                <image  class="hstLogo" src="../../static/common/chain_hst.png" mode=""></image>
                <view class="walletTitle">
                    <view class="HSTwallet">HST</view>
                    <view class="small">HSchain</view>
                </view>
                <image  class="arrowRight" src="../../static/svg/arrow_right.svg" mode=""></image>
                <view class="shortBoder"></view>
            </view>
            <view class="eth" @click="onSelect('ETH')" v-if="false">
                <image  class="hstLogo" src="../../static/common/chain_eth.png" mode=""></image>
                <view class="walletTitle">
                    <view class="HSTwallet">ETH</view>
                    <view class="small">Ethereum</view>
                </view>
                <image  class="arrowRight" src="../../static/svg/arrow_right.svg" mode=""></image>
                <view class="shortBoder"></view>
            </view>
			<!-- heco -->
			<view class="eth" @click="onSelect('HECO')">
			    <image  class="hstLogo" src="../../static/common/heco.png" mode=""></image>
			    <view class="walletTitle">
			        <view class="HSTwallet">HECO</view>
			        <view class="small">HECOchain</view>
			    </view>
			    <image  class="arrowRight" src="../../static/svg/arrow_right.svg" mode=""></image>
			    <view class="shortBoder"></view>
			</view>
			<!-- Binance -->
			<view class="eth" @click="onSelect('Binance')">
			    <image  class="hstLogo" src="../../static/common/bnb.svg" mode=""></image>
			    <view class="walletTitle">
			        <view class="HSTwallet">Binance</view>
			        <view class="small">Binancechain</view>
			    </view>
			    <image  class="arrowRight" src="../../static/svg/arrow_right.svg" mode=""></image>
			    <view class="shortBoder"></view>
			</view>
        </view>
	</view>
</template>

<script>
	export default {
		name: 'chooseType',
		data() {
			return {
                type:''
			}
        },
        onLoad(data) { //option为object类型，会序列化上个页面传递的参数
			this.type=data.type;
        },
		methods: {
			back() {
				uni.navigateBack()
            },
			onSelect(type) {
				this.$store.dispatch('saveWalletType', type)
				
                if(this.type == 'create') {
                    uni.navigateTo({
					    url: '../safetyTips/safetyTips'
				    })
                }
				
				if(this.type == 'import') {
                    uni.navigateTo({
					    url: '../importMnemonic/importMnemonic'
				    })
                }				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.chooseType {
        overflow: hidden;
        color: #000;
        margin-top: 32rpx;
		.header {
            margin: 60rpx 40rpx 0;
            // position: absolute;
            // top: 100rpx;
            // left: 40rpx;
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
        .topBoder{
                width: 100%;
                height: 1px;
                box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.16);
                margin-top: 20rpx;
            }
            .typeList{
                font-family: gilroy-regular;
                .hst{
                    width: 100%;
                    height: 128rpx;
                    padding: 32rpx;
                    position: relative;
                    box-sizing: border-box;
                    .hstLogo{
                        width: 64rpx;
                        height: 64rpx;
                    }
                    .walletTitle{
                        position: absolute;
                        left: 128rpx;
                        top: 32rpx;
                        .HSTwallet{
                            font-size: 32rpx;
                            font-family: Gilroy-Regular, Gilroy;
                            font-weight: 400;
                            color: #1F1F1F;
                        }
                        .small{
                            font-size: 24rpx;
                            font-family: Gilroy-Regular, Gilroy;
                            font-weight: 400;
                            color: #909195;
                            margin-top: 10rpx;
                        }
                        
                    }
                    .arrowRight{
                            width: 16px;
                            height: 16px;
                            position: absolute;
                            top: 48rpx;
                            right: 32rpx;
                        }
                    .shortBoder{
                        width: 620rpx;
                        height: 1px;
                        background: #F3F3F7;
                        position: absolute;
                        bottom: 0;
                        right: 0;
                    }
                }
                .eth{
                    width: 100%;
                    height: 128rpx;
                    padding: 32rpx;
                    position: relative;
                    box-sizing: border-box;
                    .hstLogo{
                        width: 64rpx;
                        height: 64rpx;
                    }
                    .walletTitle{
                        position: absolute;
                        left: 128rpx;
                        top: 32rpx;
                        .HSTwallet{
                            font-size: 32rpx;
                            font-family: Gilroy-Regular, Gilroy;
                            font-weight: 400;
                            color: #1F1F1F;
                        }
                        .small{
                            font-size: 24rpx;
                            font-family: Gilroy-Regular, Gilroy;
                            font-weight: 400;
                            color: #909195;
                            margin-top: 10rpx;
                        }
                        
                    }
                    .arrowRight{
                            width: 32rpx;
                            height: 32rpx;
                            position: absolute;
                            top: 48rpx;
                            right: 32rpx;
                        }
                    .shortBoder{
                        width: 620rpx;
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
