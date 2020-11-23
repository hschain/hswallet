<template>
	<view class="showQrCode">
		<image class="img" :src="imgText" mode=""></image>
	</view>
</template>

<script>
	export default {
		name: 'qrCode',
		props: ['imgText']
	}
</script>

<style lang="scss">
	$dborder_width: 12rpx;
	.showQrCode {
		z-index: 100;
		position: relative;
		padding: 20rpx;
		border: $dborder_width/2 solid #d6dadc;
		width: calc(#{$dborder_width} + 440rpx);
		height: calc(#{$dborder_width} + 440rpx);
		.img {
			position: relative;
			z-index: 101;
			width: 400rpx;
			height: 400rpx;
		}
		&:before {
			position: absolute;
			transform: translate(-50%, -50%);
			left: 50%;
			top: 50%;
			z-index: 99;
			width: calc(101% + #{$dborder_width});
			height: calc(80% + #{$dborder_width});
			background: #fff;
			content: "";
		}
		&:after {
			position: absolute;
			transform: translate(-50%, -50%);
			left: 50%;
			top: 50%;
			z-index: 99;
			width: calc(80% + #{$dborder_width});
			height: calc(101% + #{$dborder_width});
			background: #fff;
			content: "";
		}
	}
</style>
