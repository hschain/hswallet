<template>
	<view class="management cellContainer">
<!-- 		<u-cell-group>
			<u-cell-item title="钱包地址" :label="fliterAddr(addr)" @click="showQrCode()" :arrow="false">
				<u-icon slot="right-icon" color="#aaa" name="qrCode" custom-prefix="project-icon" size="30"></u-icon>
			</u-cell-item>
			<u-cell-item title="钱包名称" :value="account[addr].name" @click="modifyActive"></u-cell-item>
		</u-cell-group> -->
		
		<view class="greenContainer cellMark" @click="showQrCode()">
			<view class="containerWrap circle">
				<view class="boxLeft">
					<view class="leftWrapper">
						<view class="title greenFont">
							钱包地址
						</view>
						<view class="value">{{fliterAddr(addr)}}</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<u-icon color="#aaa" name="qrCode" custom-prefix="project-icon" size="30"></u-icon>
					</view>
				</view>
			</view>
		</view>
		
		<view class="greenContainer cellMark" @click="modifyActive">
			<view class="containerWrap circle">
				<view class="boxLeft">
					<view class="leftWrapper">
						<view class="title greenFont">
							钱包名称
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<view class="rightValue greenFont">
							{{account[addr].name}}
						</view>
						<image class="rightImg" src="../../static/common/greenArrow.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 修改钱包名称弹框 -->
		<u-modal :negative-top="top" v-model="modifyName" title="钱包名称" @confirm="modify" @cancel="()=>modifyName = false" :show-cancel-button="true" :mask-close-able="true">
			<view class="walletName">
				<u-input v-model="value" :placeholder="account[addr].name" :border="true" />
			</view>
		</u-modal>

		<!-- 地址详情弹框 -->
		<u-modal v-model="showAddr" title="钱包地址" :negative-top="top" :mask-close-able="true" :show-confirm-button="false">
			<view class="qrCodeBox">
				<qrCode :imgText="imgText"></qrCode>
			</view>
			<view class="showAddressBox">
				<scroll-view :scroll-x="true" class="showValue" :show-scrollbar="true">
					{{addr}}
				</scroll-view>
				<!-- #ifdef H5-->
				<u-icon name="copy" custom-prefix="project-icon" size="40" v-clipboard:copy="addr" v-clipboard:success="onCopy"></u-icon>
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<u-icon name="copy" custom-prefix="project-icon" size="40" @click="onCopy"></u-icon>
				<!-- #endif -->
			</view>
		</u-modal>
	</view>
</template>

<script>
	import qrCode from '../../components/qrCode.vue'
	import QR from "../../common/js/wxqrcode.js"
	export default {
		name: 'management',
		components: { qrCode },
		data() {
			return {
				addr: '',
				account: {},
				modifyName: false, //修改钱包名称弹框
				value: '', //修改的名称
				showAddr: false, //显示钱包地址全称
				top: 400, //弹框偏移量
				imgText: '',
			}
		},
		onLoad() {
			this.account = this.secret.decrypt(uni.getStorageSync('account'))
			this.addr = Object.keys(this.account)[0]
			
			//提前处理好二维码生成
			let params = {
				address: this.addr
			}
			this.imgText = QR.createQrCodeImg( JSON.stringify(params), {  
				 size: parseInt(200)  
			})
		},
		onBackPress() {
			if (this.showAddr) {
				this.showAddr = false
				return true //return true的意思是禁止返回到上一个界面
			}
		},
		methods: {
			// 裁剪地址
			fliterAddr(value) {
			  return value.slice(0, 12) + " … " + value.slice(-12);
			},
			// 复制地址
			onCopy() {
				//#ifdef H5
				uni.showToast({
					title: '内容已复制'
				})
				//#endif
				//#ifndef H5
				uni.setClipboardData({
					data: this.addr
				})
				//#endif
			},
			// 修改钱包名称
			modify() {
				if (this.$u.trim(this.value)) { //去掉首尾空格
					this.account[this.addr].name = this.value
					uni.setStorageSync('account', this.secret.encrypt(this.account))
					this.modifyName = false
				}
			},
			// 显示修改弹框
			modifyActive() {
				this.modifyName = true
			},
			showQrCode() {
				this.showAddr = true
			}
		}
	}
</script>

<style lang="scss">
	.management{
		.walletName{
			padding: 30rpx 40rpx 50rpx;
		}
		.qrCodeBox{
			display: flex;
			justify-content: center;
			margin: 20rpx 0;
		}
		.showAddressBox {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 30rpx 60rpx;
			color: #000;
			.showValue {
				margin: 10rpx 0;
				width: 450rpx;
				border: 1px solid #9d9d9d;
				border-radius: 5px;
				padding: 10rpx;
			}
		}
	}
</style>
