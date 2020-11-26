<template>
	<view class="my">
		<view class="cellMark"  @click="navigate('../transfer/address')" style="margin-top:48rpx">
			<view class="circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/my/me_address.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title">
							地址本
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/common/arrow_right.png" mode=""></image>						
					</view>
				</view>
			</view>
		</view>
		
		<view class=" cellMark" @click="navigate('../usingSetting/usingSetting')" style="margin-bottom:32rpx">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/my/me_setting.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title ">
							使用设置
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/common/arrow_right.png" mode=""></image>						
					</view>
				</view>
			</view>
		</view>
		
		<!-- 快速生成内容间隔 -->
		<!-- <view class="gap"></view> -->
		
		<view class=" cellMark" @click="info">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/my/me_help.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title ">
							帮助与反馈
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/common/arrow_right.png" mode=""></image>						
					</view>
				</view>
			</view>
		</view>
		
		<view class=" cellMark" @click="info">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/my/me_protocol.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title ">
							用户协议
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/common/arrow_right.png" mode=""></image>						
					</view>
				</view>
			</view>
		</view>
		
		<view class=" cellMark" @click="navigate('../about/about')">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/my/me_about.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title ">
							关于我们
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/common/arrow_right.png" mode=""></image>						
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
		// mounted(){
		// 	document.querySelector('uni-page-wrapper').style.background = '#F7F7F7';
		// 	document.querySelector('uni-page').style.background = '#F7F7F7';
		// 	document.querySelector('uni-page-body').style.background = '#F7F7F7';
		// },
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
<style >
	page,html{
		background: #F7F7F7;
	}
</style>
<style lang="scss">
	.my {
		.leftIcon{
			width: 44rpx;
			height: 44rpx;
			margin-right: 32rpx;
		}
	}
</style>