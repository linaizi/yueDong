<template>
     <view class="page-main">
				<!-- 腾讯地图Api  key:腾讯地图key -->
				<web-view src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=PBZBZ-74CE3-7ND3P-3OVWM-HDZIT-QRF23&referer=myapp"  @message="aaa"></web-view>
		</view>
		
</template>


<script>
	export default {
		data() {
			return {
				
			}
		},
		onReady() {
		
		},
		methods: {
			aaa(a){
				console.log(a)
			}
		}
	}
</script>

<style lang="scss" scoped>
    .page-main {
        width: 100%;
        height: 100vh;
    }
</style>