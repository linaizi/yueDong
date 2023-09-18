<template>
	<view class="allBg">
		<view class="stl-btn">手动定位</view>
		<p class="stl-p" v-if="isAddr">前端运行日志，请另行在小程序开发工具的控制台查看</p>
		
		<view class="mt20">
			<view class="stl-item">
				<image src="../../static/img/logo.jpg" mode="" class="item-img"></image>
				<view class="item-mid">
					<p class="mid-t">校园通代收点</p>
					<p class="mid-p">电话: 13826193419</p>
					<p class="mid-p">距离: 86.12km</p>
				</view>
				<view class="item-rt">
					<uni-icons type="paperplane" size="56rpx" color="#4B97FE"></uni-icons>
					<p class="rt-p">一键导航</p>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isAddr:false,
			}
		},
		onReady() {
		
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	@import 'storeList.scss'
</style>
