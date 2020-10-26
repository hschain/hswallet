<template>
	<view class="log">
		<view v-for="(item, index) in logData" :key="index + 'log'" class="logContainer">
			<view class="title">
				<text>{{item.version + ' ( ' + item.time + ' )'}}</text>
			</view>
			<view class="content">
				<view class="value">{{item.title}}</view>
				<view class="contentItem" v-for="(value, idx) in item.list" :key="idx + 'list'">
					{{value}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'log',
		data() {
			return {
				logData: [
					{
						version: '1.0.0',
						time: '2020.10.22',
						title: 'APP开放测试，功能如下:',
						list: ['新增助记词备份验证功能', '界面风格改变', '更多优化与修复']
					},
					{
						version: '1.0.0',
						time: '2020.10.22',
						title: '新增助记词备份验证功能, 界面风格改变, 更多优化与修复,新增助记词备份验证功能, 界面风格改变, 更多优化与修复',
						list: []
					},
					{
						version: '1.0.0',
						time: '2020.10.22',
						title: 'APP开放测试，功能如下:',
						list: ['新增助记词备份验证功能', '界面风格改变', '更多优化与修复']
					},
					{
						version: '1.0.0',
						time: '2020.10.22',
						title: 'APP开放测试，功能如下:',
						list: ['新增助记词备份验证功能', '界面风格改变', '更多优化与修复']
					},
					{
						version: '1.0.0',
						time: '2020.10.22',
						title: 'APP开放测试，功能如下:',
						list: ['新增助记词备份验证功能', '界面风格改变', '更多优化与修复']
					},
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.log {
		padding-top: 40rpx;
		.logContainer {
			padding: 0rpx 5vw 80rpx;
			.title {
				font-size: 40rpx;
				margin-bottom: 40rpx;
			}
			.content {
				.value {
					margin-bottom: 30rpx;
				}
				.contentItem {
					margin: 10rpx 0 0 30rpx;
				}
			}
		}
	}
</style>