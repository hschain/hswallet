<template>
	<view class="transfer">
		<view class="addrTitle">
			收款地址
		</view>
		<view class="Container">
			<view class="containerWrap">
				<view class="addrInput">
					<u-input :custom-style="{fontSize: '32rpx',background:'#fff',fontFamily:'gilroy-bold'}" class="input" v-model="addr" :placeholder="$store.state.walletType + '地址'" :clearable="false" :border="false"/>
					<image @click="addAddress" class="addrImg" src="../../static/common/ic_address.png" mode=""></image>
				</view>
				<u-cell-group v-show="Object.keys(addrData).length">
					<u-cell-item :value-style="{color: '#fff'}" :title-style="{color: '#fff'}" :arrow="false" :value="addrData.description || '(空)'" :title="addrData.name" hover-class="none" :border-bottom="false">
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
							<u-input class="table" slot="title" :custom-style="{fontSize: '46rpx',fontFamily:'gilroy-bold'}" v-model="cash" placeholder="0" :clearable="false" type="text" />
						</u-cell-item>
						<u-cell-item :arrow="false" hover-class="none">
							<u-input class="table" slot="title" :custom-style="{fontSize: '32rpx'}" v-model="memo" placeholder="备注" :clearable="false" />
						</u-cell-item>
					</u-cell-group>
				</view>
			</view>
		</view>

		<view :class="['nextStep', nextStatus ? 'opaque' : 'transparent']" @click="nextStatus ? nextStep() : ''">下一步</view>
		
		<!-- 输入密码弹框 -->
		<inputPassword  ref="inputPwNav" @correct="correct"></inputPassword>
		
		<!-- 验证指纹弹框 -->
		<fingerprint @identifySuccess="identifySuccess" ref="fingerprintNav"></fingerprint>
		
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import inputPassword from '../../components/inputPassword.vue'
	import fingerprint from '../../components/fingerprint.vue'
	export default {
		name: 'transfer',
		components: { inputPassword, fingerprint },
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
				if(newVal*1 && this.addr) {
					this.nextStatus = true
				} else {
					this.nextStatus = false
				}
			}
		},
		onLoad() {
			this.account = this.secret.decrypt(uni.getStorageSync('account'))
			this.myAddr = uni.getStorageSync('userAddress')
			if (uni.getStorageSync('addressBook_' + uni.getStorageSync('userAddress'))) this.addrBook = uni.getStorageSync('addressBook_' + uni.getStorageSync('userAddress'))
		},
		onShow() {
			console.log('walletName',this.$store.state.walletName);
			if (this.$store.state.addrData) {
				this.addr = this.$store.state.addrData.addr
			}
			
			uni.setNavigationBarTitle({
			　　title: this.$store.state.walletType + "转账"
			})			
		},
		//调用二维码扫码功能
		onNavigationBarButtonTap() {
			let _this = this
			uni.scanCode({
				onlyFromCamera: true,
			    success: function (res) {
			        _this.addr = JSON.parse(res.result).address
			    }
			});
		},
		
		methods:{
			//添加新地址
			addAddress() {
				uni.navigateTo({url: `address`})
			},
			// 下一步前验证弹框
			nextStep() {
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
				console.log(111111111);
				if (val) {
					console.log(2222);
					this.transation()
				}
			},
			//验证成功后下一步开启交易
			transation() {
				console.log('准备交易');
				if (this.$store.state.walletName==='HST') {
					console.log('交易HST');
					const mnemonic = this.account[this.myAddr].key
					const hschain = this.$chain(this.$url, this.$chainId)
					hschain.setPath(this.$path)
					const ecpairPriv = hschain.getECPairPriv(mnemonic)
					this.$u.api.getAccounts(this.myAddr).then(res => {
						let stdSignMsg = hschain.newStdMsg({
							msgs: [
								{
									type: "cosmos-sdk/MsgSend",
									value: {
										amount: [
											{
												amount: String(this.cash*1000000),
												denom: "uhst"
											}
										],
										from_address: this.myAddr,
										to_address: this.addr
									}
								}
							],
							chain_id: 'test',
							fee: { amount: [ ], gas: String(this.cash*200000) },
							memo: this.memo,
							account_number: String(res.result.value.account_number),
							sequence: String(res.result.value.sequence)
						});
						const signedTx = hschain.sign(stdSignMsg, ecpairPriv)
						this.$u.api.broadcast(signedTx).then(res => {
							console.log('res',res);
							if (JSON.parse(res.raw_log)[0].success) {
								this.$refs.uToast.show({
									title: '交易正在处理中',
									type: 'default',
									position: 'bottom',
									duration: 2000
								})
								setTimeout(() => {
									uni.navigateBack()
								},2000)
							} else {
								this.$refs.uToast.show({
									title: JSON.parse(res.raw_log).message,
									type: 'default',
									position: 'bottom',
									duration: 4000
								})
							}
						}).catch(err => {
							console.log(err, 'err');
						})
					}).catch(err => {
						console.log(err);
					})
				}else if (this.$store.state.walletName==='ETH' &&!uni.getStorageSync('ERC20transfer')) {

					const mnemonic = this.account[uni.getStorageSync('userAddress')].key;
					console.log(mnemonic,this.addr,this.cash);
					this.$wallet('ETH').sendETH(mnemonic,this.addr,this.cash).then(res=>{
						uni.showToast({
							title: '交易成功'
						})
					}).catch(err=>{
						uni.showToast({
							title: '交易失败'	
						})
						console.log(err);
					})
					uni.showToast({
						title: '交易正在处理中'
					})
				}else if (this.$store.state.walletName==='ETH' &&uni.getStorageSync('ERC20transfer')) {
					const mnemonic = this.account[uni.getStorageSync('userAddress')].key;
					this.$wallet("ETH").sendToken(mnemonic,uni.getStorageSync('ERC20addr'),this.addr,this.cash).then(res=>{
						uni.showToast({
							title: '交易成功'
						})
					},err=>{
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
<style >
	html{
		background: #F7F7F7;
	}
	.u-input{
		color: #1f1f1f;
	}
</style>
<style lang="scss">
	.transparent{
		opacity: 0.6;
	}
	.opaque{
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
		.Container{
			padding: 0 32rpx;
			
		}
		.table{
				margin-left: -26rpx;
		}
		// /deep/.u-input__input {
		// 	font-size: 36rpx;
		// }
		.addrInput {
			width:100%;
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
		.nextStep{
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
