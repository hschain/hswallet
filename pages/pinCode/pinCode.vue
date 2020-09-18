<template>
	<view class="pinCode">
		<view class="header">
			<image @click="back" class="back" src="../../assets/common/back.png" mode=""></image>
		</view>
		<view class="pinTip">请输入PIN码</view>
		<view class="inputPassword">
			<input class="inputText" type="number" maxlength="6" v-model="pw" password placeholder="请输入6位数的PIN码"/>
			<input class="inputText" type="number" maxlength="6" v-model="confirmPw" password placeholder="请确认您的PIN码"/>
		</view>
		<view class="confirmCheck">
			<button @click="check" type="primary">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'pinCode',
		data() {
			return {
				pw: '',
				confirmPw: ''
			}
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			check() {
				uni.switchTab({
					url: '../main/main'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pinCode {
		.header {
			margin: 100rpx 40rpx 0;
			.back {
				width: 50rpx;
				height: 40rpx;
			}
		}
		.pinTip{
			margin: 50rpx 100rpx;
			font-size: 64rpx;
			text-align: center;
		}
		.inputPassword {
			padding: 10rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 25vh;
			.inputText{
				border-radius: 4px;
				border: 1px solid #DCDFE6;
				padding: 10px;
				margin: 40rpx 0;
			}
		}
		.confirmCheck {
			width: 400rpx;
			margin: 0 auto;
		}
	}
</style>
