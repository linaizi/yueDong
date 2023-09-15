<template>
	<view class="bgBox">
		<uni-nav-bar statusBar="true" backgroundColor="#fff" title="分类" fixed></uni-nav-bar>
		
		 <view class="sortBox">
			 <view class="sortLt">
				 <view v-for="(item,index) in list" :key="index" :class="['ltItem',{ 'active': actNum === index }]" @click="sortChange(index)">{{item}}</view>
			 </view>
			 <view class="sortRt flexBox">
				 <scroll-view class="boxScroll" scroll-y="true" lower-threshold="50" @scrolltolower="scrollLower" :scroll-top="scrollTop">
						<view class="sortGoodBox">
							<view class="goodsItem" v-for="(item,index) in recommendArr" :key="index">
								<image :src="item.img" class="goodsImg"></image>
								<view class="goodsMsg">
									<view class="goodsMsg-top">
										<h2 class="top-h overflow2">{{item.name}}</h2>
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
				 
						<view v-show="isLoadMore" class="more_loading">
								<uni-load-more :status="loadStatus" :contentText="contentText"></uni-load-more>
						</view>
				 </scroll-view>
			 </view>
		 </view>
		 
		 <view class="goTop" @click="toTop" v-if="flag">
		 		<image src="../../static/img/gotop.png" mode="aspectFit" class="goTop-img"></image>
		 </view>
		 
		 <Tabbar :tabid="2"></Tabbar>
		 <Ppcar :ppCarData="ppCarData" ref="child"></Ppcar>
	</view>
</template>

<script>
	import Tabbar from "@/components/tabbar/tabbar.vue"
	import Ppcar from "@/components/ppcar/ppcar.vue"
	import { priceHander } from '@/common/tool.js'
	export default {
		components: {
			Tabbar,
			Ppcar
		},
		data() {
			return {
				ppCarData:{},
				list:[ "鞋类清洗", "鞋类修复","鞋类护理","特殊洗护"],
				actNum:0,
				
				recommendArr:[
					{name:"普通鞋类精选1双", img:"../../static/img/swiper1.jpg",newprice:19.9,oldprice:49.4,sales:129,qg:1},
					{name:"高级鞋类精选三双", img:"../../static/img/swiper2.jpg",newprice:20,oldprice:76,sales:29,qg:3},
					{name:"中级鞋类精选2双", img:"../../static/img/logo.jpg",newprice:13.9,oldprice:49,sales:89,qg:2},
					{name:"中级鞋类修复中级鞋类修复中级鞋类修复中级鞋类修复", img:"../../static/img/swiper3.png",newprice:13.9,oldprice:49,sales:89,qg:1},
				],
				
				//scroll-view
				contentText:{
					contentdown: "上拉显示更多",
					contentrefresh: "加载中...",
					contentnomore: "已全部加载"
				},
				listQuery:{
					pageNo:1,
					sort:1
				},
				page:1,
				pagesize:10,
				loadStatus:'loading',  //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
				isLoadMore:false,  //是否加载中
				
				//返回顶部
				scrollTop:0,
				oldScrollTop:0,
				flag:false,
			}
		},
		onReady() {
		
		},
		methods: {
			priceHander,
			
			sortChange(n){
				this.actNum = n;
			},
			
			openCar(i){
				this.ppCarData = i;
				this.ppCarData.numberValue=i.qg;
				this.ppCarData.minSale=i.qg;	
				this.$refs.child.$refs.popup.open('bottom')
			},
					
			scrollLower(){
				if(!this.isLoadMore){  //此处判断，上锁，防止重复请求
					this.isLoadMore=true
					this.listQuery.pageNo++
					let _that = this
					setTimeout(()=>{
						_that.initData()
					},1000)
				}
			},
			fromTop(e){  // 监听页面滚动
				if (e.detail.scrollTop > 500) { //当距离大于50时显示回到顶部按钮
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
	@import 'sort.scss'
</style>
