<template>
	<view class="allBg flexBox">
		<view class="aod-top">
			<view class="top-lt" @click="toHis"><uni-icons type="search" size="32rpx" color="#999"></uni-icons> 搜索</view>
			<view class="top-rt" @click="openTimePk">汇总<uni-icons type="bottom" size="36rpx" color="#446DFD" ></uni-icons></view>
		</view>
		
		<view class="aod-mume">
			<view v-for="i in mumeArr.slice(0, 3)" :key="i.id" :class="['mume-item',{'mume-item-act':i.id==mumeAct}]" @click="mumeClick(i)"> 
				<span>{{i.name}}</span>
			</view>
			<view :class="['mume-item',{'mume-item-act':isActiveItem(mumeAct)}]" @click="moneShow=!moneShow">
				<span>{{mumeMone}}</span> <uni-icons type="bars" size="30rpx" :color="moneColor" ></uni-icons>
			</view>
			<view class="mone-list" v-if="moneShow">
				<view class="list" v-for="item in mumeArr.slice(-4)" :key="item.id" @click="mumeClick(item)">{{item.name}}</view>
			</view>
		</view>
		
		<scroll-view class="boxScroll" scroll-y="true" lower-threshold="10" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop">
			
			<view class="ordre-main" @click="toDetail(item)">
				<view class="main-top">
					<view class="top-lt">订单号：222222222222222222</view>
					<view class="top-rt">待发货</view>
				</view>
				<view class="phone">
					金角大王 <span class="phone-sp">19898026412</span>
					<view class="phone-tell" @click="PhoneCall()">
						<uni-icons type="phone" size="30rpx" color="#446DFD"></uni-icons>联系收货人
					</view>
				</view>
				<view class="ordre-item">
					<image :src="FILE_BASE_URL + '/3ee934e5-e364-4dad-9417-88a4776bfd87.png'" class="main-lt"></image>
					<view class="item-mid">
						<p class="mid-p overflow1">高级鞋类精选三双</p>
						<p>规格：默认</p>
						<p>x4</p>
					</view>
					<view class="main-rt">￥81.90</view>
				</view>
				<view class="ordre-item">
					<image :src="FILE_BASE_URL + '/3ee934e5-e364-4dad-9417-88a4776bfd87.png'" class="main-lt"></image>
					<view class="item-mid">
						<p class="mid-p overflow1">高级鞋类精选三双</p>
						<p>规格：默认</p>
						<p>x4</p>
					</view>
					<view class="main-rt">￥81.90</view>
				</view>
				
				<view class="main-price">
					<p class="price-p">
						<span>合计：</span>￥81.90<span>(含运费￥0.00)</span>
					</p>
				</view>
				<view class="mian-cz">
					<view class="cz-lt">
						<view class="lt-txt" @click="moreClick">更多</view>
						<view class="lt-more">
							<view class="more">确认收货</view>
							<view class="more">打印小票</view>
						</view>
					</view>
					<view class="cz-rt">
						<view class="rt-btn">强制售后</view>
						<view class="rt-btn" @click="bzClick">备注</view>
						<!-- <view class="rt-btn rt-btn1">发货</view> -->
					</view>
				</view>
			</view>
			
			<view v-show="isLoadMore" class="more_loading">
					<uni-load-more :status="loadStatus" :contentText="contentText"></uni-load-more>
			</view>
		</scroll-view>
		
		<view class="noGood" v-if='false'>
			<image :src="FILE_BASE_URL + '/3ee934e5-e364-4dad-9417-88a4776bfd87.png'" mode="widthFix" class="noGood-img"></image>
			<p>暂无订单</p>
		</view>
		
		<view class="goTop" @click="toTop" v-if="flag">
			<image :src="FILE_BASE_URL + '/72355db4-ef1e-4845-b601-ba7fdd905cd4.png'" mode="aspectFit" class="goTop-img"></image>
		</view>
		
		<!-- 备注输入框 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose"  mode="input" title="备注" 
				placeholder="请输入备注内容(限15个字符)"  @confirm="iptconfirm">
			</uni-popup-dialog>
		</uni-popup>
		
		<!-- 时间筛选弹窗			 -->
		<uni-popup ref="timePopup" type="center">
			 <view class="timePpBox">
				 <view class="pp-title">筛选时间</view>
				 <view class="pp-tm">
					 <view v-for="(t,i) in tmArr" :key="i" :class="['tm-item',{'tm-item-act':i==tmAct}]" @click="tmClick(i)">{{t}}</view>
				 </view>
				 <view class="pp-timePk" v-if="tmAct==4">
					  <uni-datetime-picker v-model="datetimerange" type="daterange" rangeSeparator="至"  @maskClick="maskClick"/>
				 </view>
				 <view class="pp-btn">
					 <view class="btn1" @click="tmClose">取消</view>
					 <view class="btn1 blue" @click="tmYes">确认</view>
				 </view>
			 </view>
		 </uni-popup>
		 
		 <Pgtab :tabid="2"></Pgtab>
	</view>
</template>

<script>
	import Pgtab from "../components/pgtab/pgtab.vue"
	export default {
		components: {
			Pgtab
		},
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mid: uni.getStorageSync('mid'),
				mumeArr:[
					{name:'全部', id:0 },
					{name:'待付款', id:1 },
					{name:'已付款', id:2 },
					{name:'准备清洗', id:4 },
					{name:'正在清洗', id:5 },
					{name:'清洗完成', id:6 },
					{name:'已完成', id:7 },
				],
				mumeMone:'更多状态',
				mumeAct:0,
				moneShow:false,
				moneColor:"#666",
				
				tmArr:['汇总','今日','昨日','7日','自定义'],
				tmAct:0,
				datetimerange:[],
				visibleIds: [], // 用于跟踪哪些项目的 "lt-more" 可见
				
				listQuery:{
					pageNo:1
				},
				//scroll-view
				contentText:{
					contentdown: "上拉显示更多",
					contentrefresh: "加载中...",
					contentnomore: "没有更多订单，点击筛选按钮查看其他订单"
				},
				page:1,
				loadStatus:'loading',  //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
				isLoadMore:false,  //是否加载中
				
				//返回顶部
				scrollTop:0,
				oldScrollTop:0,
				flag:false,
				noGshow:false,
			}
		},
		onReady() {
			 this.initData();
		},
		watch: {
			datetimerange(newval) {
				console.log("范围选:", this.datetimerange);
			},
		},
		methods: {
			initData(){
				return;
				
				if(this.page == this.listQuery.pageNo){
					this.list = [];				
					this.listQuery.pageNo = 1
				}
				
				getOrderList(this.Token,this.listQuery).then((res) => {
					if(res.code == 200){
						this.cntVo = res.data.cntVo
						if(res.data.list.length>0){
							this.noGshow = false;
							this.page = this.listQuery.pageNo;
							this.list.push(...res.data.list);
								
							if(res.data.list.length<this.listQuery.pageSize){  //判断接口返回数据量小于请求数据量，则表示此为最后一页
									this.isLoadMore=true                                             
									this.loadStatus='nomore'
							}else{
									this.isLoadMore=false
									this.loadStatus='loading'
							}
						}else{
								if(this.listQuery.pageNo == 1){
									this.isLoadMore=false;
									this.noGshow = true;
								}else{
									this.isLoadMore=true
									this.loadStatus='nomore'
								}
						}
						
					}
				}).catch(e=>{
					this.isLoadMore=false
					if(this.page>1){
						this.page-=1
					}
				})
			},
			
			openTimePk(){
				this.$refs.timePopup.open();
				this.moneShow = false;
			},
			
			//mume事件
			isActiveItem(itemId){
				return itemId === 4 || itemId === 5 || itemId === 6 || itemId === 7;
			},
			mumeClick(obj){
				this.mumeAct = obj.id;
				this.moneShow = false;
				if(this.isActiveItem(obj.id)){
					this.mumeMone = obj.name;
					this.moneColor = '#446DFD'
				}
				else{
					this.mumeMone = '更多状态'
					this.moneColor = '#666'
				}
					
			},
			
			//自定义时间事件
			tmClick(i){
				this.tmAct = i;
			},
			maskClick(){},
			tmClose(){
				this.$refs.timePopup.close();
			},
			tmYes(){
				
			},
			
			//打电话
			PhoneCall(phone){
				uni.makePhoneCall({
					phoneNumber: phone 
				});
			},
			
			moreClick(itemId) {
			  // 切换可见性
			  if (this.visibleIds.includes(itemId)) {
				// 如果已经可见，就移除
				const index = this.visibleIds.indexOf(itemId);
				this.visibleIds.splice(index, 1);
			  } else {
				// 否则，添加到可见Ids列表中
				this.visibleIds.push(itemId);
			  }
			},
			isMoreVisible(itemId) {
			  // 根据itemId检查是否应该显示 "lt-more"
			  return this.visibleIds.includes(itemId);
			},
			
			// 备注事件
			bzClick(){
				this.$refs.inputDialog.open()
			},
			iptconfirm(value){
				console.log(value)
			},
			
			toHis(){
				uni.navigateTo({
				    url: "/packageA/aOrderHistory/aOrderHistory"
				});
			},
			toDetail(){
				
			},			
			
			scrollLower(){
				if(!this.isLoadMore){  //此处判断，上锁，防止重复请求
					this.isLoadMore=true
					this.listQuery.pageNo++
					let _that = this
					setTimeout(()=>{
						_that.initData()
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
		},
		
		//下拉刷新
		onPullDownRefresh() {
			this.page = this.listQuery.pageNo;
			this.initData();
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
	}
</script>

<style lang="scss" scoped>
	@import 'aOrder.scss'
</style>
