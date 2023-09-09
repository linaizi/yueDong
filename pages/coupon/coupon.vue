<template>
	<view class="allBg flexBox">
		 <view class="cpon-top">
			 <view v-for="(i,index) in topArr" :key="index" :class="['top-item',{'top-red':index==topId}]" @click="topClick(index)">{{i}}</view>
		 </view>
		 
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
				
				<view class="cponBox">
					<view class="cponItem">
						<view class="item-lt">
							<p class="lt-p">￥<span>15</span> </p>
							<p>满65元可用</p>
						</view>
						<view class="item-md"></view>
						<view class="item-rt">去使用</view>
					</view>
				</view>
				
				<view v-show="isLoadMore" class="more_loading">  
						<uni-load-more :status="loadStatus" :contentText="contentText"></uni-load-more>
				</view>
		 </scroll-view>
		 
		 <view class="goTop" @click="toTop" v-if="flag">
		 		<image src="../../static/img/gotop.png" mode="aspectFit" class="goTop-img"></image>
		 </view>
		 
	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				topArr:['未使用','已使用','已过期'],
				topId:0,
				
				imgArr:[
					"../../static/img/good1.png",
					"../../static/img/index1.png",
				],
				
				flag:false,
				contentText:{
					contentdown: "上拉显示更多",
					contentrefresh: "加载中...",
					contentnomore: "已全部加载"
				},
				loadStatus:'loading',  //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
				isLoadMore:false,  //是否加载中
				scrollTop:0,
				oldScrollTop:0,
				isOpenRefresh: true, // 是否开启下拉
				triggered: false,  //当前下拉刷新状态
				_freshing: false,  
			}
		},
		onReady() {
		
		},
		methods: {
			topClick(i){
				this.topId = i;
			},
			
			scrollLower(){
				if(!this.isLoadMore){  //此处判断，上锁，防止重复请求
					this.isLoadMore = true
					this.goodParams.pageNo++
					this.initGoods()
				}
			},
			// 自定义下拉刷新控件被下拉
			onPulling(e) {
				if (e.detail.dy < 0) return  // 防止上滑页面也触发下拉
				this.triggered = true;
			},
			// 自定义下拉刷新被触发
			onRefresh() {
				if (this._freshing) return;
				this._freshing = true;
				setTimeout(() => {
					this.triggered = false;
					this._freshing = false;
					this.goodParams.pageNo = 1
					this.recommendArr = []
					this.initData()
					this.initGoods()
				}, 500);
			},
			// 自定义下拉刷新被复位
			onRestore() {
				console.log("onRestore");
				this.triggered = false //重置
			},
			// 自定义下拉刷新被中止
			onAbort() {
				console.log("onAbort-被中止");
			},
			fromTop(e){  // 监听页面滚动
				if (e.detail.scrollTop > 150) { //当距离大于50时显示回到顶部按钮
						this.flag = true
						this.oldScrollTop = e.detail.scrollTop
				} else {
						this.flag = false
				}
			},
			
			toTop(){
				this.scrollTop = this.oldScrollTop
				this.$nextTick(() => {
					this.scrollTop = 0
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'coupon.scss'
</style>
