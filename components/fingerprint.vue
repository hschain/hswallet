<template>
	<!-- 验证指纹弹框 -->
	<u-modal class="fingerprint" :negative-top="top" v-model="fingerprintDialog" title="验证指纹" @cancel="cancelFingerprint()" :show-cancel-button="true" :show-confirm-button="false">
		<view class="walletName">
			<u-icon name="fingerprint" color="#debc6b" size="200"></u-icon>
		</view>
	</u-modal>
</template>

<script>
	export default {
		name: 'fingerprint',
		props: {
			//根据不同环境对业务逻辑做调整
			status: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				top: 400, //弹框偏移量
				fingerprintDialog: false, //验证指纹弹框
			}
		},
		watch: {
			getFingerprintStatus(newVal) {
				this.fingerprintDialog = newVal
			}
		},
		computed: {
			getFingerprintStatus() {
				return this.$store.state.fingerprintDialog;
			}
		},
		methods: {
			fingerprint() {
				// #ifdef APP-PLUS
				let _this = this
				plus.fingerprint.authenticate(function() {
					_this.$emit('identifySuccess', true)
					if (_this.status === 'setting') plus.nativeUI.toast('指纹识别成功');
					_this.fingerprintDialog = false
				}, function(e) {
					switch (e.code) {
						case e.AUTHENTICATE_MISMATCH:
							plus.nativeUI.toast('指纹匹配失败，请重新识别');
							break;
						case e.AUTHENTICATE_OVERLIMIT:
							_this.status === 'setting' ? plus.nativeUI.toast('指纹识别失败次数超出限制') : plus.nativeUI.toast('指纹识别失败次数超出限制，请使用其它方式进行认证');
							_this.fingerprintDialog = false
							_this.$emit('identifySuccess', false)
							break;
						case e.CANCEL:
							plus.nativeUI.toast('已取消识别');
							break;
						default:
							plus.nativeUI.toast('指纹识别失败，请重试');
							break;
					}
				});
				// #endif
				// #ifdef MP-WEIXIN
				wx.startSoterAuthentication({
					requestAuthModes: ['fingerPrint'],
					challenge: '123456',
					authContent: '请用指纹解锁',
					success(res) {
						uni.showToast({
							title: '识别成功',
							mask: false,
							duration: 1500
						});
					}
				})
				// #endif
			},
			cancelFingerprint() {
				this.fingerprintDialog = false
				plus.fingerprint.cancel()
			},
			showDialog() {
				this.fingerprintDialog = true
			}
		}
	}
</script>

<style lang="scss">
	.fingerprint{
		.walletName{
			padding: 60rpx 40rpx;
			display: flex;
			justify-content: center;
		}
	}
</style>