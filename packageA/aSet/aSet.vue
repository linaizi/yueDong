<template>
	<view class="">
		
	</view>
</template>

<script>
	import { AsettingList,AsettingEdit } from '@/api/page/manage.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
			}
		},
		onReady() {
			this.initData()
		},
		methods: {
			initData(){
				AsettingList().then((res) => {
					if(res.code == 200){
						
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import 'aSet.scss'
</style>
