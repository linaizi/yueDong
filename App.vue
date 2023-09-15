<script>
	import Vue from 'vue'
	export default {
		name: 'app',
		globalData: {// 全局设置
			statusBarH: 0,
			customBarH: 0,
			isIphoneX:null,
		},
		
		data() {
			return {
			}
		},
		onLaunch: function() {
			uni.getSystemInfo({
				success: (e) => {
					console.log('小程序客户端基础库版本:',e.hostSDKVersion)
					// this.globalData.pmB = e.screenWidth/ 750;		//屏幕比例 = 手机屏幕宽度/750
					// console.log('页面获取屏幕比',getApp().globalData.pmB)
					
					// 获取手机状态栏高度
					let statusBar = e.statusBarHeight
					let customBar
			
					// #ifndef MP
					customBar = statusBar + (e.platform == 'android' ? 50 : 45)
					// #endif
			
					// #ifdef MP-WEIXIN
					// 获取胶囊按钮的布局位置信息
					let menu = wx.getMenuButtonBoundingClientRect()
					// 导航栏高度 = 胶囊下距离 + 胶囊上距离 - 状态栏高度
					customBar = menu.bottom + menu.top - statusBar
					// #endif
			
					// #ifdef MP-ALIPAY
					customBar = statusBar + e.titleBarHeight
					// #endif
			
					// 注意：此方法不支持原生Nvue页面
					Vue.prototype.statusBarH = statusBar
					Vue.prototype.customBarH = customBar
			
					// 支持nvue页面写法（兼容H5/小程序/APP/APP-Nvue）
					this.globalData.statusBarH = statusBar
					this.globalData.customBarH = customBar
					
					let model = ['X', 'XR', 'XS', '11', '12', '13', '14', '15'];
					 model.forEach(item => {
						 //适配iphoneX以上的底部，给tabbar一定高度的padding-bottom
						 if(e.model.indexOf(item) != -1 && e.model.indexOf('iPhone') != -1) {
							  _self.globalData.isIphoneX = true
						 }
					})
					
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			 
		 },
	}
</script>

<style lang="scss">
	/*每个页面公共css */
</style>
