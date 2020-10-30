<template>
	<view class="about">
		<view class="headerLogo">
			<image class="logo" src="../../static/common/logo.png" mode=""></image>
			<view class="title">
				HSWallet
			</view>
			<view class="version">
				{{version}}
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
		
		<updateTip  ref="updateTipNav" :formMain="false"></updateTip>
	</view>
</template>

<script>
	import updateTip from '../../components/updateTip.vue'
	export default {
		name: 'about',
		components: { updateTip },
		data() {
			return {
				version: '', //当前app版本
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
				this.version = 'v' + plus.runtime.version
			// #endif
		},
		methods: {
			checkUpdate() {
				uni.showLoading({
					title: '检查版本更新中',
				})
				let platform = ''
				let version = ''
				// #ifdef APP-PLUS
				plus.os.name === 'Android' ? platform = 'Android' : platform = 'Ios'
				version = 'v' + plus.runtime.version
				// #endif
				this.$u.api.getVersion({
					address: uni.getStorageSync('userAddress'),
					version,
					app: 'HSWallet',
					platform
				}).then(res => {
					//保存最新版本信息，打开版本更新t提示
					this.$store.commit('SAVE_UPDATE_RES', res)
					this.$refs.updateTipNav.showDialog()
				}).finally(() => {
					uni.hideLoading()
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