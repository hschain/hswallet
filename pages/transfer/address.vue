<template>
	<view class="address">
		<u-empty v-show="!addrList.length" margin-top="300" text="暂无数据" mode="list"></u-empty>
		
		<view v-show="addrList.length" class="greenContainer">
			<view class="containerWrap">
				<u-cell-group class="tableList">
					<u-cell-item v-for="(item, index) in addrList" :key="index" @click="choose(index)" :arrow="false" :label="item.description" :value="fliterAddr(item.addr)" :title="item.name" :title-style="{color: '#fff'}" hover-class="none">
						<u-image class="addrImg" slot="icon" width="60" height="60" src="../../static/common/logo.png" shape="circle" :fade="false"></u-image>
					</u-cell-item>
				</u-cell-group>
			</view>
		</view>

		<u-modal v-model="delWarning" :content="'确定要删除'+(addrList.length ? addrList[showIndex].name : '')+'的信息?'" @confirm="delItem" @cancel="()=>delWarning = false" :show-cancel-button="true"></u-modal>
		
		<u-action-sheet @click="selectOption" :list="optionList" v-model="showActionSheet" :tips="{text: addrList.length ? addrList[showIndex].name : '', color: '#000', fontSize: 40}" :cancel-btn="true" border-radius="20"></u-action-sheet>
	</view>
</template>

<script>
	export default {
		name: 'addressBook',
		data() {
			return {
				addrList: [], //展示的数据
				route: '', //获取前一个路由的路径
				showIndex: 0, //点击目标内容的下标位置
				keyword: '', //搜索栏关键词
				optionList: [
					{
						text: '编辑',
						fontSize: 28,
						color: '#000'
					}, {
						text: '删除',
						fontSize: 28,
						color: '#000'
					}
				],
				delWarning: false, //删除确认弹框
				showActionSheet: false,
			}
		},
		onLoad() {
			// 获取入口地址
			let page = getCurrentPages()
			this.route = page[page.length - 2].route
		},
		onShow() {
			//获取地址本
			if (uni.getStorageSync('addressBook_' + uni.getStorageSync('userAddress'))) this.addrList = uni.getStorageSync('addressBook_' + uni.getStorageSync('userAddress'))
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({url: "newAddress"})
		},
		methods:{
			//裁剪地址
			fliterAddr (value) {
			  return value.slice(0, 8) + " … " + value.slice(-8);
			},
			//删除或编辑
			selectOption(index) {
				//index: 操作下标
				if(index === 0) { // 编辑
					uni.navigateTo({url: `newAddress?addrIndex=${this.showIndex}`})
				} else { // 删除
					this.delWarning = true
				}
			},
			//点击时根据不同入口做出动作
			choose(val) {
				if (this.route === 'pages/transfer/transfer') { //将数据返回到转账页面
					this.$store.dispatch('saveAddrData', this.addrList[val])
					this.addrList.unshift(this.addrList[val])
					this.addrList.splice(val+1, 1)
					uni.setStorageSync('addressBook_' + uni.getStorageSync('userAddress'), this.addrList)
					uni.navigateBack()
				} else { //换出侧边栏
					this.showIndex = val
					this.showActionSheet = true
				}
			},
			//删除所选内容
			delItem() {
				this.addrList.splice(this.showIndex, 1)
				uni.setStorageSync('addressBook_' + uni.getStorageSync('userAddress'), this.addrList)
				this.showIndex = -1
				this.delWarning = false
				uni.showToast({title: '删除成功'})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.address {
		font-size: 32rpx;
		margin: 0;		
		padding-top: 40rpx;
		// /deep/ .u-drawer-bottom {
		// 	background-color: #000;
		// 	border-top: 2rpx solid rgba(236, 238, 255, 0.3);
		// 	padding: 0 40rpx;
		// }
		
		.tableList {
			.addrImg {
				margin-right: 20rpx;
			}
		}
	}
</style>
