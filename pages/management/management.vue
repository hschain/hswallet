<template>
	<view class="management cellContainer">
		<!-- <image @click="back" class="back" src="../../static/common/ic_back.png" mode=""></image> -->
		<view class="cellMark" @click="showQrCode()">
			<view class="containerWrap circle border">
				<view class="boxLeft">
					<view class="leftWrapper">
						<view class="title ">
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
		
		<view class="cellMark" @click="modifyActive">
			<view class="containerWrap circle border">
				<view class="boxLeft">
					<view class="leftWrapper">
						<view class="title ">
							钱包名称
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<view class="rightValue ">
							{{account[addr].name}}
						</view>
						<image class="rightImg" src="../../static/svg/arrow_right.svg" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		
		<view class=" cellMark" @click="backup">
			<view class="containerWrap circle">
				<view class="boxLeft">
					<view class="leftWrapper">
						<view class="title">
							备份钱包
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<view class="rightValue" style="color:#1f1f1f">
							{{backupMnemonic ? 'yi' : '未备份'}}
						</view>
						<image class="rightImg" src="../../static/svg/arrow_right.svg" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		
		<view class="quitAccount  " @click="quitDialog = true">
		删除钱包
		</view>
		
		<!-- 修改钱包名称弹框 -->
		<u-modal :negative-top="top" v-model="modifyName" title="钱包名称" @confirm="modify" @cancel="()=>modifyName = false" :show-cancel-button="true" :mask-close-able="true">
			<view class="walletName">
				<u-input v-model="value" :placeholder="account[addr].name" :border="true" />
			</view>
		</u-modal>

		<!-- 地址详情弹框 -->
		<u-modal v-model="showAddr" :title="'扫二维码,转入'+value" :negative-top="top" :mask-close-able="true" confirm-color="#999" confirm-text="复制" @confirm="onCopy" :title-style="{color: '#aaa', fontSize: '28rpx'}">
			<view class="qrCodeBox">
				<qrCode :imgText="imgText"></qrCode>
			</view>
			<view class="showAddressBox">
				<view class="tip">
					钱包地址
				</view>
				<view class="showValue">
					{{addr}}
				</view>
				<!-- #ifdef H5-->
				<u-icon name="copy" custom-prefix="project-icon" size="40" v-clipboard:copy="addr" v-clipboard:success="onCopy"></u-icon>
				<!-- #endif -->
				<!-- #ifndef H5 -->
				<!-- <u-icon name="copy" custom-prefix="project-icon" size="40" @click="onCopy"></u-icon> -->
				<!-- #endif -->
			</view>
		</u-modal>
		
		<!-- 未备份退出提示弹框 -->
		<u-modal :negative-top="top" v-model="quitDialog" content="是否已备份钱包信息，如果您遗失了手机或卸载了本程序，您可以通过助记词恢复资产！" @confirm="quitAccount" @cancel="()=>quitDialog = false" :show-cancel-button="true" :mask-close-able="true"></u-modal>
		
		<!-- 输入密码弹框 -->
		<inputPassword  ref="inputPwNav" @correct="correct"></inputPassword>
	</view>
</template>

<script>
	import qrCode from '../../components/qrCode.vue'
	import QR from "../../common/js/wxqrcode.js"
	import inputPassword from '../../components/inputPassword.vue'
	export default {
		name: 'management',
		components: { qrCode, inputPassword },
		data() {
			return {
				addr:'',
				account: {},
				modifyName: false, //修改钱包名称弹框
				value: this.$store.state.walletName || '', //修改的名称
				showAddr: false, //显示钱包地址全称
				top: 200, //弹框偏移量
				imgText: '', //二维码内容
				backupMnemonic: uni.getStorageSync('backupMnemonic') || false, //是否已备份助记词
				inputPwOption: '', //根据入口，判断输入密码成功后的操作
				quitDialog: false, //未备份退出提示弹框
				walletList:[],
				type:''
			}
		},
		onLoad() {
			this.account = this.secret.decrypt(uni.getStorageSync('account'))
			
			//提前处理好二维码生成
			let params = {
				address: this.addr
			}
			this.imgText = QR.createQrCodeImg( JSON.stringify(params), {  
				 size: parseInt(200)  
			})
			uni.setStorageSync('isAccount', true)//管理界面标识
			
		},
		onShow(){
			this.walletList=this.$store.state.userWallet;
			this.addr=uni.getStorageSync('userAddress');
		},
		onBackPress() {
			if (this.showAddr) {
				this.showAddr = false
				return true //return true的意思是禁止返回到上一个界面
			}
		},
		// mounted(){
		// 	document.querySelector('uni-page-wrapper').style.background = '#F7F7F7';
		// 	document.querySelector('.u-model__footer__button').style.background = '#000';
		// },
		methods: {
			back() {
				uni.navigateBack()
            },
			// 裁剪地址
			fliterAddr(value) {
			  return value.slice(0, 12) + " … " + value.slice(-12);
			},
			// 复制地址
			onCopy() {
				this.showAddr = true
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
					let userWallet = []
					for (let idx in this.account) {
						userWallet.push({
							addr: idx,
							name: this.account[idx].name
						})
					}
					this.$store.commit('SAVE_USER_WALLET', userWallet)
					this.$store.commit('SET_WALLETNAME', this.value)
					uni.setStorageSync('account', this.secret.encrypt(this.account))
					this.modifyName = false
				}
			},
			// 显示修改弹框
			modifyActive() {
				this.modifyName = true
			},
			// 显示二维码
			showQrCode() {
				this.showAddr = true
			},
			// 备份前调用密码校验
			backup() {
				this.inputPwOption = 'backup'
				this.$refs.inputPwNav.showDialog()
			},
			// 验证正确后开启备份
			correct(val) {
				if (val) {
					if (this.inputPwOption === 'backup') {
						this.$store.dispatch('redirectToBackupPage', true)
						this.$store.dispatch('saveMnemonic', this.secret.decrypt(uni.getStorageSync('account'))[this.addr].key)
						uni.navigateTo({
							url: '../safetyTips/safetyTips'
						})
					} else if (this.inputPwOption === 'quit') {
						uni.removeStorageSync('account')
						uni.removeStorageSync('localPw')
						uni.removeStorageSync('userAddress')
						this.$store.dispatch('saveAddrData', {})
						this.$store.commit('SET_WALLETNAME', '')
						this.$store.dispatch('websocketClose', "wss://testnet.hschain.io/api/v1/ws")
						uni.navigateTo({
							url: '../home/home'
						})
					}else if(this.inputPwOption==='dele'){
						var newArr = this.walletList.filter(item => {
							if(this.addr !== item.addr) {
								return true
							}
						})
						this.$store.commit('SAVE_USER_WALLET', newArr)
						let acc = this.secret.decrypt(uni.getStorageSync('account'));
						for(var key in acc){
							if (key==this.addr) {
								delete (acc[key])
							}
						}
						uni.setStorageSync('account', this.secret.encrypt(acc))
						uni.navigateTo({
							url: '../walletList/walletList'
						})
					}
				}
			},
			// 退出账户
			quitAccount() {
				if(uni.getStorageSync('account')){
					this.inputPwOption = 'dele'
				}else{
					this.inputPwOption === 'quit'
				}
				this.$refs.inputPwNav.showDialog()
				
			},
		}
	}
</script>

<style lang="scss">
	.border{
		border-bottom: 1px solid #F3F3F7;
	}
	.management{
		// overflow: hidden;
		width: 100%;
		// background: #F7F7F7;
		position: absolute;
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
			align-items: center;
			flex-direction: column;
			padding: 20rpx 30rpx 40rpx;
			color: #000;
			.tip {
				color: #aaa;
				margin-bottom: 20rpx;
				font-size: 28rpx;
			}
			.showValue {
				width: 100%;
				word-wrap: break-word;
				text-align: center;
				font-family: gilroy-regular;
			}
		}
		.quitAccount {
			width: 686rpx;
			height: 88rpx;
			background: #D04B63;
			border-radius: 22px;
			text-align: center;
			line-height: 88rpx;
			margin-top: 100rpx;
			position: absolute;
			top: 960rpx;
			left: 32rpx;
			float: left;
		}
	}
</style>
