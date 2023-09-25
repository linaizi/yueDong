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
						<view class="goodsItem" v-for="item in recommendArr" :key="item.id" @click="goProductDetails(item)">
							<image :src="item.goodsPic" class="goodsImg"></image>
							<view class="goodsMsg">
								<view class="goodsMsg-top">
									<h2 class="overflow2">{{item.goodsName}}</h2>
									<view class="goods-sal">已售：{{item.saleas}} 件</view>
								</view>
								<view class="goodsMsg-foot">
									<view class="foot-lf">
											<p>￥<span class="big">{{priceHander(item.goodsNowPrice,1)}}</span>{{priceHander(item.goodsNowPrice,2)}}</p>
											<p class="gray">￥{{item.goodsPrice}}</p>
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
		 <Ppcar :ppCarData="ppCarData" ref="child" @updClick="handleUpd"></Ppcar>
		 <Ppkefu ref="kfchild"></Ppkefu>
		 <!-- <Pplog ref="logchild" :mid.sync="mid"  @getData='getUserData'></Pplog> -->
		 
	</view>
</template>

<script>
	import Swiper from "@/components/swiper/swiper.vue"
	import Tabbar from "@/components/tabbar/tabbar.vue"
	import Ppcar from "@/components/ppcar/ppcar.vue"
	import Ppkefu from "@/components/ppkefu/ppkefu.vue"
	import { priceHander,JudgeAuthorize } from '@/common/tool.js'
	import { goodsList } from '@/api/page/index.js'
	import Pplog from "@/components/pplog/pplog.vue"
	export default {
		components: {
			Swiper,
			Tabbar,
			Ppcar,
			Ppkefu,
			Pplog,
		},
		data() {
			return {
				mid: uni.getStorageSync('mid'),
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
					pageSize:10,
					cid:0
				},
				recommendArr:[],
				
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
		onLoad(option) {
			this.initGoods()
			
			// wx.setEnableDebug({ //开发环境打开调试
			// 	enableDebug: true
			// })
		},
		methods: {
			initGoods(){
				goodsList(this.goodParams).then((res) => {
					if(res.code == 200){
						if(this.goodParams.pageNo<=res.data.totalPages){
							this.recommendArr.push(...res.data.data);
							this.isLoadMore=false
							this.loadStatus='loading'
						}else{
							if(this.goodParams.pageNo == 1){
								this.isLoadMore=false;
							}else{
								this.isLoadMore=true
								this.loadStatus='nomore'
							}
						}
					}
				}).catch(e=>{
					this.isLoadMore=false
				});
			},
			
			async menuClick(idx){
				let url=''
				switch(idx) {
				  case 0:
						let k = await this.JudgeAuthorize();
						if(k){
							url = '/pages/storeList/storeList'
						}
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
			
			//判断小程序有没有定位权限
			JudgeAuthorize,
			
			goSort(){
				uni.navigateTo({
				   url: '/pages/sort/sort',
				})
			},
			
			openCar(i){
				this.ppCarData = i;
				this.$refs.child.$refs.popup.open()
			},
			handleUpd(){ console.log('handleUpd')},
			
			priceHander,
			
			// 跳转商品详情
			goProductDetails(i){
				 uni.navigateTo({
					url: '/pages/productDetails/productDetails?goodsId=' + i.id 
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
