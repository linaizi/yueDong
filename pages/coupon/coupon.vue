<template>
	<view class="allBg flexBox">
		 <view class="cpon-top">
			 <view v-for="i in topArr" :key="i.id" :class="['top-item',{'top-red':i.id==topId}]" @click="topClick(i.id)">{{i.name}}</view>
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
				
				<view :class="['cponBox',{'cponItem-no':topId !== 2}]" >
					<view class="cponItem" v-for="(item,index) in recommendArr" :key="index">
						<view class="item-lt">
							<p class="lt-p">￥<span>{{item.couponDto.amount}}</span> </p>
							<p>满{{item.couponDto.conditionAmount}}元可用</p>
						</view>
						<view class="item-md">
							<view class="md-t">{{item.couponDto.amount}}元券 <span>{{item.couponDto.type == 1 ? '新人' : '满减'}}券</span></view>
							<view class="md-p">适用商品：所有商品</view>
							<view class="md-p">有效期至：{{item.expireTime}}</view>
						</view>
						<view class="item-rt" @click="goSort">{{txtArr[topId]}}</view>
					</view>
				</view>
				
				<view v-show="isLoadMore" class="more_loading">  
						<uni-load-more :status="loadStatus" :contentText="contentText"></uni-load-more>
				</view>
		 </scroll-view>
		 
		 <view class="noGood" v-if='noDataShow'>
		 	<image :src="FILE_BASE_URL + '/3ee934e5-e364-4dad-9417-88a4776bfd87.png'" mode="widthFix" class="noGood-img"></image>
		 	<p>暂无优惠券~</p>
		 </view>
		 
		 <view class="goTop" @click="toTop" v-if="flag">
		 		<image :src="FILE_BASE_URL + '/72355db4-ef1e-4845-b601-ba7fdd905cd4.png'" mode="aspectFit" class="goTop-img"></image>
		 </view>
		 
	</view>
</template>

<script>
	import { couponList } from '@/api/page/index.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mid: uni.getStorageSync('mid'),
				recommendArr:[],
				topArr:[
					{name:'未使用', id:2 },
					{name:'已使用', id:1 },
					{name:'已过期', id:3 },
				],
				txtArr:['','已使用','去使用','已过期'],
				topId:2,
				
				listQuery:{
					pageNo:1,
					pageSize:10,
					type:2
				},
				noDataShow:false,
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
			this.initGoods()
		},
		methods: {
			initGoods(){
				couponList(this.listQuery).then((res) => {
					if(res.code == 200){
						if(res.data.length>0){
							this.noDataShow = false;
							this.recommendArr.push(...res.data);
							
							if(res.data.length<this.listQuery.pageSize){  //判断接口返回数据量小于请求数据量，则表示此为最后一页
								this.isLoadMore=true
								this.loadStatus='nomore'
							}else{
								this.isLoadMore=false
							}
							
						}else{
							if(this.listQuery.pageNo == 1){
								this.isLoadMore=false;
								this.noDataShow = true;
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
			
			//tab切换
			topClick(i){
				this.topId = i;
				this.listQuery.pageNo = 1;
				this.listQuery.type = i;
				this.recommendArr = [];
				this.initGoods()
			},
			
			goSort(){
				if(this.topId!==2) return;
				uni.navigateTo({
					url: "/pages/sort/sort",
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
	@import 'coupon.scss'
</style>
