<template>
	<view class="application ">
		<view class="cellMark"  @click="info" :style="{marginTop:'48rpx'}">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/application/ecology_browser.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title">
							HSC区块链浏览器
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
		<view class="margin cellMark"  @click="info">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/application/ecology_coin.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title ">
							一键发币
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
		<view class=" cellMark"  @click="info">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/application/ecology_district.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title ">
							链上商圈
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
		<view class=" cellMark"  @click="info">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/application/ecology_mall.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title ">
							链上商城
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
		<view class="cellMark"  @click="info">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/application/ecology_life.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title ">
							链上生活
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
		<view class=" cellMark"  @click="info">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/application/ecology_game.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title ">
							链上游戏
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
		name: 'application',
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
			info() {
				plus.nativeUI.toast('敬请期待')
			}
		}
	}
</script>
<style>
	page,html{
		background:#F7F7F7;
	}
</style>
<style lang="scss" scoped>
	.margin{
		margin: 32rpx 0;
	}
	.application {
		.leftIcon{
			width: 44rpx;
			height: 44rpx;
			margin-right: 32rpx;
		}
		.msg {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80vh;
		}
	}
</style>
