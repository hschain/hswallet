<template>
	<view class="about" >
		<view class="headerLogo">
			<image class="logo" src="../../static/svg/img_logo.svg" mode=""></image>
			<view class="title">
				HS Wallet
			</view>
			<view class="version">
				{{version}}
			</view>
		</view>
		
		<view class="clearBG cellMark" @click="navigate('../log/log')" style="position:absolute;top:700rpx;left:32rpx;" v-if="false">
			<view class="circle">
				<view class="boxLeft">
					<view class="leftWrapper">
						<view class="title marginLeft">
							版本日志
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightIcon" src="../../static/svg/arrow_right.svg" mode=""></image>						
					</view>
				</view>
			</view>
			<view class="boder"></view>
		</view>
		
		<view class="clearBG cellMark" @click="checkUpdate" style="position:absolute;top:800rpx;left:32rpx;">
			<view class=" circle">
				<view class="boxLeft">
					<view class="leftWrapper">
						<view class="title marginLeft">
							版本更新
						</view>
					</view>
				</view>
				<view class="boxRight">
					<view class="rightWrapper">
						<image class="rightIcon" src="../../static/svg/arrow_right.svg" mode=""></image>						
					</view>
				</view>
			</view>
			<view class="boder"></view>
		</view>
		
		<!-- <view class="gap"></view> -->
		
		<u-link href="https://www.hschain.io/">
			<view class="clearBG cellMark" style="position:absolute;top:900rpx;left:32rpx;">
				<view class=" circle">
					<view class="boxLeft">
						<view class="leftWrapper">
							<view class="title marginLeft">
								网站
							</view>
						</view>
					</view>
					<view class="boxRight">
						<view class="rightWrapper">
							https://www.hschain.io/
						</view>
					</view>
					<view class="boxRight">
						<view class="rightWrapper">
							<image class="rightIcon" src="../../static/svg/arrow_right.svg" mode=""></image>						
						</view>
					</view>
				</view>
				<view class="boder"></view>
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
				Height:790
			}
		},
		computed:{
			scrollerHeight(){
				if (this.Height<790) {
					return '790px'
				}else{
					return this.Height+'px'
				}
			}
		},
		onReady() {
			uni.getSystemInfo({
				success:  (res) => { 
					
					this.Height=res.windowHeight- uni.upx2px(25)+'px'
				}
			})
		},
		onLoad() {
			// #ifdef APP-PLUS
				this.version = 'v' + plus.runtime.version
			// #endif
		},
		mounted(){
			// document.querySelector('uni-page-body').style.background = "none";
			// document.querySelector('uni-page').style.background = "url('../../static/common/bg_taichi.png') no-repeat";
			// document.querySelector('uni-page').style.backgroundSize = "100%";
		},
		methods: {
			// 点击检测更新
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
	.clearBG{
		background: none;
	}
	.marginLeft{
		margin-left: 100rpx;
	}
	.about {
		min-height: 1636rpx;
		overflow: hidden;
		background: url('../../static/common/bg_taichi.png');
		background-size: 100% 100%;
		.rightIcon{
			width: 32rpx;
			height: 32rpx;
			margin-right: 120rpx;
		}
		.boder{
			width: 524rpx;
			height: 3rpx;
			background: #F3F3F7;
			position: absolute;
			left: 50%;
			transform: translate(-52%,0);
			bottom: 20rpx;
		}
		.headerLogo {
			display: flex;
			flex-direction: column;
			align-items: center;
			// margin: 60rpx 0 40rpx;
			position: absolute;
			top:360rpx;
			left: 50%;
			transform: translate(-50%,0);
			.logo {
				width: 100rpx;
				height: 100rpx;
			}
			.title {
				font-size: 40rpx;
				margin: 30rpx 0 20rpx;
				font-family: gilroy-bold;
			}
			.version {
				color: #aaa;
			}
		}
	}
</style>