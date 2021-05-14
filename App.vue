<script>
	const unorm = require('./unorm.js')
	
	export default {
		onLaunch: function() {
			
			// #ifdef APP-PLUS
				plus.nativeUI.setUIStyle('dark')
			// #endif
			// 测试home页面时使用
			// uni.removeStorage({
			// 	key: 'mnemonicData'
			// })
			// uni.removeStorage({
			// 	key: 'account'
			// })
			if (!uni.getStorageSync('localPw')) {
				uni.removeStorageSync('account')
				uni.removeStorageSync('userAddress')
				uni.redirectTo({
					url: './pages/home/home'
				})
			}
		},
		onShow: function() {
			
		},
		onHide: function() {
		
		},
		onError:function(err) {
			var pages = getCurrentPages();
			let pageRoute="";
			if(pages.length>0)
			{
				var page = pages[pages.length - 1];
				// #ifdef APP-PLUS
					var currentWebview = page.$getAppWebview();
					 pageRoute=currentWebview.__uniapp_route;
				// #endif
				// var currentWebview = page.$getAppWebview();
				//  pageRoute=currentWebview.__uniapp_route;
			}
			
			 let log = {  
			     message: err.message,  
			     stack: err.stack,
				 route:pageRoute
			 }  
			 uni.showModal({
			 	content:JSON.stringify(log)
			 })
			 
			 let crashTool=uni.requireNativePlugin("CL-CrashTool");
			 if(crashTool)
			 {
				crashTool.sendReportException(JSON.stringify(log));	 
			 }
			 	  
		},
		beforeDestroy() {
			this.$store.dispatch('websocketClose', "wss://testnet.hschain.io/api/v1/ws")
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "./common/css/iconfont.css"; //自定义icon，参考https://www.uviewui.com/guide/customIcon.html
	@import "uview-ui/index.scss";
	@import './common/css/common.scss';
	@font-face{
	  font-family: 'gilroy-bold';
	  src:url('~@/static/font/gilroy-bold-4.otf');
	  font-weight: normal;
	  font-style: normal;
	}
	@font-face{
	  font-family: 'gilroy-regular';
	  src:url('~@/static/font/gilroy-regular-3.otf');
	  font-weight: normal;
	  font-style: normal;
	}
	:root {
		--mainColor: #020e46;
	}
	.uni-tabbar__label {
		font-size: 28rpx !important;
	}
	// .u-line-1 {
	// 	background: linear-gradient(117deg, #77ff9b 0%, #26feff 100%);
	// 	-webkit-background-clip: text;
	// 	-webkit-text-fill-color: transparent;
	// }
	.u-cell-item-box {
		background-color: transparent !important;
	}
	// .u-border-bottom:after, .u-border-left:after, .u-border-right:after, .u-border-top-bottom:after, .u-border-top:after, .u-border:after {
	// 	border: 0 solid rgba(236, 238, 255, 0.5)
	// }
	// .u-gab {
	// 	background-color: #333 !important
	// }
	// .u-actionsheet-cancel {
	// 	color: #999 !important;
	// }
	// .u-drawer-bottom {
	// 	background-color: #000 !important;
	// 	border-top: 2rpx solid rgba(236, 238, 255, 0.3) !important;
	// 	padding: 0 60rpx !important;
	// }
	body,html {
	  // line-height: 1;
	  font-weight: 500;
	   font-family:arial, 'PingFang SC','SimHei', 'STHeitiSC-Light', 'Helvetica-Light', monospace, sans-serif, Times New Roman;
	  //font-family: 'content-font';
	  background: #fff;
	}
	page {
		color: #fff;
		// background-color: #000;
	}
</style>
