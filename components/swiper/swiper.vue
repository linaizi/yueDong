<!-- 首页轮播组件 -->
<template>
	<view class="content">
		<swiper class="swiper" 
		:indicator-dots="indicatorDots"
		:autoplay="autoplay" 
		:interval="interval" 
		indicator-color="rgba(255,255,255,0.67)" 
		indicator-active-color="#FFFFFF" 
		:duration="duration" 
		circular="true"
		>
				<swiper-item v-for="(item,index) in dataInfo" :key="index" >
						<image :src="item" mode="widthFix"></image>
				</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default{
		props:{
			dataInfo:{
				type:Array,
				default(){
					return []
				}
			},
		},
		data(){
			return{
				indicatorDots: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
			}
		},
		
		watch: {
			dataInfo: {
				handler(n, o){			
				},
				deep:true,
				immediate:true
			}
		},
		
		methods:{
		},
	
	}
</script>

<style lang="scss" scoped>
	.content{
	}
	.swiper{
		width:100%;
		overflow: hidden;
		height: 350upx;
	}
	.swiper image{
		width:100%;
	}
</style>
