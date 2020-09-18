<template>
	<view class="hs_menu">
		<view v-for="(item, i) in data " :key="i" class="">
			<view class="menu_item" @click="changeIndex(item)" :class="item.value === active ? 'active' : ''">
				{{item.name}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'HsNavMenu',
		props: {
			data: {
				type: Array,
				default: []
			},
			activeIndex: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				active: ''
			}
		},
		created() {
			this.active = this.activeIndex
		},
		methods: {
			changeIndex(item) {
				this.active = item.value
				this.$emit('changeIndex', this.active)
			}
		}
	}
</script>

<style lang="scss">
	.hs_menu {
		display: flex;
		justify-content: space-between;
		.menu_item {
			font-size: 32rpx;
			padding: 30rpx 50rpx;
			color: #909399;
		}
		.active {
			border-bottom: 2px solid rgb(193, 153, 108);
			color: rgb(193, 153, 108);
		}
	}
</style>
