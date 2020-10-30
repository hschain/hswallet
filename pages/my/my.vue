<template>
	<view class="my cellContainer">
		<view class="greenContainer cellMark"  @click="navigate('../transfer/address')">
			<view class="containerWrap circle">
				<view class="boxLeft">
					<image class="leftImg" src="../../static/my/myBook.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title greenFont">
							地址本
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/common/greenArrow.png" mode=""></image>						
					</view>
				</view>
			</view>
		</view>
		
		<view class="greenContainer cellMark" @click="navigate('../usingSetting/usingSetting')">
			<view class="containerWrap circle">
				<view class="boxLeft">
					<image class="leftImg" src="../../static/my/management.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title greenFont">
							使用设置
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/common/greenArrow.png" mode=""></image>						
					</view>
				</view>
			</view>
		</view>
		
		<!-- <view class="gap"></view> -->
		
		<view class="greenContainer cellMark" @click="info">
			<view class="containerWrap circle">
				<view class="boxLeft">
					<image class="leftImg" src="../../static/my/help.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title greenFont">
							帮助与反馈
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/common/greenArrow.png" mode=""></image>						
					</view>
				</view>
			</view>
		</view>
		
		<view class="greenContainer cellMark" @click="info">
			<view class="containerWrap circle">
				<view class="boxLeft">
					<image class="leftImg" src="../../static/my/agreement.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title greenFont">
							用户协议
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/common/greenArrow.png" mode=""></image>						
					</view>
				</view>
			</view>
		</view>
		
		<view class="greenContainer cellMark" @click="navigate('../about/about')">
			<view class="containerWrap circle">
				<view class="boxLeft">
					<image class="leftImg" src="../../static/my/about.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title greenFont">
							关于我们
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/common/greenArrow.png" mode=""></image>						
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'my',
		data() {
			return {

			}
		},
		methods: {
			navigate(url) {
				uni.navigateTo({url})
			},
			info() {
				// #ifdef APP-PLUS
				plus.nativeUI.toast('敬请期待')
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	.my {
	}
</style>