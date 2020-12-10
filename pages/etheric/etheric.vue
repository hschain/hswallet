<template>
    <view >
		<!-- <view class="top"></view> -->
        <web-view :src="url" :webview-styles="{'margin-top':'40px'}"></web-view>
    </view>
</template>
<script>
let _self
	export default {
		data() {
			return {
				url: '',
			}
		},
		onLoad(options) {
			this.url = options.url;
			_self = this;
        	_self.getSystemStatusBarHeight();
		},
		methods: {
			getSystemStatusBarHeight:function(){
				var height = plus.navigator.getStatusbarHeight();
				_self.barHeight = height;
				_self.barHeight = 0;
			},
		}
	}
</script>

<style lang="scss">
	// .top{
	// 	width: 100%;
	// 	height: 40px;
	// }
</style>
