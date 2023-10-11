<template>
	<view class="allBg flexBox">
		<view class="rod-mume">
			<view v-for="i in mumeArr" :key="i.id" :class="['mume-item',{'mume-item-act':i.id==listQuery.status}]" @click="mumeClick(i.id)">
				<span>{{i.name}}</span>
			</view>
		</view>
		<view class="tabBox">
			<view :class="['tab',{'tab-act':listQuery.type == 2}]" @click="tabClick(2)">满减券</view>
			<view :class="['tab',{'tab-act':listQuery.type == 1}]" @click="tabClick(1)">新人券</view>
		</view>
		
		<scroll-view scroll-y="true" lower-threshold="50" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop" class="boxScroll acmBox">
			<view class="acm-main">
				<view class="main-item" v-for="(item,index) in list" :key="index">
					<view class="item-lt">
						<view class="lt-top">
							<p class="top-mon">券面额:￥<span class="mon-b">{{item.amount}}</span> </p>
							<p class="top-p">(满{{item.conditionAmount}}元可用)</p>
							<p class="top-r" v-if="item.ifStock">券已领完</p>
						</view>
						<view class="md-p">优惠券领取时间：</view>
						<view class="md-p1">{{item.possessStartTime}} - {{item.possessEndTime}}</view>
						<view class="md-p">优惠券使用时间</view>
						<view class="md-p1">{{item.useStartTime}} - {{item.useEndTime}}</view>
					
					</view>
					<view class="item-rt" @click="delClick(item.id,index)">
						<uni-icons type="trash" size="36rpx" color="#fff"></uni-icons><p>删除</p>
					</view>
				</view>
			</view>
			
			<view v-show="isLoadMore" class="more_loading">
					<uni-load-more :status="loadStatus" :contentText="contentText"></uni-load-more>
			</view>
		</scroll-view>
		
		<view class="noGood" v-if='noDataShow'>
			<image :src="FILE_BASE_URL + '/3ee934e5-e364-4dad-9417-88a4776bfd87.png'" mode="widthFix" class="noGood-img"></image>
			<p>暂无数据~</p>
		</view>
			
		<view class="goTop" @click="toTop" v-if="flag">
			<image :src="FILE_BASE_URL + '/72355db4-ef1e-4845-b601-ba7fdd905cd4.png'" mode="aspectFit" class="goTop-img"></image>
		</view>
		
		<view class="acm-btn">
			<view class="btn" @click="toAddCou">新增优惠券</view>
		</view>
		
	</view>
</template>

<script>
	import { AcouponList,AcouponDel } from '@/api/page/manage.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mumeArr:[
					{name:'未开始', id:1 },
					{name:'活动中', id:2 },
					{name:'已结束', id:3 },
				],
				
				listQuery:{
					pageNo:1,
					pageSize:10,
					status:2,
					type:2,
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
			this.initData()
		},
		onShow() {
			var _that = this;
			uni.$once('addCou',function(data){
				_that.initData()
			})
		},
		methods: {
			mumeClick(n){
				if(n==this.listQuery.status) return;
				this.loadStatus = 'loading'
				this.list = [];
				this.listQuery.status = n;
				this.listQuery.pageNo = 1;
				this.listQuery.type = 2;	
				this.initData();
			},
			
			tabClick(n){
				if(n==this.listQuery.type) return;
				this.loadStatus = 'loading'
				this.list = [];
				this.listQuery.pageNo = 1;
				this.listQuery.type = n;
				this.initData();
			},
			
			delClick(id,index){
				uni.showModal({
					title:"温馨提示",
					content:"确定删除当前优惠券?",
					confirmText:"确定",
					success: (res)=> {
						if (res.confirm) {
							AcouponDel({ id }).then((res) => {
								if(res.code == 200){
									uni.showToast({ title: `删除成功`,icon:'success' });
									this.list.splice(index, 1);
								}
							})
						} else if (res.cancel) {}
					}
				});
				
			},
			
			toAddCou(){
				uni.navigateTo({
				    url: '/packageA/addCoupon/addCoupon' 
				});
			},
			
			initData() {
				AcouponList(this.listQuery).then((res) => {
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
	@import 'aCouponMan.scss'
</style>
