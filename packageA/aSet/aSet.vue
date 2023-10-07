<template>
	<view class="">
		<!-- https://file.hanwenliang.love/file/d884200d-c3dc-4864-afc3-d7d476c9099b.jpg -->
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
