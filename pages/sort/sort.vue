<template>
	<view class="bgBox">
		<uni-nav-bar statusBar="true" backgroundColor="#fff" title="分类" fixed></uni-nav-bar>
		
		 <view class="sortBox">
			 <view class="sortLt">
				 <view v-for="(item,index) in list" :key="index" :class="['ltItem',{ 'active': actNum === index }]" @click="sortChange(index)">{{item.cname}}</view>
			 </view>
			 <view class="sortRt flexBox">
				 <scroll-view class="boxScroll" scroll-y="true" lower-threshold="50" @scrolltolower="scrollLower" :scroll-top="scrollTop">
						<view class="sortGoodBox">
							<view class="goodsItem" v-for="(item,index) in recommendArr" :key="index" @click="goProductDetails(item)">
								<image :src="item.goodsPic" class="goodsImg"></image>
								<view class="goodsMsg">
									<view class="goodsMsg-top">
										<h2 class="top-h overflow2">{{item.goodsName}}</h2>
										<view class="goods-sal">已售：{{item.saleas}} 件</view>
									</view>
									<view class="goodsMsg-foot">
										<view class="foot-lf">
												<p>￥<span class="big">{{priceHander(item.goodsNowPrice,1)}}</span>{{priceHander(item.goodsNowPrice,2)}}</p>
												<p class="gray">￥{{item.goodsPrice}}</p>
										</view>
										<image class="foot-rf" :src="FILE_BASE_URL + '/4cde96e1-9e5c-44dc-b616-b50eac17ef2d.jpg'" @click.stop="openCar(item)"></image>
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
		 		<image :src="FILE_BASE_URL + '/72355db4-ef1e-4845-b601-ba7fdd905cd4.png'" mode="aspectFit" class="goTop-img"></image>
		 </view>
		 
		 <Tabbar :tabid="2"></Tabbar>
		 <Ppcar :ppCarData="ppCarData" ref="child" @updClick="handleUpd" @logClick="logClick"></Ppcar>
		 <Pplog ref="logchild" :mid.sync="mid"  @getData='getUserData'></Pplog>
	</view>
</template>

<script>
	import Tabbar from "@/components/tabbar/tabbar.vue"
	import Ppcar from "@/components/ppcar/ppcar.vue"
	import { priceHander } from '@/common/tool.js'
	import Pplog from "@/components/pplog/pplog.vue"
	import { categoryList,goodsList } from '@/api/page/index.js'
	export default {
		components: {
			Tabbar,
			Ppcar,
			Pplog,
		},
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mid: uni.getStorageSync('mid'),
				ppCarData:{},
				list:[],
				actNum:0,
				
				recommendArr:[],
				
				//scroll-view
				contentText:{
					contentdown: "上拉显示更多",
					contentrefresh: "加载中...",
					contentnomore: "已全部加载"
				},
				listQuery:{
					pageNo:1,
					pageSize:10,
					cid:1
				},
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
			this.getList()
		},
		onShow(){
			uni.hideTabBar({ //隐藏系统自动的底部导航
					animation: false
			})
		},
		methods: {
			priceHander,
			
			getList(){
				categoryList().then((res) => {
					if(res.code == 200){
						this.list = res.data;
						this.listQuery.cid = res.data[0].id;
						this.initGoods()
					}
				});
			},
			
			initGoods(){
				goodsList(this.listQuery).then((res) => {
					if(res.code == 200){
						if(this.listQuery.pageNo<=res.data.totalPages){
							this.recommendArr.push(...res.data.data);
							this.isLoadMore=false
							this.loadStatus='loading'
						}else{
							if(this.listQuery.pageNo == 1){
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
			
			// 跳转商品详情
			goProductDetails(i){
				 uni.navigateTo({
					url: '/pages/productDetails/productDetails?goodsId=' + i.id 
				 })
			},
			
			//tab切换
			sortChange(n){
				if(this.actNum == n) return;
				this.actNum = n;
				this.listQuery.cid = this.list[n].id;
				this.recommendArr = [];
				this.listQuery.pageNo = 1;
				this.initGoods()
			},
			
			openCar(i){
				this.ppCarData = i;
				this.ppCarData.numberValue=i.qg;
				this.ppCarData.minSale=i.qg;	
				this.$refs.child.$refs.popup.open()
			},
			
			handleUpd(){ console.log('handleUpd')},
			logClick(){
				this.$refs.child.$refs.popup.close()
				this.$refs.logchild.$refs.logPopup.open()
			},
			//pplog组件回调
			getUserData(wcode){
				if(wcode==200) {
					this.$refs.logchild.$refs.logPopup.close();
					uni.showToast({title: '登录成功', icon:'success'});
				}
			},
					
			scrollLower(){
				if(!this.isLoadMore){  //此处判断，上锁，防止重复请求
					this.isLoadMore=true
					this.listQuery.pageNo++
					let _that = this
					setTimeout(()=>{
						_that.initGoods()
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
