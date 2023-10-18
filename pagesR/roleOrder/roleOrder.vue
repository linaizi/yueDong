<template>
	<view class="allBg flexBox">
		<view class="rod-mume">
			<view v-for="i in curArr" :key="i.id" :class="['mume-item',{'mume-item-act':i.id==mumeAct}]" @click="mumeClick(i.id)">
				<span>{{i.name}}</span>
			</view>
		</view>
		
		<scroll-view scroll-y="true" lower-threshold="150" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop" class="boxScroll">
				<view class="ordre-main" v-for="item in list" :key="item.orderId" @click="toOrderDetail(item)">
					<view class="main-top">
						<view class="top-lt">订单号:{{item.orderNo}}</view>
						<view class="top-rt">{{rtStatus(item.status)}}</view>
					</view>
					
					<view class="ordre-item" v-for="(i,ind) in JSON.parse(item.goodsInfo)" :key="ind">
						<image :src="i.goodsPic" class="main-lt"></image>
						<view class="item-mid">
							<p class="mid-p overflow1">{{i.goodsName}}</p>
							<p>规格：默认</p>
							<p>x{{i.goodsNum}}</p>
						</view>
						<view class="main-rt">￥{{i.goodsNowPrice}}</view>
					</view>
					
					<view class="main-price">
						<p class="price-p">
							<span>合计：</span>￥{{item.payAmount}}<span v-if="item.freightAmount&&level!=2">(含运费￥{{item.freightAmount}})</span>
						</p>
						<p class="price-p" v-if="level==2">
							<span>预估收入：</span>￥{{item.commission}}
						</p>
					</view>
				</view>
				
				<view v-show="isLoadMore" class="more_loading">
						<uni-load-more :status="loadStatus" :contentText="contentText"></uni-load-more>
				</view>
		</scroll-view>
		
		<view class="noGood" v-if='noDataShow'>
			<image :src="FILE_BASE_URL + '/3ee934e5-e364-4dad-9417-88a4776bfd87.png'" mode="widthFix" class="noGood-img"></image>
			<p>暂无订单</p>
		</view>
			
		<view class="goTop" @click="toTop" v-if="flag">
			<image :src="FILE_BASE_URL + '/72355db4-ef1e-4845-b601-ba7fdd905cd4.png'" mode="aspectFit" class="goTop-img"></image>
		</view>
		
	</view>
</template>

<script>	
	import { RorderPage,DSorderPage,GCorderPage } from '@/api/page/index.js'
	import { throttle } from "@/common/throttle.js"; 
	import { rtStatus } from '@/common/tool.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				level:0,
				mumeArr2:[
					{name:'全部', id:0 },
					{name:'未取货', id:1 },
					{name:'已取货', id:2 },
					{name:'已完成', id:3 },
					{name:'已取消', id:4 },
				],
				mumeArr3:[
					{name:'全部', id:0 },
					{name:'未完成', id:1 },
					{name:'已完成', id:2 },
					{name:'已取消', id:3 },
				],
				mumeAct:0,
				
				listQuery:{
					pageNo:1,
					pageSize:10,
					status:0
				},
				list:[],
				noDataShow:false,
				//scroll-view
				contentText:{
					contentdown: "上拉显示更多",
					contentrefresh: "加载中...",
					contentnomore: "已全部加载"
				},
				loadStatus:'loading',  //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
				isLoadMore:false,  //是否加载中
				
				//返回顶部
				scrollTop:0,
				oldScrollTop:0,
				flag:false,
			}
		},
		onLoad(option) {
			this.level = option.level
			this.initData()
		},
		onShow() {
			let _that = this;
			uni.$once('ERoleOdDetail',function(data){
				_that.mumeClick(0)
			})
		},
		 computed: {
			curArr() {
		      return this.level == 3 ? this.mumeArr3 : this.mumeArr2;
		    },
		  },
		
		methods: {
			mumeClick: throttle(function(id){
				this.list = [];
				this.mumeAct = id;
				this.loadStatus = 'loading'
				this.listQuery.pageNo = 1;
				this.listQuery.status = id;
				this.initData();
			}),
			
			initData() {
				const fetchData = (queryFunction) => {
					queryFunction(this.listQuery).then((res) => {
						if (res.code === 200) {
						  if (this.listQuery.pageNo <= res.data.totalPages) {
							  this.noDataShow = false;
							this.list.push(...res.data.data);
				
							if (this.listQuery.pageNo === res.data.totalPages) {
							  this.isLoadMore = true;
							  this.loadStatus = 'nomore';
							} else {
							  this.isLoadMore = false;
							  this.loadStatus = 'loading';
							}
						  } else {
							if (this.listQuery.pageNo === 1) {
							  this.isLoadMore = false;
							  this.noDataShow = true;
							} else {
							  this.isLoadMore = true;
							  this.loadStatus = 'nomore';
							}
						  }
						}
					})
					.catch((e) => {
						this.isLoadMore = false;
					});
				};
				
				if (this.level == 2) {
					fetchData(RorderPage);
				} else if (this.level == 3) {
					fetchData(DSorderPage);
				} else if (this.level == 5) {
					fetchData(GCorderPage);
				}
			},
			
			//返回订单状态
			rtStatus,
			
			totalMon(goodsInfo){
				if(!goodsInfo) return;
				goodsInfo = JSON.parse(goodsInfo);
				return goodsInfo.reduce((total, item) => total + item.goodsNowPrice * item.goodsNum, 0);
			},
			
			toOrderDetail(item){
				if(this.level==2){
					uni.navigateTo({
					    url: '/pagesR/roleOrderDetail/roleOrderDetail?orderId=' + item.orderId + "&orderNo=" + item.orderNo
					});
				}else if(this.level == 3){
					uni.navigateTo({
					    url: '/pagesR/siteOrderDetail/siteOrderDetail?orderId=' + item.orderId + "&orderNo=" + item.orderNo
					});
				}else if(this.level == 5){
					uni.navigateTo({
					    url: '/pagesR/factOrderDetail/factOrderDetail?orderId=' + item.orderId + "&orderNo=" + item.orderNo
					});
				}
			},
			
			scrollLower(){
				if(!this.isLoadMore){  //此处判断，上锁，防止重复请求
					this.isLoadMore=true
					this.listQuery.pageNo++
					this.initData()
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
			this.list = [];
			this.listQuery.pageNo = 1
			this.initData();
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		
	}
</script>

<style lang="scss" scoped>
	@import 'roleOrder.scss'
</style>
