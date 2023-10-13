<template>
	<view class="allBg">
		<view class="buyOk">
			<view class="bok-top">
				<image :src="FILE_BASE_URL + '/4a448fbc-b634-4d4b-8c73-12009d762cdb.png'" mode="widthFix" class="top-img"></image>
				<view class="top-txt1">订单提交完成</view>
				<view class="top-txt">￥{{totalMoney}}</view>
			</view>
			<view class="bok-foot">
				<view class="btn" @click="goUrl(1)">返回首页</view>
				<view class="btn btn1" @click="goUrl(0)">查看订单</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
	
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				totalMoney:null
			}
		},
		onLoad(option) {
			this.totalMoney = option.totalMoney;
		},
	
		methods: {
			goUrl(n){
				if(n==1){
					uni.switchTab({
					    url: '/pages/index/index'
					});
				}else{
					uni.redirectTo({
					    url: '/pages/myOrder/myOrder'
					});
				}
			},
			
		},
	
	}
</script>

<style lang="scss" scoped>
	@import 'buyOk.scss'
</style>
