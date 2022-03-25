<template>
	<view class="transfer">
		<view class="addrTitle">
			收款地址
		</view>
		<view class="Container">
			<view class="containerWrap">
				<view class="addrInput">
					<u-input :custom-style="{fontSize: '32rpx',background:'#fff',fontFamily:'gilroy-bold'}"
						class="input" v-model="addr" :placeholder="'收款地址'" :clearable="false" :border="false" />
					<image @click="addAddress" class="addrImg" src="../../static/common/ic_address.png" mode=""></image>
				</view>
				<u-cell-group v-show="Object.keys(addrData).length">
					<u-cell-item :value-style="{color: '#fff'}" :title-style="{color: '#fff'}" :arrow="false"
						:value="addrData.description || '(空)'" :title="addrData.name" hover-class="none"
						:border-bottom="false">
					</u-cell-item>
				</u-cell-group>
			</view>
		</view>

		<view class="addrTitle">
			金额
		</view>
		<view class="Container">
			<view class="containerWrap">
				<view class="">
					<u-cell-group>
						<u-cell-item :arrow="false" hover-class="none">
							<u-input class="table" slot="title"
								:custom-style="{fontSize: '46rpx',fontFamily:'gilroy-bold'}" v-model="cash"
								placeholder="0" :clearable="false" type="digit" />
						</u-cell-item>
						<u-cell-item :arrow="false" hover-class="none">
							<u-input class="table" slot="title" :custom-style="{fontSize: '32rpx'}" v-model="memo"
								placeholder="备注" :clearable="false" maxlength="15"/>
						</u-cell-item>
					</u-cell-group>
				</view>
			</view>
		</view>

		<view :class="['nextStep', nextStatus ? 'opaque' : 'transparent']" @click="nextStatus ? nextStep() : ''">下一步
		</view>

		<!-- 输入密码弹框 -->
		<inputPassword ref="inputPwNav" @correct="correct"></inputPassword>

		<!-- 验证指纹弹框 -->
		<fingerprint @identifySuccess="identifySuccess" ref="fingerprintNav"></fingerprint>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		HSC_CHAIN
	} from '@/common/js/wallet.js'
	import inputPassword from '../../components/inputPassword.vue'
	import fingerprint from '../../components/fingerprint.vue'
	export default {
		name: 'transfer',
		components: {
			inputPassword,
			fingerprint
		},
		data() {
			return {
				addr: '', //输入框地址，用于比对 地址本数据
				myAddr: ',', //个人地址
				account: {}, //个人信息
				addrData: {}, //交易目标信息
				addrBook: [], //地址本
				cash: '', //输入交易价格
				memo: '', //输入交易备注
				nextStatus: false, //下一步按钮是否可用
				timer: null, //定时器
				Type: {},
				denom: '',
				name: '',
				chain_id: HSC_CHAIN,
			}
		},
		watch: {
			addr(newVal) {
				this.addrData = {}
				// 判断1：有值没共享state, 防抖并轮询数据，判断2：有值有共享state，直接使用state的数据并清空state，判断3：没值，下一步按钮 disabled
				if (newVal && !Object.keys(this.$store.state.addrData).length) {
					if (this.timer) clearTimeout(this.timer)
					if (this.cash) this.nextStatus = true
					this.timer = setTimeout(() => {
						for (let i in this.addrBook) {
							if (this.addrBook[i].addr === this.addr) {
								this.addrData = this.addrBook[i]
								break
							}
						}
					}, 600);
				} else if (newVal && Object.keys(this.$store.state.addrData).length) {
					this.addrData = this.$store.state.addrData
					if (this.cash) this.nextStatus = true
					this.$store.commit('SAVE_ADDR_DATA', {})
				} else {
					this.nextStatus = false
				}
			},
			cash(newVal) {
				if (newVal * 1 && this.addr) {
					this.nextStatus = true
				} else {
					this.nextStatus = false
				}
			}
		},
		onLoad(value) {
			// console.log(this.chain_id)
			// console.log(value)
			this.account = this.secret.decrypt(uni.getStorageSync('account'))
			let acc = this.secret.decrypt(uni.getStorageSync('account'));
			this.Type = acc[uni.getStorageSync('userAddress')];
			this.myAddr = uni.getStorageSync('userAddress')
			if (uni.getStorageSync('addressBook_' + uni.getStorageSync('userAddress'))) this.addrBook = uni.getStorageSync(
				'addressBook_' + uni.getStorageSync('userAddress'))
			uni.setNavigationBarTitle({
				title: value.name ? value.name : this.Type.type + "转账"
			})
			this.denom = value.denom ? value.denom : 'uhst' // demo为传过来的值：uhsc或其他
			this.name = value.name ? value.name : this.Type.type // name同理
			// console.log(this.denom)
		},
		onShow() {
			let acc = this.secret.decrypt(uni.getStorageSync('account'));
			this.Type = acc[uni.getStorageSync('userAddress')];
			if (this.$store.state.addrData) {
				this.addr = this.$store.state.addrData.addr
			}


		},
		//调用二维码扫码功能
		onNavigationBarButtonTap() {
			let _this = this
			uni.scanCode({
				onlyFromCamera: true,
				success: function(res) {
					let resArr = res.result.split("?")
					let addressArr = resArr[0].split(":")
					if (addressArr.length > 1) {
						_this.addr = addressArr[1]
					} else {
						_this.addr = addressArr[0]
					}
				}
			});
		},

		methods: {
			//添加新地址
			addAddress() {
				uni.navigateTo({
					url: `address`
				})
				
				uni.setStorageSync('addressOriginal', 'transfer')
			},
			// 下一步前验证弹框
			nextStep() {

				let reg1 = /^hsc[0-9a-zA-Z]{39}$/;  // hsc地址校验
				let reg2 = /^0x[0-9a-fA-F]{40}$/;	// heco地址校验
				let isPass1 = reg1.test(this.addr);
				let isPass2 = reg2.test(this.addr);

				if(this.Type.type === 'HST'){
					if(!isPass1){
						uni.showToast({
							icon: 'none',
							title: '请输入正确的钱包地址'
						})
						return
					}				
				}else if(this.Type.type === 'ETH'){
					if(!isPass2){
						uni.showToast({
							icon: 'none',
							title: '请输入正确的钱包地址'
						})
						return
					}
				}else if(this.Type.type === 'HECO' || this.Type.type === 'Binance'){
					if(!isPass2){
						uni.showToast({
							icon: 'none',
							title: '请输入正确的钱包地址'
						})
						return
					}
				}				

				if(this.cash <= 0){
					uni.showToast({
						icon: 'none',
						title: '转账金额需大于0'
					})
					return
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
							if(this.denom == res.result.value.coins[i].denom){
								if(this.cash * 1000000 > res.result.value.coins[i].amount){
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
										amount: String(this.cash * 1000000),
										denom: this.denom
									}],
									from_address: this.myAddr,
									to_address: this.addr
								}
							}],
							chain_id: this.chain_id,
							fee: {
								amount: [],
								gas: String(200000)
							},
							memo: this.memo,
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
				} else if (this.Type.type === 'ETH' && !uni.getStorageSync('ERC20transfer')) {
					let type;
					let mnemonic;
					if (this.Type.key) {
						type = 'mnemonic'
						mnemonic = this.account[uni.getStorageSync('userAddress')].key;
					} else if (this.Type.privateKey) {
						type = 'privateKey'
						mnemonic = this.account[uni.getStorageSync('userAddress')].privateKey;
					}
					this.$wallet('ETH').sendETH(mnemonic, this.addr, this.cash, type).then(res => {
						uni.showToast({
							title: '交易请求成功'
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 2000)
					}).catch(err => {
						uni.showToast({
							title: '交易失败'
						})

					})
					uni.showToast({
						title: '交易正在处理中'
					})
				} else if (this.Type.type === 'HECO') {
					let type;
					let mnemonic;
					if (this.Type.key) {
						type = 'mnemonic'
						mnemonic = this.account[uni.getStorageSync('userAddress')].key;
					} else if (this.Type.privateKey) {
						type = 'privateKey'
						mnemonic = this.account[uni.getStorageSync('userAddress')].privateKey;
					}
					
					if(this.cash.split('.')[1]){
						if(this.cash.split('.')[1].length > 6){
							uni.showToast({
								title: "请输入6位以内小数",
								icon: "none"
							})
							return
						}
					}
					
					this.$wallet("HECO").sendHscToken(mnemonic, this.addr, this.cash, type).then(res => {
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
					
					if(this.cash.split('.')[1]){
						if(this.cash.split('.')[1].length > 6){
							uni.showToast({
								title: "请输入6位以内小数",
								icon: "none"
							})
							return
						}
					}

					this.$wallet("Binance").sendBinanceToken(mnemonic, this.addr, this.cash, type).then(res => {
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
				} else if (this.Type.type === 'ETH' && uni.getStorageSync('ERC20transfer')) {
					let type;
					let mnemonic;
					if (this.Type.key) {
						type = 'mnemonic'
						mnemonic = this.account[uni.getStorageSync('userAddress')].key;
					} else if (this.Type.privateKey) {
						type = 'privateKey'
						mnemonic = this.account[uni.getStorageSync('userAddress')].privateKey;
					}
					this.$wallet("ETH").sendToken(mnemonic, uni.getStorageSync('ERC20addr'), this.addr, this.cash, type)
						.then(res => {
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
<style>
	html {
		background: #F7F7F7;
	}

	.u-input {
		color: #1f1f1f;
	}
</style>
<style lang="scss">
	.transparent {
		opacity: 0.6;
	}

	.opaque {
		opacity: 1;
	}

	.transfer {
		font-size: 30rpx;

		.addrTitle {
			width: 100%;
			height: 88rpx;
			// margin: 30rpx 5vw 20rpx;
			background: #F7F7F7;
			color: #1f1f1f;
			padding: 20rpx 32rpx;
		}

		.Container {
			padding: 0 32rpx;

		}

		.table {
			margin-left: -26rpx;
		}

		// /deep/.u-input__input {
		// 	font-size: 36rpx;
		// }
		.addrInput {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0;
			background: #fff;

			.input {
				margin-right: 30rpx;
			}

			.addrImg {
				width: 40rpx;
				height: 40rpx;
			}
		}

		.nextStep {
			position: fixed;
			bottom: 3vh;
			left: 5vw;
			width: 686rpx;
			height: 96rpx;
			background: url('../../static/common/button_gold.png') no-repeat;
			background-size: 100% 100%;
			text-align: center;
			line-height: 96rpx;
		}
	}
</style>
