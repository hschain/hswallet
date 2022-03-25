<template>
	<view class="createMnemonic">
		<view class="header">
			<image @click="back" class="back" src="../../static/svg/ic_back.svg" mode=""></image>
		</view>
		
		<!-- 显示助记词 -->
		<view v-show="!confirm">
			<view class="tip">
				<view class="tipWrapper ">
					<text class="headerTip">助记词</text>
					<!-- 助记词作用 -->
					<view class="effect">
						助记词用于恢复钱包及重置钱包密码，请准确无误抄写助记词，并存放在安全的地方
					</view>
					<view class="content">
						<text class="mnemonic" v-for="(item, i) in mnemonic.split(' ')" :key="i+'key'"><text class="count">{{i+1}}</text>{{item}}</text>
					</view>	
				</view>
			</view>
			<view class="bottomSize">
				
				<view>
					
					<!-- 提示 -->
					<view class="tip-wrap">
						<view class="tip-title">提示</view>
						<view class="tip-text">· 请勿将助记词透漏给任何人</view>
						<view class="tip-text">· 助记词一旦丢失，资产将无法恢复</view>
						<view class="tip-text">· 请勿通过截屏、网络传输的方式进行备份保存</view>
						<view class="tip-text">· 遇到任何情况，不要轻易卸载钱包App</view>
					</view>
					
					<u-button class="backup" @click="backup">已确认备份</u-button>
					
					<view class="copy-mnemonic" @click="onCopy">复制助记词</view>
				</view>
			</view>
		</view>

		<!-- 验证助记词 -->
		<view v-show="confirm">
			<view class="confirm">
				<view class="showTip">
					请按顺序点击助记词，以确认您正确备份。
				</view>
				<view class="box">
					<view class="inputBox">
						<u-tag 
							v-for="(item, index) in inputMnemonicArray" 
							:key="index + 'tag1'" 
							:text="item.value" 
							:type="item.error ? 'error' : 'info'" 
							mode="dark" 
							:class="['tag',item.error?'error' : 'info']" 
							:closeable="item.error ? true : false"
							@click="cancelTag(item, index)"
							@close="cancelTag(item, index)"
						/>
					</view>
				</view>
				<view class="randBox">
					<u-tag 
						v-for="(item, index) in randMnemonicArray" 
						:key="index + 'tag2'" 
						@click="chooseTag(item, index)" 
						color="#000" 
						:text="item.value" 
						mode="dark" 
						class="tag minBtncolor" 
						type="info"
						:show="!item.choose"
					/>
				</view>
			</view>
			<view class="bottomSize">
				<view>
					<u-button :class="['next', inputMnemonicArray.length === 12 && allCorrect ? 'opaque' : 'transparent']" @click="inputMnemonicArray.length === 12 && allCorrect ? check() : ''">下一步</u-button>
				</view>
			</view>
		</view>
		
		<u-top-tips ref="uTips" :navbar-height="statusBarHeight"></u-top-tips>
	</view>
</template>

<script>
import hschain from 'hschainjs'
	export default {
		name: 'createMnemonic',
		data() {
			return {
				mnemonic: this.$store.state.mnemonic || require('bip39').generateMnemonic(128),
				confirm: false, //切换界面
				corrMnemonicArray: [], //正确顺序的助记词
				randMnemonicArray: [], //打乱顺序的助记词
				inputMnemonicArray: [], //用户选择的助记词
				allCorrect: false, //选择的助记词顺序正确
				nameIndex:1,
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
				accountList:'',
				walletType:this.$store.state.walletType,
				localPw:uni.getStorageSync('localPw'),
				userWallet:this.$store.state.userWallet,
				addr:''
			}
		},
		onShow(){
			this.accountList=uni.getStorageSync('account')?this.secret.decrypt(uni.getStorageSync('account')):{}
			// this.nameIndex=this.$store.state.walletType=='HST'?uni.getStorageSync('hstnameIndex'):uni.getStorageSync('ethnameIndex')
			if(this.$store.state.walletType=='HST'){
				this.nameIndex = uni.getStorageSync('hstnameIndex');
			}else if(this.$store.state.walletType=='ETH'){
				this.nameIndex = uni.getStorageSync('ethnameIndex');
			}else if(this.$store.state.walletType=='HECO'){
				this.nameIndex = uni.getStorageSync('heconameIndex');
			}else if(this.$store.state.walletType == 'Binance'){
				this.nameIndex = uni.getStorageSync('binancenameIndex');
			}
		},
		onReady(){
			setTimeout(() => {
				this.addr = this.$wallet(this.$store.state.walletType).getAddress(this.$store.state.mnemonic)
			}, 1500);
			// this.nameIndex=this.$store.state.walletType=='HST'?uni.getStorageSync('hstnameIndex'):uni.getStorageSync('ethnameIndex')
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			// 复制
			onCopy() {
				//#ifdef H5
				uni.showToast({
					title: '内容已复制'
				})
				//#endif
				
				//#ifndef H5
				uni.setClipboardData({
					data: this.mnemonic
				})
				//#endif
			},
			//已备份
			backup() {
				this.confirm = true
				this.corrMnemonicArray = this.mnemonic.split(' ')
				this.randMnemonicArray = []
				this.corrMnemonicArray.forEach(item => {
					this.randMnemonicArray.push({value: item, choose: false})
				})
				//打乱顺序
				for (let i = 1; i < this.randMnemonicArray.length; i++) {
				    const random = Math.floor(Math.random() * (i + 1));
				    [this.randMnemonicArray[i], this.randMnemonicArray[random]] = [this.randMnemonicArray[random], this.randMnemonicArray[i]];
				}
				
			},
			// 确认已备份
			check() {
				uni.showLoading({
					title: '',
					mask:true
				});
				
				// console.log(uni.getStorageSync("createWallet"));
				if(uni.getStorageSync("createWallet") == 2){
					uni.showToast({
						title: "助记词备份成功"
					})
					
					setTimeout(()=>{
						uni.redirectTo({
							url: "../management/management"
						})
					},2000)
					return;
				}
				
				//存储数据并跳转路由
				let addr = this.addr
					this.$store.commit('SET_WALLETNAME', this.walletType+`-${this.nameIndex}`)
					uni.setStorageSync('userAddress', addr)		
					let accounts=this.accountList?this.accountList:{}
					let userWallet = this.accountList?this.userWallet:[{addr,name: this.walletType+`-${this.nameIndex}`,type:this.walletType}]
					if (this.accountList) {
							userWallet.push({
								addr: addr,
								name: this.walletType+`-${this.nameIndex}`, 
								type:this.walletType
							})
					}	
					this.$store.commit('SAVE_USER_WALLET', userWallet)
					accounts[addr] = {
						name: this.walletType+`-${this.nameIndex}`, 
						key: this.mnemonic,
						type:this.walletType
					}
					uni.setStorage({
						key: 'account',
						data: this.secret.encrypt(accounts)
					})
					// this.$store.state.walletType=='HST'?uni.setStorageSync('hstnameIndex',this.nameIndex+1):uni.setStorageSync('ethnameIndex',this.nameIndex+1)
					if(this.$store.state.walletType=='HST'){
						uni.setStorageSync('hstnameIndex',this.nameIndex+1)
					}else if(this.$store.state.walletType=='ETH'){
						uni.setStorageSync('ethnameIndex',this.nameIndex+1)
					}else if(this.$store.state.walletType=='HECO'){
						uni.setStorageSync('heconameIndex',this.nameIndex+1)
					}else if(this.$store.state.walletType == 'Binance'){
						uni.setStorageSync('binancenameIndex',this.nameIndex+1)
					}
					
					if (this.localPw) {
						uni.switchTab({
							url: '../main/main'
						})
					} else {
						uni.navigateTo({
							url: `../setPw/setPw`
						})
					}	
				uni.hideLoading();
				
					
			},
			//点击选择标签
			chooseTag(item, index) {
				let error = false
				if (this.corrMnemonicArray[this.inputMnemonicArray.length] !== item.value) {
					error = true
					this.$refs.uTips.show({
						title: '助记词选择顺序有误，请校正',
						type: 'error',
						duration: '2000'
					})
				}
				this.inputMnemonicArray.push({value: item.value, idx: index, error})
			
				this.randMnemonicArray[index].choose = true
				this.allCorrect = true
				this.inputMnemonicArray.forEach((item, index) => {
					if(item.value !== this.corrMnemonicArray[index]) {
						this.allCorrect = false
						item.error = true
					} else {
						item.error = false
					}
				})
			},
			//点击取消标签
			cancelTag(item, index) {
				this.inputMnemonicArray.splice(index, 1)
				this.randMnemonicArray[item.idx].choose = false
				this.allCorrect = true
				this.inputMnemonicArray.forEach((item, index) => {
					if(item.value !== this.corrMnemonicArray[index]) {
						this.allCorrect = false
						item.error = true
					} else {
						item.error = false
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.transparent{
		opacity: 0.6;
	}
	.opaque{
		opacity: 1;
	}
	.error{
		background-color: #D04B63;
	}
	.info{
		background-color: #CACBCC;
	}
	.minBtncolor{
		background-color: #fff;
		border-radius: 4px;
		border: 1px solid #DDDDE0;
	}
	.createMnemonic {
		height: 100vh;
		.loading{
			width: 160px;
			height: 160px;
			background: rgba($color: #000000, $alpha: 0.3);
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			.load{
				position: absolute;
				top: 30px;
				left: 30px;
				
			}
		}
		.header {
			padding: 100rpx 40rpx 0;
			.back {
				width: 50rpx;
				height: 40rpx;
			}
		}
		.tip {
			// display: flex;
			height: 60vh;
			font-size: 30rpx;
			display: flex;
			flex-direction: column;
			margin: 40rpx auto;
			.tipWrapper {
				padding:0 40rpx;
				margin: 0;
				.headerTip {
					font-size: 68rpx;
					color: #1F1F1F;
				}
				.effect{
					color: #333;
					
					margin-top: 20rpx;
				}
				
				.content {
					width: 686rpx;
					height: 512rpx;
					margin-top: 60rpx;
					display: grid;
					grid-template-columns: repeat(2, 1fr);
					// grid-template-columns: 1fr 1fr 1fr;
					// grid-gap: 30rpx 0;
					font-size: 32rpx;
					background: #FAFBFC;
					color: #1F1F1F;
					border-radius: 8px;
					border: 1px solid #DDDDE0;
					// padding: 38rpx 0 36rpx 32px;
					padding: 36rpx 0;
					.mnemonic {
						width: 344rpx;
						height: 80rpx;
						.count{
							font-size: 32rpx;
							font-family: gilroy-bold;
							font-weight: 400;
							color: #909195;
							padding: 0 34rpx;
						}
					}
				}
				.sure {
					margin: 50rpx 30rpx;
				}
			}
		}
		.confirm {
			.showTip {
				margin: 30rpx 5vw 40rpx;
				text-align: center;
				color: #1F1F1F;
				font-size: 32rpx;
			}
			.box{
				width: 686rpx;
				min-height: 256rpx;
				background: #FAFBFC;
				border: 1px solid #DDDDE0;
				position: relative;
				left: 50%;
				transform: translate(-50%,0);
				.inputBox {
					padding: 20rpx;
					min-height: 256rpx;
					font-family: gilroy-regular;
				}
			}
			
			.randBox {
				margin: 20rpx 5vw;
				font-family: gilroy-regular;
			}
			.tag {
				margin: 15rpx;
				font-size: 26rpx;
				
			}
		}
		.bottomSize {
			position: absolute;
			bottom: 20rpx;
			// left: calc(50vw - 150rpx);
			top:460px;
			left: 50%;
			transform: translate(-50%,0);
			
			.tip-wrap{
				color: #e61414;
				margin-top: 60rpx;
				
				.tip-title{
					font-size: 34rpx;
					margin-bottom: 10rpx;
				}
				.tip-text{
					line-height: 48rpx;
				}
			}
			
			.copy {
				width: 686rpx;
				height: 96rpx;
				margin: 80rpx auto 40rpx;
				color: #000;
				border: 2rpx solid #1f1f1f;
			}
			.backup {
				width: 686rpx;
				height: 96rpx;
				margin: 60rpx auto 20rpx;
				color: #fff;
				background: url('../../static/common/button_gold.png') no-repeat;
				background-size: 100% 100%;
			}
			.copy-mnemonic{
				text-align: center;
				color: #333;
				margin-bottom: 20rpx;
			}
			.disableBtn {
				color: #fff;
			}
			.next{
				width: 686rpx;
				height: 96rpx;
				margin: 0 auto 40rpx;
				color: #fff;
				background: url('../../static/common/button_gold.png') no-repeat;
				background-size: 100% 100%;
			}
		}
	}
</style>
