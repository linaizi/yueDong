<template>
	<view class="allBg flexBox">
		 <view class="myCart-top">商品库存有限，请尽快下单  <p>编辑</p></view>
		 <scroll-view scroll-y="true" lower-threshold="50"
		 	@scrolltolower="scrollLower" 
		 	@scroll='fromTop' 
		 	:scroll-top="scrollTop"
		 	class="boxScroll scrollView"
		 	:refresher-enabled="isOpenRefresh"
		 	:refresher-triggered="triggered"
		 	@refresherpulling="onPulling"
		 	@refresherrefresh="onRefresh"
		 	@refresherrestore="onRestore"
		 	@refresherabort="onAbort" >
				
				<view class="goodsList">
					<view class="goodsItem" v-for="(item,index) in recommendArr" :key="index" >
						<image :src="item.img" class="goodsImg"></image>
						<view class="goodsMsg">
							<view class="goodsMsg-top">
								<h2 class="overflow2">{{item.name}}</h2>
								<view class="goods-sal">已售：{{item.sales}} 件</view>
							</view>
							<view class="goodsMsg-foot">
								<view class="foot-lf">
										<p>￥<span class="big">{{item.newprice}}</span>{{item.newprice}}</p>
										<p class="gray">￥{{item.oldprice}}</p>
								</view>
								<image class="foot-rf" src="../../static/img/gwc.jpg"></image>
							</view>
						</view>
					</view>
				</view>
				
				<view v-show="isLoadMore" class="more_loading">  
						<uni-load-more :status="loadStatus" :contentText="contentText"></uni-load-more>
				</view>
		 </scroll-view>
		 
		 <!-- <view class="noGood" v-if="noGshow">
		 	<image src="../../static/images/noGood.png" mode="widthFix" class="noGood-img"></image>
		 	<p>没有找到相关的商品</p>
		 </view> -->
		 
		 <view class="goTop" @click="toTop" v-if="flag">
		 		<image src="../../static/img/gotop.png" mode="aspectFit" class="goTop-img"></image>
		 </view>
		 
		  <Tabbar :id="3"></Tabbar>
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
				recommendArr:[
					{name:"普通鞋类精选1双", img:"../../static/index/swiper1.jpg",newprice:19.9,oldprice:49.4,sales:129,qg:1},
					{name:"高级鞋类精选三双", img:"../../static/index/swiper2.jpg",newprice:20,oldprice:76,sales:29,qg:3},
					{name:"中级鞋类精选2双", img:"../../static/index/logo.jpg",newprice:13.9,oldprice:49,sales:89,qg:2},
					{name:"中级鞋类修复", img:"../../static/index/swiper3.png",newprice:13.9,oldprice:49,sales:89,qg:1},
				],
			}
		},
		onReady() {
		
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	@import 'myCart.scss'
</style>
