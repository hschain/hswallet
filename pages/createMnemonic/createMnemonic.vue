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
					<view class="content">
						<text class="mnemonic" v-for="(item, i) in mnemonic.split(' ')" :key="i+'key'"><text class="count">{{i+1}}</text>{{item}}</text>
					</view>
				</view>
			</view>
			<view class="bottomSize">
				<!-- <u-button class="copy" @click="onCopy">复制</u-button> -->
				<view>
					<!-- #ifdef H5-->
					
					<!-- #endif -->
					<!-- #ifndef H5 -->
					<!-- <u-button class="copy" @click="onCopy">复制</u-button> -->
					<!-- #endif -->
					<u-button class="backup" @click="backup">已确认备份</u-button>				
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
					<view :class="['next', inputMnemonicArray.length === 12 && allCorrect ? 'opaque' : 'transparent']" @click="inputMnemonicArray.length === 12 && allCorrect ? check() : ''">下一步</view>
				</view>
			</view>
		</view>
		
		<u-top-tips ref="uTips" :navbar-height="statusBarHeight"></u-top-tips>
	</view>
</template>

<script>
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
				nameIndex:0,
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight
			}
		},
		onShow(){
			this.nameIndex=this.$store.state.walletType=='HST'?uni.getStorageSync('hstnameIndex'):uni.getStorageSync('ethnameIndex')
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
				//存储数据并跳转路由
				let address = this.$wallet(this.$store.state.walletType).getAddress(this.$store.state.mnemonic)
				if(!uni.getStorageSync('account')){
					let addr = this.$wallet(this.$store.state.walletType).getAddress(this.$store.state.mnemonic)					
					let accounts = {}
					this.$store.commit('SET_WALLETNAME', this.$store.state.walletType)
					uni.setStorageSync('userAddress', addr)
					let userWallet = [{
						addr,
						name: this.$store.state.walletType+`-${this.nameIndex}`,
						type:this.$store.state.walletType
					}]
					this.$store.commit('SAVE_USER_WALLET', userWallet)
					accounts[addr] = {
						name: this.$store.state.walletType+`-${this.nameIndex}`, 
						key: this.$store.state.mnemonic,
						type:this.$store.state.walletType
					}
					uni.setStorage({
						key: 'account',
						data: this.secret.encrypt(accounts)
					})
					uni.navigateTo({
								url: '../setPw/setPw'
					})
				}else if (uni.getStorageSync('account')&&!this.$store.state.toBackupPage&&!uni.getStorageSync('isAccount')) { 
						let addr = this.$wallet(this.$store.state.walletType).getAddress(this.$store.state.mnemonic)					
						
						let account = this.secret.decrypt(uni.getStorageSync('account'))
						account[addr] = {
							name: this.$store.state.walletType+`-${this.nameIndex}`, 
							key: this.mnemonic,
							type:this.$store.state.walletType
						}
						let userWallet = []
						for (let idx in account) {
							userWallet.push({
								addr: idx,
								name: account[idx].name,
								type: account[idx].type
							})
						}
						this.$store.commit('SAVE_USER_WALLET', userWallet)
						this.$store.commit('SET_WALLETNAME', this.$store.state.walletType)
						uni.setStorageSync('userAddress', addr)
						uni.setStorage({
							key: 'account',
							data: this.secret.encrypt(account)
						})
						if (uni.getStorageSync('localPw')) {
							uni.switchTab({
								url: '../main/main'
							})
						} else {
							uni.navigateTo({
								url: `../setPw/setPw`
							})
						}
					}
				if (!uni.getStorageSync(address+'backupMnemonic')) {
					//未备份信息时开始备份
					let account = this.secret.decrypt(uni.getStorageSync('account'))
					uni.setStorageSync(address+'backupMnemonic', true)
					if (uni.getStorageSync('mnemonicData')) { //判断是否已存在其他地址信息
						let data = this.secret.decrypt(uni.getStorageSync('mnemonicData'))
						data.push(account)
						uni.setStorage({
							key: 'mnemonicData',
							data: this.secret.encrypt(data)
						})
					} else {
						uni.setStorage({
							key: 'mnemonicData',
							data: this.secret.encrypt([account])
						})
					}
				}
				
				if (this.$store.state.toBackupPage && uni.getStorageSync('account')) { //通过备份助记词跳转过来的，执行此语句
					
					this.$store.dispatch('redirectToBackupPage', false)
					uni.switchTab({
						url: '../main/main'
					})
				} else if (uni.getStorageSync('isAccount') && uni.getStorageSync('account')) { //如果已存在账户，则代表入口来自管理页面
						
						let addr = this.$wallet(this.$store.state.walletType).getAddress(this.$store.state.mnemonic)					
						
						let account = this.secret.decrypt(uni.getStorageSync('account'))
						account[addr] = {
							name: this.$store.state.walletType+`-${this.nameIndex}`, 
							key: this.mnemonic,
							type:this.$store.state.walletType
						}
						let userWallet = []
						for (let idx in account) {
							userWallet.push({
								addr: idx,
								name: account[idx].name,
								type: account[idx].type
							})
						}
						this.$store.commit('SAVE_USER_WALLET', userWallet)
						this.$store.commit('SET_WALLETNAME', this.$store.state.walletType)
						uni.setStorageSync('userAddress', addr)
						uni.setStorage({
							key: 'account',
							data: this.secret.encrypt(account)
						})
						if (uni.getStorageSync('localPw')) {
							this.$store.state.walletType=='HST'?uni.setStorageSync('hstnameIndex',this.nameIndex+1):uni.setStorageSync('ethnameIndex',this.nameIndex+1)
								uni.switchTab({
									url: '../main/main'
								})
						} else {
								uni.navigateTo({
									url: `../setPw/setPw`
								})
						}
					} else{
							
						}	
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
		}
	}
</script>

<style lang="scss" scoped>
	.transparent{
		opacity: 0.4;
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
		.header {
			padding: 100rpx 40rpx 0;
			.back {
				width: 50rpx;
				height: 40rpx;
			}
		}
		.tip {
			display: flex;
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
				margin: 0 auto 40rpx;
				color: #fff;
				background: url('../../static/common/button_gold.png') no-repeat;
				background-size: 100% 100%;
			}
			.disableBtn {
				color: #fff;
			}
			.next{
				width: 686rpx;
				height: 96rpx;
				background: url('../../static/common/button_gold.png') no-repeat;
				background-size: 100% 100%;
				text-align: center;
				line-height: 96rpx;
			}
		}
	}
</style>
