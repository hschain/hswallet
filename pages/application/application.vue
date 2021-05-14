<template>
	<view class="application ">
		<view class="cellMark"  @click="onBrowser('https://scan.hschain.io/#/dashboard')" :style="{marginTop:'48rpx'}">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/svg/ecology_browser.svg" mode=""></image>
					<view class="leftWrapper">
						<!-- https://scan.hschain.io/#/dashboard -->
						<view class="title">
							HSC区块链浏览器
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/svg/arrow_right.svg" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		<view class="margin cellMark"  @click="onBridge">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon bridge-icon" src="../../static/application/bridge.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title ">
							资产跨链
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/svg/arrow_right.svg" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		<view class="margin cellMark"  @click="info">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/svg/ecology_coin.svg" mode=""></image>
					<view class="leftWrapper">
						<view class="title ">
							一键发币
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/svg/arrow_right.svg" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		<view class=" cellMark"  @click="info">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/svg/ecology_district.svg" mode=""></image>
					<view class="leftWrapper">
						<view class="title ">
							链上商圈
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/svg/arrow_right.svg" mode=""></image>						
					</view>
				</view>
			</view>
		</view>
		<view class=" cellMark"  @click="info">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/svg/ecology_mall.svg" mode=""></image>
					<view class="leftWrapper">
						<view class="title ">
							链上商城
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/svg/arrow_right.svg" mode=""></image>						
					</view>
				</view>
			</view>
		</view>
		<view class="cellMark"  @click="info">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/svg/ecology_life.svg" mode=""></image>
					<view class="leftWrapper">
						<view class="title ">
							链上生活
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/svg/arrow_right.svg" mode=""></image>						
					</view>
				</view>
			</view>
		</view>
		<view class=" cellMark"  @click="info">
			<view class=" circle">
				<view class="boxLeft">
					<image class="leftIcon" src="../../static/svg/ecology_game.svg" mode=""></image>
					<view class="leftWrapper">
						<view class="title ">
							链上游戏
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/svg/arrow_right.svg" mode=""></image>						
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
			},
			onBrowser(url) {
				uni.navigateTo({
					url: '/pages/browser/browser?url=' + url
				})
			},
			onBridge(){
				uni.navigateTo({
					url: '/pages/bridge/bridge'
				})
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
		.bridge-icon{
			height: 48rpx;
		}
		.msg {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80vh;
		}
	}
</style>
