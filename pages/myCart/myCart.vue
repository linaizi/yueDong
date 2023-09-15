<template>
	<view class="allBg flexBox">
		<uni-nav-bar statusBar="true" backgroundColor="#fff" title="购物车" fixed></uni-nav-bar>
		
		 <view class="myCart-top">商品库存有限，请尽快下单  <p v-if="!noGshow" @click="editClick">{{showJs?"编辑":"完成"}}</p></view>
		 
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
					<view class="myCartItem" v-for="(item,index) in recommendArr" :key="index" @click="goodsClick(item)">
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
				<image src="../../static/img/myCart1.png" mode="widthFix" class="noGood-img"></image>
				<p>购物车还是空的哦</p>
		 </view>
		 
		 <view class="myCart-foot">
				<view class="foot-lt">
					<view class="circle"></view>
					<span class="lt-span">全选</span>
					<span class="red" v-if="showJs">总计: ￥{{totalMoney}}</span>
				</view>
				<view :class="['foot-rt',{'foot-rt-act':isJs}]" v-if="showJs">去结算</view>
				<view :class="['foot-del',{'foot-del-act':isJs}]" v-else>删除</view>
		 </view>
		 
		 <view class="goTop" @click="toTop" v-if="flag">
		 		<image src="../../static/img/gotop.png" mode="aspectFit" class="goTop-img"></image>
		 </view>
		 
		  <Tabbar :tabid="3"></Tabbar>
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
					{name:"普通鞋类精选1双", img:"../../static/img/swiper1.jpg",newprice:19.9,oldprice:49.4,sales:129,qg:1,check:false},
					{name:"高级鞋类精选三双", img:"../../static/img/swiper2.jpg",newprice:20,oldprice:76,sales:29,qg:3,check:false},
					{name:"中级鞋类精选2双", img:"../../static/img/logo.jpg",newprice:13.9,oldprice:49,sales:89,qg:2,check:false},
					{name:"中级鞋类修复", img:"../../static/img/swiper3.png",newprice:13.9,oldprice:49,sales:89,qg:1,check:false},
				],
				noGshow:false,
				totalMoney:0.00,
				numberValue:1,
				showJs:true, //显示结算，false显示删除
				isJs:false, 
				
				
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
			this.initData()
		},
		methods: {
			initData(){
				this.noGshow = this.recommendArr.length>0 ? false : true;
			},
			
			editClick(){
				this.showJs = !this.showJs;
			},
			
			goodsClick(obj){
				console.log(obj)
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
	@import 'myCart.scss'
</style>
