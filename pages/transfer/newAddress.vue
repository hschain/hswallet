<template>
	<view class="newAddress">
		<view class="greenContainer">
			<view class="containerWrap">
				<u-cell-group>
					<u-cell-item :title="newAddr.denom" :arrow="false" :border-bottom="false"  hover-class="none">
						<u-image class="addrImg" slot="icon" width="60" height="60" :src="src" shape="circle" :fade="false"></u-image>
					</u-cell-item>
				</u-cell-group>
			</view>
		</view>
		<view class="addrInfo">
			地址信息
		</view>
		<view class="greenContainer">
			<view class="containerWrap tableBar">
				<u-cell-group>
					<u-cell-item :arrow="false" title-width="600" hover-class="none">
						<u-input style="width: 500rpx;" v-model="newAddr.addr" slot="title" placeholder="请输入地址" :clearable="false"></u-input>
						<u-icon slot="right-icon" name="scan" custom-prefix="project-icon" @click="openScan()" size="50"></u-icon>
					</u-cell-item>
					<u-cell-item :arrow="false" title-width="600" hover-class="none">
						<u-input v-model="newAddr.name" slot="title" placeholder="名称" :clearable="false"></u-input>
					</u-cell-item>
					<u-cell-item :arrow="false" title-width="600" hover-class="none" :border-bottom="false">
						<u-input v-model="newAddr.description" slot="title" placeholder="描述 (选填)" :clearable="false"></u-input>
					</u-cell-item>
				</u-cell-group>
			</view>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		name: 'newAddress',
		data() {
			return {
				newAddr: {
					denom: 'HST',
					addr: '',
					name: '',
					description: ''
				},
				src: '../../static/common/logo.png',
				tips: {
					type: 'error',
					duration: '1500'
				},
				editIndex: -1
			}
		},
		onLoad(value) {
			if (value.addrIndex) {
				this.editIndex = value.addrIndex
				this.newAddr = this.secret.decrypt(uni.getStorageSync('addressBook'))[value.addrIndex]
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
			} else if (!(/^hsc/i.test(this.newAddr.addr))) {
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
				if (uni.getStorageSync('addressBook')) { //本地存储是否存在这一属性值
					let data = this.secret.decrypt(uni.getStorageSync('addressBook'))
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
								key: 'addressBook',
								data: this.secret.encrypt(data)
							})						
						}
					} else{
						data.splice(this.editIndex, 1, this.newAddr)
						uni.setStorage({
							key: 'addressBook',
							data: this.secret.encrypt(data)
						})
					}
				} else {
					uni.setStorage({
						key: 'addressBook',
						data: this.secret.encrypt([this.newAddr])
					})
				}
				if (!sameAddr) {
					uni.showToast({
						title: '保存成功',
						success() {
							setTimeout(() => uni.navigateBack(), 500)
						}
					})
				}
			}
			
		},
		methods:{
			addAddress() {
				uni.navigateTo({url: 'address'})
			},
			openScan() {
				let _this = this
				uni.scanCode({
				    success: function (res) {
						_this.newAddr.addr = JSON.parse(res.result).address
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
		.addrImg {
			margin-right: 20rpx;
		}
		.addrInfo {
			margin: 30rpx 5vw 10rpx;
		}
	}
</style>
