<template>
	<view class="allBg flexBox">
		 <view class="aet-top">
			 <span v-for="i in topArr" :key="i.num" :class="{'top-red':i.num==listQuery.type}" @click="topClick(i.num)">{{i.name}}({{numArr[i.n]}})</span>
		 </view>
		 
		 <scroll-view scroll-y="true" lower-threshold="50" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop" class="boxScroll " >
				
				<view class="aetBox">
					<view class="pjItem" v-for="(item,index) in list" :key="index">
						<view class="item-top">
							<image :src="item.avatar" class="top-img"></image>
							<p class="top-p">{{item.nickName}}</p>
							<p>{{item.createTime}}</p>
						</view>
						<view class="item-txt">{{item.content}}</view>
						<view class="image-grid" v-if="item.pic.length>0">
						  <image v-for="(i,ind) in item.pic" :key="ind" :src="i" mode="widthFix" class="image"></image>
						</view>
						<view class="item-gray">规格：默认</view>
						<view class="item-sj" v-if="item.replyContent"><span>商家：</span>{{item.replyContent}}</view>
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
		 
	</view>
</template>

<script>
	import { infoComments,commentNum } from '@/api/page/index.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mid: uni.getStorageSync('mid'),
				topArr:[
					{name:'全部', num:0, n:'titalNum'},
					{name:'图片', num:4, n:'titalPicNum'},
					{name:'好评', num:1, n:'titalUpNum'},
					{name:'中评', num:2, n:'titalCentreNum'},
					{name:'差评', num:3, n:'titalBadNum'}
				],
				list:[],
				numArr:{},
				
				listQuery:{
					pageNo:1,
					type:0,
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
			}
		},
		onLoad(option) {
			this.listQuery.goodsId = option.goodsId;
			this.initGoods()
			this.getComNum(option.goodsId)
		},
		methods: {
			getComNum(goodsId){
				commentNum({goodsId}).then((res) => {
					this.numArr = res.data;
				});
			},
			
			initGoods(){
				infoComments(this.listQuery).then((res) => {
					if(res.code == 200){
						if(this.listQuery.pageNo<=res.data.totalPages){
							this.noDataShow = false;
							this.list.push(...res.data.data);
							
							if(this.listQuery.pageNo==res.data.totalPages){  
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
				}).catch(e=>{
					this.isLoadMore=false
				});
			},
			
			topClick(type){
				this.listQuery.type = type;
				this.listQuery.pageNo = 1;
				this.list = [];
				this.initGoods()
			},
			
			scrollLower(){
				if(!this.isLoadMore){  //此处判断，上锁，防止重复请求
					this.isLoadMore = true
					this.listQuery.pageNo++;
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
			this.list = [];
			this.listQuery.pageNo = 1
			this.initGoods();
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
	}
</script>

<style lang="scss" scoped>
	@import 'allEvaluations.scss'
</style>
