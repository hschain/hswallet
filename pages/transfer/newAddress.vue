<template>
	<view class="newAddress">
		<view class="addressName">
			<view class="containerWrap" @click="goto">
				<u-cell-group>
					<u-cell-item :title="AddressType" :arrow="false" :border-bottom="false"  hover-class="none">
						<u-image class="addrImg" slot="icon" width="60" height="60" :src="src" shape="circle" :fade="false"></u-image>
						<image class="rightImg" src="../../static/svg/arrow_right.svg" mode="" ></image>	
					</u-cell-item>
				</u-cell-group>
			</view>
		</view>
		<view class="addrInfo">
			地址信息
		</view>
		<view class="detailed">
			<view class="containerWrap ">
				<u-cell-group>
					<u-cell-item :arrow="false" title-width="600" hover-class="none">
						<u-input :custom-style="{color: '#1f1f1f'}" v-model="newAddr.addr" slot="title" placeholder="请输入地址" :clearable="false"></u-input>
						<u-icon slot="right-icon" name="scan" custom-prefix="project-icon" @click="openScan()" size="50"></u-icon>
					</u-cell-item>
					<u-cell-item :arrow="false" title-width="600" hover-class="none">
						<u-input style="color: #1f1f1f;" v-model="newAddr.name" slot="title" placeholder="名称" :clearable="false"></u-input>
					</u-cell-item>
					<u-cell-item :arrow="false" title-width="600" hover-class="none" :border-bottom="false">
						<u-input style="color: #1f1f1f;" v-model="newAddr.description" slot="title" placeholder="描述 (选填)" :clearable="false"></u-input>
					</u-cell-item>
				</u-cell-group>
			</view>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>
<style>
    html,body{
        background: #f7f7f7;
	}
	.u-input{
		color: #1f1f1f;
	}
</style>
<script>
	export default {
		name: 'newAddress',
		data() {
			return {
				newAddr: {
					denom: uni.getStorageSync('AddressType')||'HST',
					addr: '',
					name: '',
					description: ''
				},
				src: '',
				tips: {
					type: 'error',
					duration: '1500'
				},
				editIndex: -1,
				AddressType:uni.getStorageSync('AddressType')||'HST'
			}
		},
		onLoad(value) {
			//从编辑进入的，则给予初始值
			if (value.addrIndex) {
				this.editIndex = value.addrIndex
				this.newAddr = uni.getStorageSync('addressBook_' + uni.getStorageSync('userAddress'))[value.addrIndex]
			}
		},
		onReady() {
			if (this.editIndex !== -1) {
				uni.setNavigationBarTitle({
				    title: '编辑地址'
				});
			}
		},
	
		onNavigationBarButtonTap() {
			// 保存时做一系列规则判断
			if (!this.newAddr.addr) {
				this.$refs.uTips.show({
					title: '地址不能为空',
					type: this.tips.type,
					duration: this.tips.duration
				})
			} else if (uni.getStorageSync('AddressType')=='HST'&& !(/^hsc/i.test(this.newAddr.addr))){
				this.$refs.uTips.show({
					title: '请输入正确的地址',
					type: this.tips.type,
					duration: this.tips.duration
				})
			} else if (!this.newAddr.name) {
				this.$refs.uTips.show({
					title: '名称不能为空',
					type: this.tips.type,
					duration: this.tips.duration
				})
			} else {
				let sameAddr = false //是否存在相同地址的判断标志位
				if (uni.getStorageSync('addressBook_' + uni.getStorageSync('userAddress'))) { //本地存储是否存在这一属性值
					let data = uni.getStorageSync('addressBook_' + uni.getStorageSync('userAddress'))
					if (this.editIndex === -1) {// 判断是否为编辑地址模式，等于-1则不是
						data.forEach(item => {
						if (item.addr === this.newAddr.addr) {
								this.$refs.uTips.show({
									title: '已存在相同的地址',
									type: this.tips.type,
									duration: this.tips.duration
								})
								sameAddr = true
							}
						})
						if (!sameAddr) {
							data.push(this.newAddr)
							uni.setStorage({
								key: 'addressBook_' + uni.getStorageSync('userAddress'),
								data: data
							})
						}
					} else{
						data.splice(this.editIndex, 1, this.newAddr)
						uni.setStorage({
							key: 'addressBook_' + uni.getStorageSync('userAddress'),
							data: data
						})
					}
				} else {
					uni.setStorage({
						key: 'addressBook_' + uni.getStorageSync('userAddress'),
						data: [this.newAddr]
					})
				}
				if (!sameAddr) {
					uni.showToast({
						title: '保存成功',
						success() {
							uni.navigateTo({url: '../transfer/address'})
						}
					})
				}
			}
			
		},
		onBackPress() {
			this.back();
			return true;
		},
		onShow(){
			if (this.AddressType=='HST') {
				this.src='../../static/svg/chain_hst.svg'
			}else if (this.AddressType=='ETH') {
				this.src='../../static/svg/chain_eth.svg'
			}
		},
		methods:{
			back(){
				uni.navigateTo({
					url: "address"
				})
			},
			addAddress() {
				uni.navigateTo({url: 'address'})
			},
			goto(){
				uni.navigateTo({url: '../chooseAddress/chooseAddress'})
			},
			openScan() {
				let _this = this
				uni.scanCode({
				    success: function (res) {
						_this.newAddr.addr = res.result
				    }
				});
			}
		}
	}
</script>

<style lang="scss">
	.newAddress {
		font-size: 28rpx;
		margin: 30rpx 0;
		/deep/ .u-cell-item-box {
			background-color: transparent;
		}
		.addressName{
			background: #fff;
			.rightImg{
				width: 32rpx;
				height: 32rpx;
			}
		}
		.addrImg {
			margin-right: 20rpx;
		}
		.addrInfo {
			margin: 30rpx;
			color: #1f1f1f;
			background: #f7f7f7;
		}
		.detailed{
			background: #fff;
			color: #1f1f1f;
		}
	}
</style>
