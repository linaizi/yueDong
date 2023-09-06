<template>
	<view class="allBg">
		<view :style="{ height: iStatusBarHeight + 'px'}"></view>
		<!-- <商品轮播图 -->
		<view class="uni-padding-wrap">
			<swiper class="swiper" indicator-dots="false32qa" indicator-active-color="#E85268"
				indicator-color="rgba(232,82,104,0.3)" :autoplay="autoplay" :interval="interval" :duration="duration"
				circular="true" @change='swiperChange'>
				<block v-for="(item,index) in goodsUrls" :key="index">
					<swiper-item>
						<view class="swiperBox">
							<image :src="item" :data-src="item" class="bannerImg" @click="getImgIndex(index)"></image>
						</view>
					</swiper-item>
				</block>
			</swiper>
			<view class="swiperMsg" v-if="isShowMsg">
				<view class="numbox">{{swiperIndex+1}}/{{goodsUrls.length}}</view>
				<image :src="FILE_BASE_URL + '/20211227173426325'" @click="xzImg(0)" class="picDowload">
				</image>
			</view>
		</view>
	</view>
</template>

<script>
	import Swiper from "@/components/swiper/swiper.vue"
	import Ppcar from "@/components/ppcar/ppcar.vue"
	import { priceHander } from '@/common/tool.js'
	export default {
		components: {
			Swiper,
			Ppcar
		},
		data() {
			return {
				iStatusBarHeight: 0,
				
				swpArr: [
					"../../static/img/good1.png",
					"../../static/img/swiper2.jpg",
					"../../static/img/swiper3.png",
				],
			}
		},
		onLoad(option) {
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		},
		
		methods: {
			priceHander
		}
	}
</script>

<style lang="scss" scoped>
	@import 'productDetails.scss'
</style>
