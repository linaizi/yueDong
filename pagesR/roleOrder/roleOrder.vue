<template>
	<view class="allBg flexBox">
		<view class="rod-top">
			<view class="top-lt">
				<input type="text" 
					placeholder="请输入手机号 | 订单号 | 姓名" 
					confirm-type="search"
					v-model="listQuery.content" 
					@confirm="searchPhone" 
					@input="onKeyInput"
					placeholder-style="color:#999;fontSize:28rpx" 
					class="searchInput"/>
				<image v-if="iptClose" class="lt-right" @click="removeInput" :src="FILE_BASE_URL + '/2c34c18c-7b4c-498a-83e2-e03bcd59b07d.jpg'"></image>
			</view>
			<view class="top-rt" @click="searchPhone"> 搜 索 </view>
		</view>
		
		<view class="tabBox" v-if="level==3">
			<view :class="['tab',{'tab-act':listQuery.orderType == 1}]" @click="tabClick(1)">上门订单</view>
			<view :class="['tab',{'tab-act':listQuery.orderType == 2}]" @click="tabClick(2)">自送订单</view>
		</view>
		
		<view class="rod-mume">
			<view v-for="i in curArr" :key="i.id" :class="['mume-item',{'mume-item-act':i.id==mumeAct}]" @click="mumeClick(i.id)">
				<span>{{i.name}}</span>
				<view class="mume-num" v-if="retNum(i.id)">{{notPickedUpNum}}</view>
			</view>
		</view>
		
		<scroll-view scroll-y="true" lower-threshold="150" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop" class="boxScroll">
				<view class="ordre-main" v-for="(item,i) in list" :key="item.orderId" @click="toOrderDetail(item)">
					<view class="main-top">
						<view class="top-lt">
							<p class="lt-p">
								{{item.name}} 
								<span class="p-span" @click.stop="PhoneCall(item.phone,item.orderNo,4,item.status,i)">
									<uni-icons type="phone" size="30rpx" color="#446DFD"></uni-icons>{{item.phone}}
								</span>
								<template v-if="retContStatus(item,1)">
									<span :class="['p-gray',{'p-blue':retContStatus(item,2)}]" @click.stop="editCont(item.orderNo,2,item.status,i)">已接</span>
									<span :class="['p-gray',{'p-red':retContStatus(item,3)}]" @click.stop="editCont(item.orderNo,3,item.status,i)">未接</span>
								</template>
							</p>
							<p class="lt-p" v-if="item.type == 1&&item.reservationTime"> 预约时间: {{handleTime(item.reservationTime)}} </p>
							<p class="lt-p" v-else> 下单时间：{{item.createTime||''}} </p>
						</view>
						<view class="top-rt">{{rtStatus(item.status)}}</view>
					</view>
					
					<view class="ordre-item" v-for="(i,ind) in JSON.parse(item.goodsInfo)" :key="ind">
						<image :src="i.goodsPic" class="main-lt"></image>
						<view class="item-mid">
							<p class="mid-p overflow1">{{i.goodsName}}</p>
							<p>规格：默认</p>
							<p>数量：{{i.goodsNum}}</p>
							<p>发货方式：{{item.type == 1 ? "上门取送" : "到店服务"}}</p>
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
	import { RorderPage,DSorderPage,GCorderPage,GCcount,QScount,QSContactEdit,FACContactEdit,GCContactEdit } from '@/api/page/index.js'
	import { throttle } from "@/common/throttle.js"; 
	import { rtStatus,handleTime } from '@/common/tool.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				level:0,
				mumeArr2:[
					{name:'全部', id:0,  },
					{name:'未取货', id:1, },
					{name:'已取货', id:2, },
					{name:'已完成', id:3, },
					{name:'已取消', id:4, },
				],
				mumeArr3:[
					{name:'全部', id:0 },
					{name:'未完成', id:1 },
					{name:'待收件', id:4 },
					{name:'待取件', id:5 },
					{name:'已完成', id:2 },
					// {name:'已取消', id:3 },
				],
				mumeAct:0,
				notPickedUpNum:'',
				iptClose:false,
				isSerch:false,
				
				listQuery:{
					pageNo:1,
					pageSize:10,
					status:0,
					content:'',
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
			let UserInfo = {}
			if(uni.getStorageSync('UserInfo')){
				UserInfo = JSON.parse(uni.getStorageSync('UserInfo'))
			}
			
			this.level = option.level || UserInfo.level
			this.listQuery.orderType = this.level == 3 ? 1 : '';
			
			if(option.level){
				this.initData()
				this.getCount() //如果是工厂或者，要返回订单列表数量
			}
			else
				this.mumeClick(1)
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
				if(!this.isSerch) {
					this.listQuery.content = "";
				}
				this.list = [];
				this.mumeAct = id;
				this.loadStatus = 'loading'
				this.listQuery.pageNo = 1;
				this.listQuery.status = id;
				this.initData();
				this.isSerch = false;
				
				this.getCount()
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
				}else{
					uni.switchTab({
					    url: '/pages/index/index'
					});
				}
			},
			
			getCount(){
				const fetchData = (queryFunction) => {
					queryFunction().then((res) => {
						if (res.code === 200) {
						 this.notPickedUpNum = res.data.notPickedUpNum;
						}
					})
				};
				
				if (this.level == 2) {
					fetchData(QScount);
				} else if (this.level == 5) {
					fetchData(GCcount);
				}
			},
			
			tabClick(n){
				if(n==this.listQuery.orderType) return;
				this.list = [];
				this.loadStatus = 'loading'
				this.listQuery.pageNo = 1;
				this.listQuery.orderType = n;
				this.initData();
			},
			
			//返回订单状态
			rtStatus,
			
			handleTime,
			
			//打电话
			PhoneCall(phone,orderNo,contactStatus,status,i){
				this.editCont(orderNo,contactStatus,status,i)
				
				uni.makePhoneCall({
					phoneNumber: phone 
				});
			},
			//修改联系状态
			editCont(orderNo,contactStatus,status,i) {
				const fetchData = (queryFunction) => {
					queryFunction(param).then((res) => {
						if (res.code === 200) {
							if (this.level == 2) {
								if(this.list[i].status > 7){
									this.$set(this.list[i],'returnRContactStatus',contactStatus)
								}else{
									this.$set(this.list[i],'rcontactStatus',contactStatus)
								}
							} else if (this.level == 3) {
								this.$set(this.list[i],'ccontactStatus',contactStatus)
							} else if (this.level == 5) {
								this.$set(this.list[i],'fcontactStatus',contactStatus)
							}
						}
					})
				};
				
				let param = {
					orderNo,
					contactStatus
				}
				if (this.level == 2) {
					param.type = status > 7 ? 2 : 1;
					fetchData(QSContactEdit);
				} else if (this.level == 3) {
					fetchData(FACContactEdit);
				} else if (this.level == 5) {
					fetchData(GCContactEdit);
				}
			},
			//返回当前联系状态
			retContStatus(obj, n){
				if (this.level == 2) {
					if(obj.status > 7){
						return n == 1 ? !(obj.returnRContactStatus == n) : obj.returnRContactStatus == n
					}else{
						return n == 1 ? !(obj.rcontactStatus == n) : obj.rcontactStatus == n 
					}
				} else if (this.level == 3) {
					return n == 1 ? !(obj.ccontactStatus == n) : obj.ccontactStatus == n 
				} else if (this.level == 5) {
					return n==1 ? !(obj.fcontactStatus == n) : obj.fcontactStatus == n
				}
			},
			
			//判断是否显示工厂统计数量
			retNum(i){
				return (this.level==5||this.level==2)&&i==1&&this.notPickedUpNum!=0;
			},			
			
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
			
			//实时获取输入值
			onKeyInput(event){
				if(event.target.value)
					this.iptClose = true
				else
					this.iptClose = false
			},
			//清空输入框值
			removeInput(){
				this.iptClose = false;
				this.mumeClick(0)
			},
			//搜索
			searchPhone(){			
				if(this.iptClose) {
					this.isSerch = true;
					this.mumeClick(0)
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
			this.getCount()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		
	}
</script>

<style lang="scss" scoped>
	@import 'roleOrder.scss';
	@import '@/packageA/pageA.scss';
</style>
