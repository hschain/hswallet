<template>
	<view class="application cellContainer">
		<view class="greenContainer cellMark"  @click="info">
			<view class="containerWrap circle">
				<view class="boxLeft">
					<image class="leftImg" src="../../static/application/issuing.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title greenFont">
							一键发币
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
		<view class="greenContainer cellMark"  @click="info">
			<view class="containerWrap circle">
				<view class="boxLeft">
					<image class="leftImg" src="../../static/application/tradingArea.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title greenFont">
							链上商圈
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
		<view class="greenContainer cellMark"  @click="info">
			<view class="containerWrap circle">
				<view class="boxLeft">
					<image class="leftImg" src="../../static/application/chainStore.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title greenFont">
							链上商城
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
		<view class="greenContainer cellMark"  @click="info">
			<view class="containerWrap circle">
				<view class="boxLeft">
					<image class="leftImg" src="../../static/application/chainLife.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title greenFont">
							链上生活
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
		<view class="greenContainer cellMark"  @click="info">
			<view class="containerWrap circle">
				<view class="boxLeft">
					<image class="leftImg" src="../../static/application/chainGame.png" mode=""></image>
					<view class="leftWrapper">
						<view class="title greenFont">
							链上游戏
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
		name: 'application',
		data() {
			return {

			}
		},
		methods: {
			info() {
				plus.nativeUI.toast('敬请期待')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.application {
		.msg {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80vh;
		}
	}
</style>
