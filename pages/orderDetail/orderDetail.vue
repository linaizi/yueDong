<template>
	<view class="allBg">
		<view class="odBg">
			<view class="od-zt"><uni-icons type="info" size="24" color="#fff"></uni-icons><span class="ml10">已取消</span></view>
		</view>
		
		<view class="od-main">
			<view class="odBox">
				<view class="od-adr">
					<uni-icons type="location" size="28" color="#333333"></uni-icons>
					<view class="adr-rt">
						<view class="rt-name">小明 <span>13411112222</span></view>
						<p>广东省广州市天河区五山路483号华南农业大学 201</p>
					</view>
				</view>
				<view class="od-title">
					<view class="title-lt">发货方式</view>
					<view class="title-rt">上门取送</view>
				</view>
				<view class="od-title">
					<view class="title-lt">预约上门取鞋时间</view>
					<view class="title-rt">9月6日(周三)13:30-14:00</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	
	export default {
		components: {
			
		},
		data() {
			return {
				
			}
		},
		onReady() {
		
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	@import 'orderDetail.scss'
</style>
