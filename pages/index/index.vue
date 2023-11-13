<template>
	<view class="bgBox flexBox indexBg">
		<uni-nav-bar statusBar="true" backgroundColor="rgba(0,0,0,0)" title="紫荆洗鞋" fixed></uni-nav-bar>
		
		<scroll-view scroll-y="true" lower-threshold="150" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop"
			class="boxScroll indexScroll"> 
			
			<view class="swiperBox"> <Swiper :dataInfo="swpArr"></Swiper></view>
			
				<view class="containBox">
					<view class="menu">
						<view class="item" v-for="item in menuArr" :key="item.id" @click="menuClick(item.id)">
							<button  v-if="item.id==3" class="menu-btn" type="default" plain="true" open-type="contact" @contact="contact"></button>
							<image :src="item.img" mode="widthFix" class="itemImg"></image>
							{{item.name}}
						</view>
					</view>
					
					<!-- <image :src="FILE_BASE_URL + '/5680d7d6-630a-4dbb-809f-f9aec3137e5e.png'" mode="widthFix" class="wh180" @click="goSort"></image> -->
					
					<view class="index-sort">
						<image v-for="(i,index) in sortList" :key="i.id" :src="i.icon" @click="goSort(i.id)" class="sort-img"></image>
					</view>					
					
					<view class="tZan">
						<!-- <image class="icon" :src="FILE_BASE_URL + '/c87c082b-4819-4fec-a4fd-ab944e6fcceb.png'"></image> -->
						<span class="tZan-txt">特惠活动</span>
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
											<p>￥<span class="big">{{priceHander(item.goodsNowPrice,1)}}</span>{{priceHander(item.goodsNowPrice,2)}}/双</p>
											<p class="gray">￥{{item.goodsPrice}}/双</p>
									</view>
									<image class="foot-rf" :src="FILE_BASE_URL + '/4cde96e1-9e5c-44dc-b616-b50eac17ef2d.jpg'" @click.stop="openCar(item)"></image>
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
			<image :src="FILE_BASE_URL + '/72355db4-ef1e-4845-b601-ba7fdd905cd4.png'" mode="aspectFit" class="goTop-img"></image>
		</view>
			
		 <Tabbar :tabid="1"></Tabbar>
		 <Ppcar :ppCarData="ppCarData" ref="child" @updClick="handleUpd" @logClick="logClick"></Ppcar>
		 <Ppkefu ref="kfchild"></Ppkefu>
		 <Pplog ref="logchild" :mid.sync="mid"  @getData='getUserData'></Pplog>
		 
	</view>
</template>

<script>
	import Swiper from "@/components/swiper/swiper.vue"
	import Tabbar from "@/components/tabbar/tabbar.vue"
	import Ppcar from "@/components/ppcar/ppcar.vue"
	import Ppkefu from "@/components/ppkefu/ppkefu.vue"
	import { priceHander } from '@/common/tool.js'
	import { goodsList, categoryList } from '@/api/page/index.js'
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
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mid: uni.getStorageSync('mid'),
				swpArr: [
					// this.$BASE_URLS.FILE_BASE_URL+'/44710a9b-f090-4a86-a6b8-d0ab9d053c86.jpg',
					// this.$BASE_URLS.FILE_BASE_URL+'/a22373d4-fbb0-4fd5-bf45-f3d47e29f93f.jpg',
					// this.$BASE_URLS.FILE_BASE_URL+'/33b724a9-1515-478c-afe8-f82e36198d64.png',
					this.$BASE_URLS.FILE_BASE_URL+'/b7c4e52a-9c62-410c-929b-be22971c6d7e.jpg',
					this.$BASE_URLS.FILE_BASE_URL+'/4f994c2a-b39a-483a-b694-1b2c06d7d0b8.jpg',
				],
				menuArr: [
					{name:"门店列表", id:0, img:this.$BASE_URLS.FILE_BASE_URL+"/c8d70c4c-0aac-490d-ac99-f67e105b2a81.png"},
					{name:"使用帮助", id:1, img:this.$BASE_URLS.FILE_BASE_URL+"/a46eb486-bce0-42a2-add2-dfc0a4275824.png"},
					{name:"客服微信", id:4, img:this.$BASE_URLS.FILE_BASE_URL+"/24d00cec-9b41-414f-ac8a-4623cef92e55.png"},
					{name:"联系客服", id:3, img:this.$BASE_URLS.FILE_BASE_URL+"/db163cb0-39a9-44e0-bf95-bdb4bcf73558.png"},
				],
				
				goodParams:{
					pageNo:1,
					pageSize:10,
					cid:7,
					sort:0
				},
				recommendArr:[],
				sortList:[],
				
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
				
				ppCarData:{},
			}
		},
		onLoad(option) {
			this.initGoods()
			this.getList(); //获取分类
			
			//调试模式
			uni.setEnableDebug({
			    enableDebug: false
			})
			
			wx.showShareMenu({
				withShareTicket:true,
				menus:["shareAppMessage","shareTimeline"]//设置Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
			})
		},
		
		onShow(){
			uni.hideTabBar({ //隐藏系统自动的底部导航
				animation: false
			})
		},
		methods: {
			getList(){
				categoryList().then((res) => {
					if(res.code == 200){
						this.sortList = res.data.slice(1);
					}
				});
			},
			
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
			
			menuClick(idx){
				let url=''
				switch(idx) {
					case 0:
						uni.navigateTo({
							url: '/pages/storeList/storeList'
						});
				    break;
					case 1:
						uni.navigateTo({
							url: '/pages/help/help'
						});
						break;
					case 2:
						uni.navigateTo({
							url: '/pages/about/about'
						});
						break;
					case 4:
						this.$refs.kfchild.$refs.kfPopup.open()
						break;
				} 		
				
			},			
				
			goSort(id){
				if(id) uni.setStorageSync('sortId', id)
				uni.switchTab({
				   url: '/pages/sort/sort',
				})
			},
			
			openCar(i){
				this.ppCarData = i;
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
		},
		
		//下拉刷新
		onPullDownRefresh() {
			this.goodParams.pageNo = 1;
			this.recommendArr = []
			this.initGoods()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		
	}
</script>

<style lang="scss" scoped>
	@import 'pages/index/index.scss'
</style>
