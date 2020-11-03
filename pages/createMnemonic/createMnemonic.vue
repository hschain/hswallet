<template>
	<view class="createMnemonic">
		<view class="header">
			<image @click="back" class="back" src="../../static/common/back.png" mode=""></image>
		</view>
		
		<!-- 显示助记词 -->
		<view v-show="!confirm">
			<view class="tip greenContainer">
				<view class="tipWrapper containerWrap">
					<text class="headerTip">助记词</text>
					<view class="content">
						<text class="mnemonic" v-for="(item, i) in mnemonic.split(' ')" :key="i+'key'">{{item}}</text>
					</view>
				</view>
			</view>
			<view class="bottomSize">
				<view>
					<!-- #ifdef H5-->
					<u-button
						class="btn yellowBtn" 
						v-clipboard:copy="mnemonic"
						v-clipboard:success="onCopy"
					>复制</u-button>
					<!-- #endif -->
					<!-- #ifndef H5 -->
					<u-button class="btn yellowBtn" @click="onCopy">复制</u-button>
					<!-- #endif -->
					<u-button class="btn greenBtn" @click="backup">已确认备份</u-button>				
				</view>
			</view>
		</view>

		<!-- 验证助记词 -->
		<view v-show="confirm">
			<view class="confirm">
				<view class="showTip">
					请按顺序点击助记词，以确认您正确备份。
				</view>
				<view class="purpleContainer">
					<view class="containerWrap inputBox">
						<u-tag 
							v-for="(item, index) in inputMnemonicArray" 
							:key="index + 'tag1'" 
							:text="item.value" 
							:type="item.error ? 'error' : 'info'" 
							mode="dark" 
							class="tag" 
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
						class="tag purpleBtn" 
						type="info"
						:show="!item.choose"
					/>
				</view>
			</view>
			<view class="bottomSize">
				<view>
					<view :class="['btn', inputMnemonicArray.length === 24 && allCorrect ? 'purpleBtn' : 'greyBtn disableBtn']" @click="inputMnemonicArray.length === 24 && allCorrect ? check() : ''">下一步</view>
				</view>
			</view>
		</view>
		
		<u-top-tips ref="uTips" navbar-height="0"></u-top-tips>
	</view>
</template>

<script>
	export default {
		name: 'createMnemonic',
		data() {
			return {
				mnemonic: this.$store.state.mnemonic || require('bip39').generateMnemonic(256),
				confirm: false, //切换界面
				corrMnemonicArray: [], //正确顺序的助记词
				randMnemonicArray: [], //打乱顺序的助记词
				inputMnemonicArray: [], //用户选择的助记词
				allCorrect: false, //选择的助记词顺序正确
			}
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
				if (!uni.getStorageSync('backupMnemonic')) {
					//未备份信息时开始备份
					let account = this.secret.decrypt(uni.getStorageSync('account'))
					uni.setStorageSync('backupMnemonic', true)
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

				if (this.$store.state.toBackupPage) { //通过备份助记词跳转过来的，执行此语句
					this.$store.dispatch('redirectToBackupPage', false)
					uni.switchTab({
						url: '../main/main'
					})
				} else {
					if (uni.getStorageSync('account')) { //如果已存在账户，则代表入口来自管理页面
						let addr = this.$chain('https://testnet.hschain.io/', 'hst01').getAddress(this.mnemonic)
						let account = this.secret.decrypt(uni.getStorageSync('account'))
						account[addr] = {
							name: 'HST', 
							key: this.mnemonic,
						}
						let userWallet = []
						for (let idx in account) {
							userWallet.push({
								addr: idx,
								name: account[idx].name
							})
						}
						this.$store.commit('SAVE_USER_WALLET', userWallet)
						this.$store.commit('SET_WALLETNAME', 'HST')
						uni.setStorageSync('userAddress', addr)
						uni.setStorage({
							key: 'account',
							data: this.secret.encrypt(account)
						})
						uni.switchTab({
							url: '../main/main'
						})
					} else {
						uni.navigateTo({
							url: '../setPw/setPw'
						})
					}
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
	.createMnemonic {
		color: #fff;
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
				padding: 10vw;
				margin: 0;
				.headerTip {
					font-size: 60rpx;
				}
				.content {
					margin-top: 60rpx;
					display: grid;
					grid-template-columns: 1fr 1fr 1fr;
					grid-gap: 30rpx 0;
					font-size: 26rpx;
					.mnemonic {
						width: 20vw;
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
			}
			.inputBox {
				padding: 20rpx;
				min-height: 400rpx;
			}
			.randBox {
				margin: 20rpx 5vw;
			}
			.tag {
				margin: 15rpx;
				font-size: 26rpx;
			}
		}
		.bottomSize {
			position: absolute;
			bottom: 20rpx;
			left: calc(50vw - 150rpx);
			.btn {
				width: 300rpx;
				margin: 0 auto 40rpx;
				color: #000;
			}
			.disableBtn {
				color: #fff;
			}
		}
	}
</style>
