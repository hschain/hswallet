<template>
	<view class="updateTip">
		<u-modal 
			:negative-top="top" 
			v-model="updateDialog"
			title=""
			:content="newestUpdate ? '已是最新版本' : '检测到最新版本，是否更新？'"
			:show-cancel-button="!newestUpdate"
			cancel-text="稍后更新"
			:mask-close-able="true"
			@confirm="confirm"
			@cancel="updateDialog = false"
		>
		</u-modal>
	</view>
</template>

<script>
	export default {
		name: 'updateTip',
		props: {
			newestUpdate: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				updateDialog: false, //检测更新弹框
				top: 0, //弹框偏移量
				downloadUrl: ''
			}
		},
		methods: {
			confirm() {
				this.newestUpdate ? this.updateDialog = false : plus.runtime.openURL(this.downloadUrl)
			},
			//显示弹框
			showDialog() {
				this.updateDialog = true
			}
		}
	}
</script>

<style lang="scss">
	.updateTip {

	}
</style>
