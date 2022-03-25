<template>
	<view class="bridge">
		<view class="bridge-top">
			<view class="title-wrap">
				<u-icon class="arrow-left" name="arrow-leftward" size="36" @click="goBack()"></u-icon>
				<view class="page-title">桥接</view>
			</view>
			<!-- 资产 -->
			<view class="assets-wrap">
				<view class="assets-title">资产</view>
				<view class="select-wrap" @click="assetsToggle">
					<view class="select-wrap-left">
						<image class="select-icon" :src="selectedIcon" mode="widthFix"></image>
						<view class="select-text">{{selectedText}}</view>
					</view>
					<view class="select-right">
						<u-icon name="arrow-down-fill" color="#999" size="28"></u-icon>
					</view>
				</view>
				<!-- 从...到... -->
				<view class="transfer">
					<view class="transfer-item">
						<view class="transfer-text">从</view>
						<image class="transfer-img-hsc" :src="fromImg"></image>
						<view class="transfer-text transfer-text-text">{{fromChain}}</view>
					</view>
					<image class="transfer-img-arrow" src="../../static/common/transfer.png" mode="widthFix"></image>
					<view class="transfer-item">
						<view class="transfer-text">到</view>
						<image class="transfer-img-hsc" :src="toImg"></image>
						<view class="transfer-text transfer-text-text">{{toChain}}</view>
					</view>
				</view>
			</view>
			<!-- 转账具体信息 -->
			<view class="transfer-detail">
				<view class="uni-form-item uni-column">
					<view class="title">数量</view>
					<u-input :custom-style="{fontSize: '32rpx',background:'#fff',fontFamily:'gilroy-bold',paddingLeft:'16rpx'}"
						class="input" v-model="amount" type="digit" placeholder="请输入转账数量" :clearable="false" :border="false" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">{{coinType}}接收地址</view>
					<u-input :custom-style="{fontSize: '32rpx',background:'#fff',fontFamily:'gilroy-bold',paddingLeft:'16rpx'}"
						class="input" v-model="address" placeholder="请输入接收地址" :clearable="false" :border="false" />
				</view>
			</view>
		</view>

		<!-- 发送按钮 -->
		<view class="send-btn" @click="send">发送</view>
		
		<!-- 下拉选 -->
		<u-select v-model="show" mode="single-column" :list="list" @confirm="confirm"></u-select>

		<!-- 输入密码弹框 -->
		<inputPassword ref="inputPwNav" @correct="correct"></inputPassword>
		<!-- 验证指纹弹框 -->
		<fingerprint @identifySuccess="identifySuccess" ref="fingerprintNav"></fingerprint>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		HSC_CHAIN,HSCToHecoAddr,HSCToBinanceAddr
	} from '@/common/js/wallet.js'
	import inputPassword from '../../components/inputPassword.vue'
	import fingerprint from '../../components/fingerprint.vue'
	export default {
		components: {
			inputPassword,
			fingerprint
		},
		data() {
			return {
				myAddr: '',
				account: {}, //个人信息
				Type: {},
				fromChain: '',
				toChain: '',
				fromImg: '',
				toImg: '',
				amount: '',
				address: '',
				show: false,
				selectedText: '', // 选中的项
				selectedIcon: '', // 选中的项
				list: [],
				chain_id: HSC_CHAIN,
				testHSCAddr: HSCToHecoAddr, // hsc1g75测试网的地址：hsc1g75290c78q4euacv5n0yk24sh2uapmwx33w4ef, 正式环境hsc的转出和转入地址：hsc1puw3fthwskj7s9uvrgswvagzx7md7kdrn3jket  (hsc13xg正式网地址：hsc13xg0642wy23hhe4u4gvqt7lyuy7lj5pyaj58eu待定)
				testHECOAddr: '0x8b532A544488284Bf27799d21eDEEf656b927eE6', // heco地址 测试：0x0A77D23f6137C3C2057B14F948D28df97D33Fe08 正式：0x8b532A544488284Bf27799d21eDEEf656b927eE6
				testBinanceAddr: '0x8b532A544488284Bf27799d21eDEEf656b927eE6', // Binance地址 测试：0x0A77D23f6137C3C2057B14F948D28df97D33Fe08 正式：0x8b532A544488284Bf27799d21eDEEf656b927eE6
				// denom: '',
				coinType: 'HS',
			}
		},
		onLoad(value) {
			this.myAddr = uni.getStorageSync('userAddress'); // 用户当前钱包地址
			this.account = this.secret.decrypt(uni.getStorageSync('account'));
			let acc = this.secret.decrypt(uni.getStorageSync('account'));
			this.Type = acc[uni.getStorageSync('userAddress')];

			if (this.Type.type == 'HST') {
				this.selectedText = 'Huobi ECO Chain';
				this.selectedIcon = '../../static/common/heco.png';
				
				this.fromChain = 'HSChain';
				this.toChain = 'Huobi ECO Chain';
				this.fromImg = '../../static/main/hsc.png';
				this.toImg = '../../static/common/heco.png'
				this.coinType = 'HECO';

				this.list = [{
						value: '1',
						label: 'HECO'
					},
					{
						value: '2',
						label: 'Binance'
					}]
			} else if (this.Type.type == 'HECO') {
				this.selectedText = 'HSChain';
				this.selectedIcon = '../../static/main/hsc.png';
				
				this.fromChain = 'Huobi ECO Chain';
				this.toChain = 'HSChain';
				this.fromImg = '../../static/common/heco.png'
				this.toImg = '../../static/main/hsc.png';
				
				this.coinType = 'HS';
				
				this.list = [{
					value: '1',
					label: 'HSChain'
				}]
			}else if (this.Type.type == 'Binance') {
				this.selectedText = 'HSChain';
				this.selectedIcon = '../../static/main/hsc.png';
				
				this.fromChain = 'Binance Chain';
				this.toChain = 'HSChain';
				this.fromImg = '../../static/common/bnb.svg'
				this.toImg = '../../static/main/hsc.png';
				
				this.coinType = 'HS';
				this.list = [{
					value: '1',
					label: 'HSChain'
				}]
			}
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			assetsToggle() {
				this.show = true;
			},
			// 注意返回值为一个数组，单列时取数组的第一个元素即可(只有一个元素)
			confirm(e) {
				let selectedIndex = e[0].value;

				if (this.Type.type == 'HST') {
					if(selectedIndex == 1){
						this.selectedText = 'Huobi ECO Chain';
						this.selectedIcon = '../../static/common/heco.png';
						
						this.toChain = 'Huobi ECO Chain';
						this.coinType = 'HECO';
						this.toImg = '../../static/common/heco.png';
						this.testHSCAddr = this.HSCToHecoAddr;
						this.amount= '';
						this.address = '';
					}else if(selectedIndex == 2){
						this.selectedText = 'Binance Chain';
						this.selectedIcon = '../../static/common/bnb.svg';
						
						this.toChain = 'Binance Chain';
						this.coinType = 'Binance';
						this.toImg = '../../static/common/bnb.svg';
						this.testHSCAddr = HSCToBinanceAddr;
						this.amount= '';
						this.address = '';
					}
					
				} else if(this.Type.type == 'HECO'){
					this.selectedText = 'HSChain';
					this.selectedIcon = '../../static/main/hsc.png';
					
					this.fromChain = 'Huobi ECO Chain';
					this.toChain = 'HSChain';
					this.coinType = 'HS';
				}else if(this.Type.type == 'Binance'){
					this.selectedText = 'HSChain';
					this.selectedIcon = '../../static/main/hsc.png';
					
					this.fromChain = 'Binance Chain';
					this.toChain = 'HSChain';
					this.coinType = 'HS';
				}
			},
			// 点击发送
			send() {
				if (this.amount == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入转账数量'
					})
					return
				}
				if(this.amount <= 0){
					uni.showToast({
						icon: 'none',
						title: '转账数量需大于0'
					})
					return
				}
				if (this.address == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入接收地址'
					})
					return
				}
				
				let reg1 = /^hsc[0-9a-zA-Z]{39}$/;  // hsc地址校验
				let reg2 = /^0x[0-9a-fA-F]{40}$/;	// heco地址校验
				let isPass1 = reg1.test(this.address);
				let isPass2 = reg2.test(this.address);
				
				if(this.Type.type === 'HST'){
					if(!isPass2){
						uni.showToast({
							icon: 'none',
							title: '请输入正确的钱包地址'
						})
						return
					}				
				}else if(this.Type.type === 'HECO' || this.Type.type === 'Binance'){
					if(!isPass1){
						uni.showToast({
							icon: 'none',
							title: '请输入正确的钱包地址'
						})
						return
					}
				}


				//指纹验证或者密码验证
				if (uni.getStorageSync('fingerprintIdentification')) {
					// Android平台手动弹出等待提示框
					if ('Android' === plus.os.name) {
						this.$refs.fingerprintNav.showDialog() //指纹识别弹框展示
					}
					this.$refs.fingerprintNav.fingerprint() //指纹识别方法调用
				} else {
					this.$refs.inputPwNav.showDialog()
				}
			},
			//反馈校验是否成功
			identifySuccess(val) {
				if (val) {
					this.transation()
				} else {
					this.$refs.inputPwNav.showDialog()
				}
			},
			// 验证正确后开启交易
			correct(val) {
				if (val) {
					this.transation()
				}
			},
			//验证成功后下一步开启交易
			transation() {
				if (this.Type.type === 'HST') {
					const hschain = this.$chain(this.$url, this.$chainId)
					hschain.setPath(this.$path)
					let ecpairPriv
					if (this.account[uni.getStorageSync('userAddress')].privateKey) {
						ecpairPriv = Buffer.from(this.account[uni.getStorageSync('userAddress')].privateKey, 'hex')
					} else if (this.account[uni.getStorageSync('userAddress')].key) {
						const mnemonic = this.account[uni.getStorageSync('userAddress')].key
						ecpairPriv = hschain.getECPairPriv(mnemonic)
					}
					this.$u.api.getAccounts(this.myAddr).then(res => {
						
						for(var i=0;i<res.result.value.coins.length;i++){
							if('uhsc' == res.result.value.coins[i].denom){
								if(this.amount * 1000000 > res.result.value.coins[i].amount){
									uni.showToast({
										title: '当前余额不足',
										icon: 'none'
									})
									return;
								}
							}
						}
						
						let stdSignMsg = hschain.newStdMsg({
							msgs: [{
								type: "cosmos-sdk/MsgSend",
								value: {
									amount: [{
										amount: String(this.amount * 1000000),
										denom: 'uhsc'
									}],
									from_address: this.myAddr,
									to_address: this.testHSCAddr, // 固定地址
								}
							}],
							chain_id: this.chain_id,
							fee: {
								amount: [],
								gas: String(200000)
							},
							memo: this.address, // memo就是显示在页面上的to地址
							account_number: String(res.result.value.account_number),
							sequence: String(res.result.value.sequence)
						});
						const signedTx = hschain.sign(stdSignMsg, ecpairPriv)

						this.$u.api.broadcast(signedTx).then(res => {
							if (JSON.parse(res.raw_log)[0].success) {
								this.$refs.uToast.show({
									title: '交易正在处理中',
									type: 'default',
									position: 'bottom',
									duration: 2000
								})
								setTimeout(() => {
									uni.navigateBack()
								}, 2000)
							} else {
								this.$refs.uToast.show({
									title: JSON.parse(res.raw_log).message,
									type: 'default',
									position: 'bottom',
									duration: 4000
								})
							}
						}).catch(err => {

							uni.showToast({
								title: '交易失败'
							})
						})
					}).catch(err => {})
				} else if (this.Type.type === 'HECO' && !uni.getStorageSync('ERC20transfer')) {
					let type;
					let mnemonic;
					if (this.Type.key) {
						type = 'mnemonic'
						mnemonic = this.account[uni.getStorageSync('userAddress')].key;
					} else if (this.Type.privateKey) {
						type = 'privateKey'
						mnemonic = this.account[uni.getStorageSync('userAddress')].privateKey;
					}
					
					if(this.amount.split('.')[1]){
						if(this.amount.split('.')[1].length > 6){
							uni.showToast({
								title: "请输入6位以内小数",
								icon: "none"
							})
							return
						}
					}

					this.$wallet("HECO").HecoBridgeHsc(mnemonic, this.myAddr, this.testHECOAddr, this.address, this.amount,
						type).then(res => {
						// console.log(res)
						uni.showToast({
							title: '交易请求成功'
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 2000)
					}, err => {

						uni.showToast({
							title: '交易失败'
						})
					});

					uni.showToast({
						title: '交易正在处理中'
					})
				}else if (this.Type.type === 'Binance') {
					let type;
					let mnemonic;
					if (this.Type.key) {
						type = 'mnemonic'
						mnemonic = this.account[uni.getStorageSync('userAddress')].key;
					} else if (this.Type.privateKey) {
						type = 'privateKey'
						mnemonic = this.account[uni.getStorageSync('userAddress')].privateKey;
					}
					
					if(this.amount.split('.')[1]){
						if(this.amount.split('.')[1].length > 6){
							uni.showToast({
								title: "请输入6位以内小数",
								icon: "none"
							})
							return
						}
					}

					this.$wallet("Binance").BinanceBridgeHsc(mnemonic, this.myAddr, this.testBinanceAddr, this.address, this.amount,
						type).then(res => {
						// console.log(res)
						uni.showToast({
							title: '交易请求成功'
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 2000)
					}, err => {

						uni.showToast({
							title: '交易失败'
						})
					});

					uni.showToast({
						title: '交易正在处理中'
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.bridge {
		.bridge-top {
			width: 100%;
			height: 404rpx;
			background: linear-gradient(18deg, #E0C193, #C8A774);
			border-radius: 0 0 50% 100%/0 0 15% 15%;

			padding-top: 36rpx;

			.title-wrap {
				position: relative;

				.arrow-left {
					position: absolute;
					top: 3px;
					left: 30rpx;
				}

				.page-title {
					width: 100%;
					height: 48rpx;
					line-height: 48rpx;
					text-align: center;
					font-size: 34rpx;
				}
			}

			.assets-wrap {
				width: 690rpx;
				height: 488rpx;
				background: #FFFFFF;
				box-shadow: 0px 4rpx 17rpx rgba(0, 0, 0, 0.15);
				opacity: 1;
				border-radius: 10px;
				margin: 56rpx auto 0;
				padding: 30rpx 0 0;

				.assets-title {
					width: 100%;
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					font-size: 28rpx;
					color: #333;
				}

				.select-wrap {
					display: flex;
					justify-content: space-between;
					align-items: center;

					width: 100%;
					height: 82rpx;
					border: 1px solid #E5E5E5;
					margin-top: 20rpx;
					padding: 0 20rpx;

					.select-wrap-left {
						display: flex;
						align-items: center;

						.select-icon {
							width: 62rpx;
							// height: 62rpx;
						}

						.select-text {
							font-size: 26rpx;
							color: #666;
							margin-left: 14rpx;
						}
					}
				}

				.transfer {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 50rpx 70rpx 0;

					.transfer-img-arrow {
						width: 44rpx;
					}

					.transfer-img-hsc {
						width: 66rpx;
						height: 66rpx;
						
						margin-top: 30rpx;
					}

					.transfer-item {
						display: flex;
						flex-direction: column;
						// justify-content: space-between;
						align-items: center;

						width: 198rpx;
						height: 246rpx;
					}

					.transfer-text {
						line-height: 40rpx;
						text-align: center;
						font-size: 28rpx;
						color: #666;
					}
					.transfer-text-text{
						margin-top: 30rpx;
					}
				}
			}

			// 转账具体信息
			.transfer-detail {
				margin-top: 62rpx;
				padding: 0 30rpx;

				.uni-form-item {
					margin-top: 50rpx;

					.title {
						height: 88rpx;
						line-height: 88rpx;
						font-size: 30rpx;
						color: #1f1f1f;
						background: #F7F7F7;
						
						margin-bottom: 22rpx;
						padding-left: 16px;
					}

					// .uni-input {
					// 	height: 82rpx;
					// 	line-height: 82rpx;
					// 	color: #333;
					// 	border: 1px solid #E5E5E5;
					// 	border-radius: 5px;
					// 	padding-left: 20rpx;
					// }
				}
			}
		}

		// 发送按钮
		.send-btn {
			width: 686rpx;
			height: 95rpx;
			line-height: 95rpx;
			text-align: center;
			font-size: 36rpx;
			background: linear-gradient(90deg, #E2C395 0%, #C7A673 100%);
			opacity: 0.7;
			border-radius: 5px;

			position: absolute;
			left: 30rpx;
			bottom: 44rpx;
			z-index: 99;
		}
	}
</style>
