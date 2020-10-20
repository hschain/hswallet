<template>
	<view class="my cellContainer">
		<view class="greenContainer cellMark"  @click="navigate('../transfer/address')">
			<view class="containerWrap circle">
				<view class="boxLeft">
					<image class="leftImg" src="../../static/common/myBook.png" mode=""></image>
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
					<image class="leftImg" src="../../static/common/management.png" mode=""></image>
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
	</view>
</template>

<script>
	export default {
		name: 'my',
		data() {
			return {
				height: 25,
				bgColor: '#333'
			}
		},
		methods: {
			navigate(url) {
				uni.navigateTo({url})
			}
		}
	}
</script>

<style lang="scss">
	.my {
	}
</style>