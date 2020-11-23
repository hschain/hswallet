<template>
	<view class="inputPassword">
		<!-- 输入密码弹框 -->
		<u-modal :negative-top="top" v-model="inputPwDialog" title="请输入密码" :show-confirm-button="false" :mask-close-able="true">
			<view class="walletName">
				<u-message-input active-color="#888" :breathe="true" :maxlength="6" :dot-fill="true" @finish="validatePw" width="65"></u-message-input>
			</view>
		</u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		name: 'inputPassword',
		data() {
			return {
				inputPwDialog: false, //输入密码弹框
				top: 600, //弹框偏移量
			}
		},
		methods: {
			//验证密码
			validatePw(e) {
				if (this.$md5(e) === uni.getStorageSync('localPw')) {
					this.$emit('correct', true)
					this.inputPwDialog = false
				} else{
					this.$refs.uToast.show({
						title: '密码错误',
						type: 'error',
						position: 'center'
					})
				}
			},
			//显示弹框
			showDialog() {
				this.inputPwDialog = true
			}
		}
	}
</script>

<style lang="scss">
	.inputPassword {
		.walletName{
			padding: 30rpx 40rpx 50rpx;
		}
	}
</style>
