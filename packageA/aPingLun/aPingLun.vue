<template>
	<view class="allBg flexBox">
		<view class="rod-mume">
			<view v-for="i in mumeArr" :key="i.id" :class="['mume-item',{'mume-item-act':i.id==listQuery.type}]" @click="mumeClick(i.id)">
				<span>{{i.name}}</span>
			</view>
		</view>
		<view class="tabBox">
			<view :class="['tab',{'tab-act':listQuery.status == 1}]" @click="tabClick(1)">未回复</view>
			<view :class="['tab',{'tab-act':listQuery.status == 2}]" @click="tabClick(2)">已回复</view>
		</view>
		
		
		<scroll-view scroll-y="true" lower-threshold="150" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop" class="boxScroll">
			<view class="apl-main">
				<view v-for="(item, index) in list" :key="item.id" :class="['apl-item', {'apl-item-act':item.ifTop}]">
					<view class="item-top">
						<image :src="item.goodsPic" class="item-lt"></image>
						<view class="item-mid">
							<p class="mid-p">{{item.goodsName}}</p>
							<p class="mid-g">来自用户 {{item.nickName}}</p>
						</view>
					</view>
					<view class="item-foot">
						<view class="foot-lt">
							<template v-if="item.type==1">
								<uni-icons type="hand-up-filled" size="56rpx" color="#FF5C5C"></uni-icons>好评
							</template>
							<template v-else-if="item.type==2">
								<uni-icons type="hand-up" size="56rpx" color="#FF5C5C"></uni-icons>中评
							</template>
							<template v-else>
								<uni-icons type="hand-down" size="56rpx" color="#FF5C5C"></uni-icons>差评
							</template>
						</view>
						<view class="foot-rt">
							<view class="rt-btn" @click="zhiDing(item.id,item.ifTop,index)">{{item.ifTop?'取消':''}}置顶</view>
							<view class="rt-btn rt-g" @click="delPL(item.id,index)">删除评论</view>
							<view class="rt-btn" @click="huiFClick(item)">{{listQuery.status==1?'':'修改'}}回复</view>
						</view>
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
		
	</view>
</template>

<script>
	import { commentPage,commentDel,commentEditTop } from '@/api/page/manage.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mumeArr:[
					{name:'好评', id:1 },
					{name:'中评', id:2 },
					{name:'差评', id:3 },
				],
				
				listQuery:{
					pageNo:1,
					pageSize:10,
					type:1,
					status:1,
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
		onReady() {
			this.initData()
		},
		onShow() {
			var _that = this;
			uni.$once('hfOk',function(data){
				_that.mumeClick(1)
			})
		},
		methods: {
			mumeClick(id){
				this.list = [];
				this.loadStatus = 'loading'
				this.listQuery.type = id;
				this.listQuery.pageNo = 1;
				this.listQuery.status = 1;			
				this.initData();
			},
			
			tabClick(n){
				if(n==this.listQuery.status) return;
				this.list = [];
				this.loadStatus = 'loading'
				this.listQuery.pageNo = 1;
				this.listQuery.status = n;
				this.initData();
			},
			
			//置顶 取消置顶
			zhiDing(id,ifTop,index){
				this.list[index].ifTop = !ifTop;
				let param = {
					id,
					type:ifTop?2:1
				}
				commentEditTop(param).then((res) => {
					if(res.code == 200){
						uni.showToast({ title: '更新成功',icon:'success' });
						this.list[index].ifTop = !ifTop
					}
				})
			},
			// 删除评论
			delPL(id){
				uni.showModal({
					title:"温馨提示",
					content:"确定删除当前评论?",
					confirmText:"确定",
					success: (res)=> {
						if (res.confirm) {
							commentDel({ id }).then((res) => {
								if(res.code == 200){
									uni.showToast({ title: '删除成功',icon:'success' });
									this.list.splice(index, 1);
								}
							})
							
						} else if (res.cancel) {}
					}
				});
				
			},
			// 回复
			huiFClick(item){
				uni.navigateTo({
				    url: '/packageA/aPingLunDetail/aPingLunDetail?item=' + JSON.stringify(item)
				});
			},
			
			initData() {
				commentPage(this.listQuery).then((res) => {
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
	@import 'aPingLun.scss';
	@import '../pageA.scss';
</style>
