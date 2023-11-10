<template>
	<view class="allBg flexBox">
		<view class="noGood" v-if='noDataShow'>
			<image :src="FILE_BASE_URL + '/3ee934e5-e364-4dad-9417-88a4776bfd87.png'" mode="widthFix" class="noGood-img"></image>
			<p>暂无数据</p>
		</view>
				
		<scroll-view scroll-y="true" lower-threshold="150" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop" class="boxScroll">
			<view class="rmn-main">
				<view class="main-item" v-for="(item, index) in list" :key="index">
					<view class="item-lf">
						<h3 class="lf-h">{{item.statusText}}</h3>
						<p class="lf-p overflow1" v-if="item.tradeSn">提现单号：{{item.tradeSn}}</p>
						<p class="lf-p" v-if="item.remark">失败原因：{{item.remark}}</p>
					</view>
					<view class="item-rf">
						<p class="rf-p">￥{{item.amount}}</p>
						<p class="rf-p2">{{item.createTime.split(' ')[0]}}</p>
					</view>
				</view>
			</view>
			
			<view v-show="isLoadMore" class="more_loading">
				<uni-load-more :status="loadStatus" :contentText="contentText"></uni-load-more>
			</view>
		</scroll-view>
			
		</view>
		
	</view>
</template>

<script>
	import { withdrawPage,DSwithdrawPage } from '@/api/page/index.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				listQuery:{
					pageNo:1,
					pageSize:10,
				},
				level:0,
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
		methods: {
			initData() {
				const fetchData = (queryFunction) => {
					queryFunction(this.listQuery).then((res) => {
						if(res.code == 200){
							if(this.listQuery.pageNo<=res.data.totalPages){
								this.noDataShow = false;
								this.list.push(...res.data.data);
									
								if(this.listQuery.pageNo==res.data.totalPages){  //判断接口返回数据量小于请求数据量，则表示此为最后一页
									this.isLoadMore=true                                             
									this.loadStatus='nomore'
								}else{
									this.isLoadMore=false
									this.loadStatus='loading'
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
					})
					.catch((e) => {
						this.isLoadMore = false;
					});
				};
				
				if (this.level == 2) {
					fetchData(withdrawPage);
				} else if (this.level == 3) {
					fetchData(DSwithdrawPage);
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
	@import 'roleTiXian.scss'
</style>
