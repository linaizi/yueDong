<template>
	<view class="allBg flexBox">
		<view class="order-top">
			<scroll-view class="top-left" scroll-x="true" scroll-with-animation :scroll-left="scrollLeft">
				<view v-for="item in listArr" :key="item.catid" class="topItem" @click="listClick(item.catid)">
					<span :class="{'topItem-act':item.catid==listId}">{{item.title}}</span>
				</view>
			</scroll-view>
		</view>
	
		<scroll-view scroll-y="true" lower-threshold="150" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop" class="boxScroll"> 
				<view class="ordre-main" v-for="item in list" :key="item.orderId" @click="toOrderDetail(item)">
					<view class="main-top">
						<view class="top-lt">订单号：{{item.orderNo}}</view>
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
							<span>合计：</span>￥{{item.payAmount}}
							<span v-if="item.type==1" class="ml10">(运费:￥{{item.freightAmount}})</span>
						</p>
					</view>
					
					<view class="mian-pay" v-if="item.status==1">
						<view class="pay-btn" @click.stop="closeOrder(item.orderNo)">取消</view>
						<view class="pay-btn pay-fk" @click.stop="payClick(item.orderNo)">付款</view>
					</view>
					
					<view class="mian-pay" v-if="item.status==10||(item.type==0&&item.status==7)">
						<view class="pay-btn" @click.stop="yesSH(item)">确认收货</view>
					</view>
					<!-- <view class="mian-pay">
						<view class="pay-btn" @click.stop="yesSH(item)">确认收货</view>
					</view> -->
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
		
		<Pplog ref="logchild" :mid.sync="mid"  @getData='getUserData'></Pplog>
	</view>
</template>

<script>
	import { orderPage,orderComplete,orderClose,orderPay } from '@/api/page/index.js'
	import { throttle } from "@/common/throttle.js"; 
	import { rtStatus } from '@/common/tool.js'
	import Pplog from "@/components/pplog/pplog.vue"
	export default {
		components: {
			Pplog,
		},
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mid: uni.getStorageSync('mid'),
				listArr:[
					{title:"全部", catid:0},
					{title:"待付款", catid:1},
					{title:"已付款", catid:2},
					{title:"准备清洗", catid:3},
					{title:"正在清洗", catid:4},
					{title:"清洗完成", catid:5},
					{title:"已完成", catid:6},
					{title:"已关闭", catid:7},
				],
				
				showCard: [], //组件显示
				drawCard: [], //组件渲染
				activeIndex: 0, //当前显示的卡片索引,默认第一张显示
				contentScrollW: 0, // 导航区宽度
				listId: 0, // 当前选中
				scrollLeft: 0, // 横向滚动条位置
				
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
		onReady() {
			this.getScrollW();
			this.initData();
		},
		onShow() {
			let _that = this;
			uni.$once('PingLun',function(data){
				_that.listClick(6)
			})
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
			
			initData(){
				orderPage(this.listQuery).then((res) => {
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
					}else if(res.code == 5011){
						this.$refs.logchild.$refs.logPopup.open()
					}
				}).catch(e=>{
					this.isLoadMore=false
				})
			},
			
			toOrderDetail(item){
				uni.navigateTo({
				    url: '/pages/orderDetail/orderDetail?orderId=' + item.orderId + "&orderNo=" + item.orderNo
				});
			},
			
			//返回订单状态
			rtStatus,
			
			//tab切换
			listClick: throttle(function(i){
				if (i === this.activeIndex) return 	//重复点击不生效
				
				this.$set(this.showCard,this.activeIndex,false);	// 将上一张卡片隐藏
				
				this.$set(this.drawCard,i,true);	// 切换下一张卡片显示
				this.$set(this.showCard,i,true);
				
				this.activeIndex = i;	// 更新索引
				this.listId = i;
				
				let resultSpot = this.listArr[i].left + this.listArr[i].width / 2 - this.contentScrollW / 2; //最终要停留的点
				this.scrollLeft = resultSpot;
				
				this.loadStatus = 'loading'
				this.list = [];
				this.listQuery.pageNo = 1;
				this.listQuery.status = i;
				this.initData();
			}),
			
			//取消订单
			closeOrder(orderNo){
				uni.showModal({
					title:"温馨提示",
					content:"是否确定取消订单?",
					confirmText:"确定",
					success: (res)=> {
						if (res.confirm) {
							orderClose({ orderNo }).then((res) => {
								if(res.code == 200){
									uni.showToast({title: '取消成功', icon:'success'});
									setTimeout(()=>{
										const currentPages = getCurrentPages();
										uni.redirectTo({
										  url: `/${currentPages[currentPages.length - 1].route}`
										});
									},1000)
								}
							})
						} else if (res.cancel) {}
					}
				});
			},
			
			payClick(orderNo){
				orderPay({ orderNo }).then((res) => {
					if(res.code == 200){
						this.wxPay(res.data)
					}
				})
			},
			
			wxPay(data){
				let _that = this;
				uni.requestPayment({
				    provider: 'wxpay',
					timeStamp: data.timeStamp,
					nonceStr: data.nonceStr,
					package: data.packAge,
					signType: data.signType,
					paySign: data.paySign,
					success: function (res) {
						uni.showToast({title: '支付成功', icon:'success'});
						setTimeout(()=>{
							const currentPages = getCurrentPages();
							uni.redirectTo({
							  url: `/${currentPages[currentPages.length - 1].route}`
							});
						},1000)
					},
					fail: function (err) {
						uni.showToast({title: '支付失败', icon:'none'});
						setTimeout(()=>{
							const currentPages = getCurrentPages();
							uni.redirectTo({
							  url: `/${currentPages[currentPages.length - 1].route}`
							});
						},1000)
					}
				});
			},
			
			//确认收货
			yesSH(item){
				// uni.navigateTo({
				//     url: '/pages/pingLun/pingLun?goodsInfo=' + item.goodsInfo
				// });
				// return;
				
				uni.showModal({
					title:"温馨提示",
					content:"是否确定收货?",
					confirmText:"确定",
					success: (res)=> {
						if (res.confirm) {
							orderComplete({ orderNo:item.orderNo }).then((res) => {
								if(res.code == 200){
									uni.showToast({title: '提交成功', icon:'success'});
									setTimeout(()=>{
										uni.navigateTo({
										    url: '/pages/pingLun/pingLun?goodsInfo=' + item.goodsInfo
										});
									},1000)
								}
							})
						} else if (res.cancel) {}
					}
				});
			},
			
			//pplog组件回调
			getUserData(wcode){
				if(wcode==200) {
					this.$refs.logchild.$refs.logPopup.close();
					uni.showToast({title: '登录成功', icon:'success'});
					this.getScrollW();
					this.initData();
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
	@import 'myOrder.scss'
</style>
