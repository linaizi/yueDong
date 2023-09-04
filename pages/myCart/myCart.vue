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
				<view class="myCartList">
					<view class="myCartItem" v-for="(item,index) in recommendArr" :key="index" >
						<view class="circle"></view>
						<view class="itemRt">
							<image :src="item.img" class="rt-Img"></image>
							<view class="rt-mid">
								<view class="mid-name overflow2">{{item.name}}</view>
								<view class="mid-gz">规格：默认</view>
								<view class="mid-price">
									{{item.newprice}}
									<uni-number-box :value="numberValue" @change="change" background="#fff" class="uniNum" />
								</view>
							</view>
							
						</view>
					</view>
				</view>
				
				<view v-show="isLoadMore" class="more_loading">  
						<uni-load-more :status="loadStatus" :contentText="contentText"></uni-load-more>
				</view>
		 </scroll-view>
		 
		 <view class="noGood" v-if="noGshow">
				<image src="../../static/img/myCart1.jpg" mode="widthFix" class="noGood-img"></image>
				<p>购物车还是空的哦</p>
		 </view>
		 
		 <view class="myCart-foot">
				<view class="foot-lt">
					<view class="circle"></view>
					<span class="lt-span">全选</span>
					<span class="red">总计: ￥{{totalMoney}}</span>
				</view>
				<view class="foot-rt foot-rt-act">去结算</view>
		 </view>
		 
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
				noGshow:false,
				totalMoney:0.00
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
