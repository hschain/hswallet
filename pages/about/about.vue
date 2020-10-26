<template>
	<view class="about">
		<view class="headerLogo">
			<image class="logo" src="../../static/common/logo.png" mode=""></image>
			<view class="title">
				HSWallet
			</view>
			<view class="version">
				v {{version}}
			</view>
		</view>
		
		<view class="purpleContainer cellMark" @click="navigate('../log/log')">
			<view class="containerWrap circle">
				<view class="boxLeft">
					<view class="leftWrapper">
						<view class="title purpleFont">
							版本日志
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightImg" src="../../static/common/purpleArrow.png" mode=""></image>						
					</view>
				</view>
			</view>
		</view>
		
		<view class="purpleContainer cellMark" @click="checkUpdate">
			<view class="containerWrap circle">
				<view class="boxLeft">
					<view class="leftWrapper">
						<view class="title purpleFont">
							版本更新
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="gap"></view>
		
		<u-link href="https://www.hschain.io/">
			<view class="greenContainer cellMark">
				<view class="containerWrap circle">
					<view class="boxLeft">
						<view class="leftWrapper">
							<view class="title greenFont">
								网站
							</view>
						</view>
					</view>
					<view class="boxRight">
						<view class="rightWrapper greenFont">
							https://www.hschain.io/
						</view>
					</view>
				</view>
			</view>			
		</u-link>
		
		<updateTip  ref="updateTipNav" :newestUpdate="newestUpdate"></updateTip>
	</view>
</template>

<script>
	import updateTip from '../../components/updateTip.vue'
	export default {
		name: 'about',
		components: { updateTip },
		data() {
			return {
				version: '1.0.0',
				newestUpdate: false, //是否为最新版本
			}
		},
		methods: {
			checkUpdate() {
				uni.showLoading({
					title: '检查版本更新中',
				})
				let platform = ''
				// #ifdef APP-PLUS
				window.plus.os.name === 'Android' ? platform = 'Android' : platform = 'ios'
				// #endif
				this.$u.api.getVersion({
					app: 'HSWallet',
					platform
				}).then(res => {
					uni.hideLoading()
					this.newestUpdate = true
					this.$refs.updateTipNav.showDialog()
				})
			},
			navigate(url) {
				uni.navigateTo({url})
			},
		}
	}
</script>

<style lang="scss">
	.about {
		margin: 0 5vw;
		.headerLogo {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 60rpx 0 40rpx;
			.logo {
				width: 100rpx;
				height: 100rpx;
			}
			.title {
				font-size: 40rpx;
				margin: 30rpx 0 20rpx;
			}
			.version {
				color: #aaa;
			}
		}
	}
</style>