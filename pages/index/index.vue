<template>
	<view class="bgBox flexBox">
		<uni-nav-bar statusBar="true" backgroundColor="#fff" title="跃动洗鞋" fixed></uni-nav-bar>
		
		<scroll-view scroll-y="true" lower-threshold="150" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop"
			class="boxScroll indexScroll"
			:refresher-enabled="isOpenRefresh" :refresher-triggered="triggered" @refresherpulling="onPulling"
			@refresherrefresh="onRefresh"	@refresherrestore="onRestore" @refresherabort="onAbort" > 
			
			<view class="swiperBox"> <Swiper :dataInfo="swpArr"></Swiper></view>
			
				<view class="containBox">
					<view class="menu">
						<view class="item" v-for="(item,index) in menuArr" :key="index" @click="menuClick(index)">
							<image :src="item.img" mode="widthFix" class="itemImg"></image>
							{{item.name}}
						</view>
					</view>
					
					<image src="../../static/img/index1.png" mode="widthFix" class="w100" @click="goSort"></image>
					
					<view class="tZan">
						<image class="icon" src="../../static/img/zan.png"></image>
						<view>热门推荐</view>
					</view>
					
					<view class="goodsList">
						<view class="goodsItem" v-for="(item,index) in recommendArr" :key="index" @click="goProductDetails(item)">
							<image :src="item.img" class="goodsImg"></image>
							<view class="goodsMsg">
								<view class="goodsMsg-top">
									<h2 class="overflow2">{{item.name}}</h2>
									<view class="goods-sal">已售：{{item.sales}} 件</view>
								</view>
								<view class="goodsMsg-foot">
									<view class="foot-lf">
											<p>￥<span class="big">{{priceHander(item.newprice,1)}}</span>{{priceHander(item.newprice,2)}}</p>
											<p class="gray">￥{{item.oldprice}}</p>
									</view>
									<image class="foot-rf" src="../../static/img/gwc.jpg" @click.stop="openCar(item)"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			
				<view v-show="isLoadMore" class="more_loading">
						<uni-load-more :status="loadStatus" :contentText="contentText"></uni-load-more>
				</view>
		</scroll-view>
			
		<view class="goTop" @click="toTop" v-if="flag">
				<image src="../../static/img/gotop.png" mode="aspectFit" class="goTop-img"></image>
		</view>
			
		 <Tabbar :tabid="1"></Tabbar>
		 <Ppcar :ppCarData="ppCarData" ref="child"></Ppcar>
		 <Ppkefu ref="kfchild"></Ppkefu>
		 
	</view>
</template>

<script>
	import Swiper from "@/components/swiper/swiper.vue"
	import Tabbar from "@/components/tabbar/tabbar.vue"
	import Ppcar from "@/components/ppcar/ppcar.vue"
	import Ppkefu from "@/components/ppkefu/ppkefu.vue"
	import { priceHander } from '@/common/tool.js'
	export default {
		components: {
			Swiper,
			Tabbar,
			Ppcar,
			Ppkefu,
		},
		data() {
			return {
				swpArr: [
					"../../static/img/swiper1.jpg",
					"../../static/img/swiper2.jpg",
					"../../static/img/swiper3.png",
				],
				menuArr: [
					{name:"门店列表", img:"../../static/img/menu1.png"},
					{name:"使用帮助", img:"../../static/img/menu2.png"},
					{name:"关于我们", img:"../../static/img/menu3.png"},
					{name:"联系客服", img:"../../static/img/menu4.png"},
				],
				
				goodParams:{
					pageNo:1,
					pageSize:10
				},
				recommendArr:[
					{name:"普通鞋类精选1双", img:"../../static/img/swiper1.jpg",newprice:19.9,oldprice:49.4,sales:129,qg:1},
					{name:"高级鞋类精选三双", img:"../../static/img/swiper2.jpg",newprice:20,oldprice:76,sales:29,qg:3},
					{name:"中级鞋类精选2双", img:"../../static/img/logo.jpg",newprice:13.9,oldprice:49,sales:89,qg:2},
					{name:"中级鞋类修复", img:"../../static/img/swiper3.png",newprice:13.9,oldprice:49,sales:89,qg:1},
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
				
				ppCarData:{},
			}
		},
		onReady() {
			this.initData()
			this.initGoods()
		},
		methods: {
			initData(){},
			
			initGoods(){},
			
			menuClick(idx){
				let url=''
				switch(idx) {
				  case 0:
				    url=''
				    break;
					case 1:
						url='/pages/help/help'
						break;
					case 2:
					  url='/pages/about/about'
					  break;
					case 3:
					  this.$refs.kfchild.$refs.kfPopup.open();
					  break;
				} 		
				if(idx!=3){
					uni.navigateTo({
					    url: url
					});
				}
				
			},
			
			goSort(){
				uni.navigateTo({
				   url: '/pages/sort/sort',
				})
			},
			
			openCar(i){
				this.ppCarData = i;
				this.ppCarData.numberValue=i.qg;
				this.ppCarData.minSale=i.qg;	
				this.$refs.child.$refs.popup.open()
			},
			
			priceHander,
			
			// 跳转商品详情
			goProductDetails(i){
				var arr = {
				  itemSource:i.item_source,
				  goodsId:i.data_id,
				}
				
				 uni.navigateTo({
					url: '/pages/productDetails/productDetails?arr=' + JSON.stringify(arr) 
				 })
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
	@import 'pages/index/index.scss'
</style>
