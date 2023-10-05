<template>
	<view class="">
		
	</view>
</template>

<script>
	
	export default {
		components: {
			
		},
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mid: uni.getStorageSync('mid'),
			}
		},
		onReady() {
		
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	@import 'aSet.scss'
</style>
