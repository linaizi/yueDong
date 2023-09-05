<template>
	<view class="mineBox">
		<uni-nav-bar statusBar="true" backgroundColor="rgba(0,0,0,0)" title="我的"></uni-nav-bar>
		
		<view class="top">
			<view class="top-lt">
				<image class="headImg" :src="UserInfo.avatar ? UserInfo.avatar : '../../static/img/logo.jpg'"></image>
				 <p>立即登录</p>
			</view>
			<view class="top-rt">设置</view>
		</view>
		
		<Tabbar :id="4"></Tabbar>
	</view>
</template>

<script>
	import Tabbar from "@/components/tabbar/tabbar.vue"
	export default {
		components: {
			Tabbar,
		},
		data() {
			return {
				Token: this.$store.state.Token,
				UserInfo:{},
			}
		},
		onReady() {
		
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	@import 'mine.scss'
</style>
