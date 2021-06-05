<template>
	<view class="privateKey">
		<view class="header">
			<image @click="back" class="back" src="../../static/svg/ic_back.svg" mode=""></image>
		</view>
        <view class="title">私钥</view>
        <view class="content">{{privateKey}}</view>
		<view class="bottomSize">
			<u-button class="immediately" @click="onCopy">复制私钥</u-button>
			
		</view>
	</view>
</template>

<script>
import hschain from 'hschainjs'
import { ethers } from "@/common/js/ethers.js"
export default {
    name: 'privateKey',
    data() {
			return {
                privateKey:'',
                Type:{},
			}
        },
    onShow(){
            let acc = this.secret.decrypt(uni.getStorageSync('account'));
            this.Type=acc[uni.getStorageSync('userAddress')];
            if (this.Type.privateKey) {
                this.privateKey=this.Type.privateKey
            }else if (this.Type.key){
                if (this.Type.type=='HST') {
                    this.privateKey=hschain.network('https://scan.hschain.io', 'hschain').getECPairPriv(this.Type.key).toString("hex")
                }else if (this.Type.type=='ETH') {
                    let wallet = ethers.Wallet.fromMnemonic(this.Type.key)
                    this.privateKey=wallet.privateKey
                }else if (this.Type.type=='HECO') {
                    let wallet = ethers.Wallet.fromMnemonic(this.Type.key)
                    this.privateKey=wallet.privateKey
                }else{
					let wallet = ethers.Wallet.fromMnemonic(this.Type.key)
					this.privateKey=wallet.privateKey
				}
            }
    },   
    methods:{
        back() {
				uni.navigateBack()
			},
        onCopy() {
				//#ifdef H5
				uni.showToast({
					title: '内容已复制'
				})
				//#endif
				//#ifndef H5
				uni.setClipboardData({
					data: this.privateKey
				})
				//#endif
			},
    },
}
</script>

<style lang="scss" scoped>
	.privateKey {
		overflow: hidden;
		.header {
			margin: 100rpx 40rpx 40rpx;
			.back {
				width: 50rpx;
				height: 40rpx;
			}
		}
        .title{
            margin-top: 20px;
            margin-left: 40rpx;
            font-size: 34px;
            color: #1F1F1F;
        }
        .content{
            width: 686rpx;
            min-height: 140rpx;
            background: #FAFBFC;
            font-size: 16px;
            font-family: gilroy-bold;
            color: #1F1F1F;
            border-radius: 8px;
            border: 1px solid #DDDDE0;
            padding: 16px;
            margin-top: 68px;
            position: absolute;
            left: 50%;
            transform: translate(-50%,0);
            word-break: break-all;
        }
		.bottomSize {
			.immediately {
				width: 686rpx;
				height: 96rpx;
				margin: 0 auto 20px;
				color: #fff;
				background: url('../../static/common/button_gold.png') no-repeat;
				background-size: 100% 100%;
				// box-shadow:inset 0px 4px 16px 0px rgba(212, 180, 131, 0.4), 0px 0px 3px 0px #F7DDB5;
				position: absolute;
				top: 800rpx;
				left: 50%;
				transform: translate(-50%,0);
			}
		}
	}
</style>