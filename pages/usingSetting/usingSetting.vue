<template>
	<view class="usingSetting ">
		<view class=" cellMark" style="margin-top:48rpx">
			<view class=" circle">
				<view class="boxLeft">
					<view class="leftWrapper">
						<view class="title ">
							指纹识别
						</view>
						<view class="value">{{result}}</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<u-switch @change="estimateStatus" active-color="#3D8CFF" v-model="fingerprintFlag" :disabled="disabled" size="35" inactive-color="rgba(144, 145, 149,0.2)"></u-switch>
					</view>
				</view>
			</view>
		</view>
		
		<view class=" cellMark">
			<view class=" circle">
				<view class="boxLeft">
					<view class="leftWrapper">
						<view class="title ">
							隐藏余额
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<u-switch v-model="hideBalance" active-color="#3D8CFF" size="35" inactive-color="rgba(144, 145, 149,0.2)"></u-switch>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 验证指纹弹框 -->
		<fingerprint @identifySuccess="identifySuccess" ref="fingerprintNav" status="setting"></fingerprint>
		
		<!-- 取消指纹识别确认弹框 -->
		<u-modal class="fingerprint" content="确认关闭指纹识别？" :show-title="false" :negative-top="top" v-model="comfirmDialog" title="" @confirm="cancelFingerprint()" @cancel="()=>{this.comfirmDialog = false}" :show-cancel-button="true"></u-modal>
	</view>
</template>

<script>
	import fingerprint from '../../components/fingerprint.vue'
	export default {
		name: 'usingSetting',
		components: {fingerprint},
		data() {
			return {
				height: 25,
				bgColor: '#f8f8f8',
				top: 400, //弹框偏移量
				hideBalance: uni.getStorageSync('hideBalance') || false, //是否隐藏余额
				result: "", //禁用开关原因
				disabled: true, //是否禁用开关
				fingerprintFlag: uni.getStorageSync('fingerprintIdentification') || false,
				comfirmDialog: false, //取消指纹识别确认弹框
			}
		},
		onLoad() {
			//提前判断设备是否可使用指纹功能，不可使用则禁止按钮选择
			
			// #ifdef APP-PLUS
			if (!plus.fingerprint.isSupport()) {
				this.result = '此设备不支持指纹识别';
				this.disabled = true;
			}
			else if (!plus.fingerprint.isKeyguardSecure()) {
				this.result = '此设备未设置密码锁屏，无法使用指纹识别';
				this.disabled = true;
			}
			else if (!plus.fingerprint.isEnrolledFingerprints()) {
				this.result = '此设备未录入指纹，请到设置中开启';
				this.disabled = true;
			}
			else {
				// this.result = '此设备支持指纹识别';
				this.disabled = false;
			}
			// #endif
			// #ifdef MP-WEIXIN
			this.disabled = false;
			this.result = '请在微信真机中使用，模拟器不支持';
			// #endif
			// #ifndef APP-PLUS || MP-WEIXIN
			this.result = '此平台不支持指纹识别';
			// #endif
		},
		watch: {
			//显示隐藏余额
			hideBalance(newVal) {
				if (newVal) {
					uni.setStorageSync('hideBalance', true)
				} else {
					uni.removeStorageSync('hideBalance')
				}
			}
		},
		mounted(){
			document.querySelector('uni-page-wrapper').style.background = '#F7F7F7';
			document.querySelector('uni-page').style.background = '#F7F7F7';
			document.querySelector('uni-page-body').style.background = '#F7F7F7';
		},
		methods: {
			//反馈校验是否成功
			identifySuccess(val) {
				if (val) {
					uni.setStorageSync('fingerprintIdentification', true)
					this.fingerprintFlag = val
				}
			},
			//切换指纹验证开关处理
			estimateStatus(val) {
				this.fingerprintFlag = !val
				if (val) {
					// Android平台手动弹出等待提示框 
					if ('Android' === plus.os.name) {
						this.$refs.fingerprintNav.showDialog() //指纹识别弹框展示
					}
					this.$refs.fingerprintNav.fingerprint() //指纹识别方法调用
				} else {
					this.comfirmDialog = true
				}
			},
			//成功取消指纹验证
			cancelFingerprint() {
				uni.removeStorageSync('fingerprintIdentification')
				plus.nativeUI.toast('关闭指纹识别成功');
				this.comfirmDialog = false
				this.fingerprintFlag = false
			}
		},
	}
</script>

<style lang="scss">
	.usingSetting {
		.walletName{
			padding: 60rpx 40rpx;
			display: flex;
			justify-content: center;
		}
	}
</style>
