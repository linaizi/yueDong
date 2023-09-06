<template>
	<view class="allBg flexBox">
		<view class="order-top">
			<scroll-view class="top-left" scroll-x="true" scroll-with-animation :scroll-left="scrollLeft">
				<view v-for="(item,index) in listArr" :key="index" class="topItem" @click="listClick(index)">
					<span :class="{'topItem-act':index==listId}">{{item.title}}</span>
				</view>
			</scroll-view>
		</view>
	
	
		<scroll-view scroll-y="true" lower-threshold="150" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop"
			class="boxScroll indexScroll"
			:refresher-enabled="isOpenRefresh" :refresher-triggered="triggered" @refresherpulling="onPulling"
			@refresherrefresh="onRefresh"	@refresherrestore="onRestore" @refresherabort="onAbort" > 
			
				<view class="ordre-main" v-for="(i,index) in 10" :key="index">
					<view class="main-top">
						<view class="top-lt">订单号：222222222222222222</view>
						<view class="top-rt">已取消</view>
					</view>
					<view class="main-item">
						<image src="../../static/img/good1.png" class="main-lt"></image>
						<view class="item-mid">
							<p class="mid-p overflow1">高级鞋类精选三双</p>
							<p>规格：默认</p>
							<p>x4</p>
						</view>
						<view class="main-rt">￥81.90</view>
					</view>
					<view class="main-item">
						<image src="../../static/img/good1.png" class="main-lt"></image>
						<view class="item-mid">
							<p class="mid-p overflow1">高级鞋类精选三双</p>
							<p>规格：默认</p>
							<p>x4</p>
						</view>
						<view class="main-rt">￥81.90</view>
					</view>
					
					<view class="main-price"><span>合计：</span>￥81.90</view>
					<view class="mian-pay">
						<view class="pay-btn">取消</view>
						<view class="pay-btn pay-fk">付款</view>
					</view>
				</view>
				
				<view v-show="isLoadMore" class="more_loading">
						<uni-load-more :status="loadStatus" :contentText="contentText"></uni-load-more>
				</view>
		</scroll-view>
			
		<view class="goTop" @click="toTop" v-if="flag">
				<image src="../../static/img/gotop.png" mode="aspectFit" class="goTop-img"></image>
		</view>
		
	</view>
</template>

<script>
	
	export default {
		components: {
			
		},
		data() {
			return {
				listArr:[
					{title:"全部", catid:1},
					{title:"待付款", catid:2},
					{title:"已付款", catid:3},
					{title:"准备清洗", catid:4},
					{title:"正在清洗", catid:5},
					{title:"清洗完成", catid:6},
					{title:"已完成", catid:7},
				],
				
				showCard: [], //组件显示
				drawCard: [], //组件渲染
				activeIndex: 0, //当前显示的卡片索引,默认第一张显示
				contentScrollW: 0, // 导航区宽度
				listId: 0, // 当前选中
				scrollLeft: 0, // 横向滚动条位置
				
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
			this.getScrollW();
		},
		methods: {
			// 获取标题区域宽度，和每个子元素节点的宽度以及元素距离左边栏的距离
			getScrollW() {
			  const query = uni.createSelectorQuery().in(this);
			 
			  // 拿到 scroll-view 组件宽度
			  query.select('.top-left').boundingClientRect(data => {
					 this.contentScrollW = data.width
			  }).exec();
				
			  query.selectAll('.topItem').boundingClientRect(data => {
					 let dataLen = data.length;
					 for (let i = 0; i < dataLen; i++) {
							 this.listArr[i].left = data[i].left; //  scroll-view 子元素组件距离左边栏的距离
							 this.listArr[i].width = data[i].width; //  scroll-view 子元素组件宽度
					 }
			  }).exec()
			},
			
			listClick(i){
				if (i === this.activeIndex) return 	//重复点击不生效
				
				this.$set(this.showCard,this.activeIndex,false);	// 将上一张卡片隐藏
				
				this.$set(this.drawCard,i,true);	// 切换下一张卡片显示
				this.$set(this.showCard,i,true);
				
				this.activeIndex = i;	// 更新索引
				this.listId = i;
				
				let resultSpot = this.listArr[i].left + this.listArr[i].width / 2 - this.contentScrollW / 2; //最终要停留的点
				this.scrollLeft = resultSpot;
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
	@import 'myOrder.scss'
</style>
