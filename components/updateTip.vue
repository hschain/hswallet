<template>
	<view class="updateTip">
		<u-modal 
			:negative-top="top" 
			v-model="updateDialog"
			title=""
			:content="content"
			:show-cancel-button="!newestUpdate"
			:cancel-text="synchronization ? '取消' : '稍后更新'"
			:mask-close-able="true"
			@confirm="confirm"
			@cancel="cancel"
		>
		</u-modal>
	</view>
</template>

<script>
	export default {
		name: 'updateTip',
		props: {
			formMain: { //是否从主页打开的更新弹框
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				updateDialog: false, //检测更新弹框
				top: 0, //弹框偏移量
				newestUpdate: true,
				version: '', //当前app版本
				synchronization: false, //是否强制更新
				content: '', //弹框提示
				downloadUrl: '' , //下载链接
				updateRes: {}, //从后端返回的版本更新结果
			}
		},
		methods: {
			//点击确认时，处理逻辑
			confirm() {
				this.newestUpdate ? this.updateDialog = false : plus.runtime.openURL(this.downloadUrl)
			},
			//点击取消时，处理逻辑
			cancel() {
				if (!this.synchronization) {
					this.updateDialog = false
				} else {
					//强制更新时，点击取消则直接退出app
					plus.runtime.quit()
				}
			},
			//显示弹框
			showDialog() {
				// #ifdef APP-PLUS
					this.version = 'v' + plus.runtime.version
				// #endif
				this.updateRes = this.$store.state.updateRes
				this.version === this.updateRes.data.version ? this.newestUpdate = true : this.newestUpdate = false
				this.synchronization = this.updateRes.data.synchronization
				this.downloadUrl = this.updateRes.data.url
				this.newestUpdate ? this.content = '已是最新版本' : this.synchronization ? this.content = '您的版本过低，请更新到最新版本！' : this.content = '检测到最新版本，是否更新？'
				this.updateDialog = true
			}
		}
	}
</script>

<style lang="scss">
	.updateTip {

	}
</style>
