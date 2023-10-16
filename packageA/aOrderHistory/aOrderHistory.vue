<template>
	<view class="contentBox flexBox">
		<view class="searchTab">
			<view class="searchBox">
				<image :src="FILE_BASE_URL + '/cfd43614-25da-4901-af66-896843c02ebe.jpg'" class="searchIcon"></image>
				<input type="text" :placeholder="phInput" v-model="inputTxt" @confirm="searchOrder" placeholder-style="color:#999;fontSize:28rpx" class="searchInput"/>
				<view class="searchBox-right" @click="removeInput">
					<image class="searchBox-right-icon" :src="FILE_BASE_URL + '/2c34c18c-7b4c-498a-83e2-e03bcd59b07d.jpg'"></image>
				</view>
			</view>
			<view class="searchBtn searchOrderBtn" @click="searchOrder">搜索</view>
		</view>
		
		<view class="historyBox orderHistory" v-show="show1">
			<view class="titleBox">
				<view>历史搜索</view>
				<image :src="FILE_BASE_URL + '/fe76d0bb-15eb-4892-83d5-8052f2de0537.jpg'" class="delIcon" @click="delHistory"></image>
			</view>
			<view class="listBox">
				<view class="itemBox" v-for="(item,index) in odHistory.slice(0,10)" :key="index" @click="hisClick(index)">{{item}}</view>
			</view>
		</view>
	
		<view class="noData" v-show="noDataShow">
			<image :src="FILE_BASE_URL + '/090f837d-62e0-424a-b83e-1db06563e6e8.jpg'"></image>
			<view>未找到此订单</view>
		</view>
		
		<scroll-view class="boxScroll aod-box" scroll-y="true" lower-threshold="10" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop">

			<view class="ordre-main" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
				<view class="main-top">
					<view class="top-lt" @click="copy(item.orderNo)">订单号：{{item.orderNo}}</view>
					<view class="top-rt">{{rtStatus(item.status)}}</view>
				</view>
				<view class="phone">
					{{item.name}} <span class="phone-sp">{{item.phone}}</span>
					<view class="phone-tell" @click.stop="PhoneCall(item.phone)">
						<uni-icons type="phone" size="30rpx" color="#446DFD"></uni-icons>联系收货人
					</view>
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
						<span>合计：</span>￥{{totalMon(item.goodsInfo)+item.freightAmount}}<span v-if="item.freightAmount">(含运费￥{{item.freightAmount}})</span>
					</p>
				</view>
				<view class="mian-cz">
					<view class="cz-lt">
						<!-- <view class="lt-txt" @click="moreClick(item.orderId)">更多</view> -->
						<!-- <view class="lt-more" v-if="isMoreVisible(item.orderId)">
							<view class="more">确认收货</view>
							<view class="more">打印小票</view>
						</view> -->
					</view>
					<view class="cz-rt">
						<view class="rt-btn" @click.stop="openSta(item)">修改订单状态</view>
						<!-- <view class="rt-btn" @click="bzClick">备注</view> -->
						<!-- <view class="rt-btn rt-btn1">发货</view> -->
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
		
		<!-- 修改订单状态弹窗 -->
		<uni-popup ref="staPopup" type="center">
			 <view class="timePpBox">
				 <view class="pp-title">修改订单状态</view>
				 <view class="pp-tm">
					 <view v-for="(s,sid) in staArr" :key="sid" :class="['tm-item',{'tm-item-act':sid==staId}]" @click="staClick(sid)">{{s.name}}</view>
				 </view>
				 <view class="pp-btn">
					 <view class="btn1" @click="staClose">取消</view>
					 <view class="btn1 blue" @click="staYes">确认</view>
				 </view>
			 </view>
		 </uni-popup>
		
	</view>
</template>

<script>
	import { AorderPage,AorderEdit } from '@/api/page/manage.js'
	import { rtStatus } from '@/common/tool.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				phInput:"请输入订单号|商品名称|姓名",
				inputTxt:'',
				odHistory:[],
				show1:true,
				
				mumeArr:[
					{name:'全部', id:0 },
					{name:'待付款', id:1 },
					{name:'已付款', id:2 },
					{name:'已完成', id:11 },
					{name:'骑手未取货', id:3 },
					{name:'骑手已取货', id:4 },
					{name:'厂家未取货', id:5 },
					{name:'厂家已取货', id:6 },
					{name:'代收点已收货', id:7 },
					{name:'送货骑手未取货', id:8 },
					{name:'送货骑手已取货', id:9 },
					{name:'骑手已送达', id:10 },
					{name:'申请售后(待审核)', id:12 },
					{name:'售后成功已关闭', id:13 },
				],
				staArr:[],
				staId:0,
				staObj:{},
				
				listQuery:{
					pageNo:1,
					pageSize:10,
					status:0,
					type: 0
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
		
		onLoad(){
			if(uni.getStorageSync('odHistory')){
			  this.odHistory = JSON.parse(uni.getStorageSync('odHistory'))
			}
		},
		
		methods: {		
			searchOrder(){
				if(!this.inputTxt){
					uni.showToast({title:'请输入订单编号',icon:'none'})
					return;
				}
				
				var t = false
				this.odHistory.forEach((res,index) => {
					if(res == this.inputTxt){ t = true }
				})
				if(!t){
					this.odHistory.unshift(this.inputTxt)
				}
				uni.setStorageSync('odHistory', JSON.stringify(this.odHistory.slice(0,10)))
				
				this.$set(this.listQuery, `content`, this.inputTxt)
				this.listQuery.pageNo = 1
				this.list = [];
				this.initData()
			},
			
			initData(){
				if(!this.listQuery.content){
					uni.showToast({title:'请输入内容',icon:'none'})
					return;
				}
				
				AorderPage(this.listQuery).then((res) => {
					if(res.code == 200){
						this.show1 = false;
						if(this.listQuery.pageNo<=res.data.totalPages){
							console.log(111)
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
				}).catch(e=>{
					this.isLoadMore=false
				})
			},
			
			// 跳转商品详情
			toDetail(item){
				uni.navigateTo({
					url: '/packageA/aOrderDetail/aOrderDetail?orderId=' + item.orderId + "&orderNo=" + item.orderNo
				});
			},
			
			hisClick(i){
				this.inputTxt = this.odHistory[i]
				this.$set(this.listQuery, `content`, this.odHistory[i])
				this.initData()
			},
			
			delHistory(){
				uni.showModal({
					title:"温馨提示",
					content:"确定删除全部历史搜索?",
					confirmText:"确定",
					success: (res)=> {
						if (res.confirm) {
							this.odHistory = []
							uni.setStorageSync('odHistory', JSON.stringify(this.odHistory))
							
						} else if (res.cancel) {}
					}
				});
			},
			
			removeInput(){
				this.show1 = true;
				this.noDataShow = false;
				this.inputTxt = '';
				this.list = []
				this.isLoadMore = false
			},
			
			//返回订单状态
			rtStatus,
			
			totalMon(goodsInfo){
				if(!goodsInfo) return;
				goodsInfo = JSON.parse(goodsInfo);
				return goodsInfo.reduce((total, item) => total + item.goodsNowPrice * item.goodsNum, 0);
			},
			
			//修订订单状态事件
			openSta(s){
				this.staObj = s;
				this.staArr = this.mumeArr.filter(item => item.id != 0 && item.id != s.status)
				this.$refs.staPopup.open();
			},
			staClick(m){
				this.staId = m;
				this.staObj.sta = this.staArr[m].id;
			},
			staClose(){
				this.$refs.staPopup.close();
				this.staId=0;
			},
			staYes(){
				uni.showModal({
					title:"温馨提示",
					content:"确定修改当前订单状态?",
					confirmText:"确定",
					success: (res)=> {
						if (res.confirm) {
							let param = {
								orderId: this.staObj.orderId,
								orderNo: this.staObj.orderNo,
								status: this.staObj.sta,
							}
							AorderEdit(param).then((res) => {
								if(res.code == 200){
									uni.showToast({
										title:"修改成功",
										icon:'success'
									})
									this.staClose();
									this.list = [];
									this.listQuery.pageNo = 1
									this.initData();
								}
							})
							
						} else if (res.cancel) {}
					}
				});
			},
			
			//复制
			copy(value){
				uni.setClipboardData({
					data: value,
					success: function(res) {
						uni.getClipboardData({
							success: function(res) {
								uni.showToast({
									title: '已复制到剪贴板'
								});
							}
						});
					}
				});
			},
			
			//打电话
			PhoneCall(phone){
				uni.makePhoneCall({
					phoneNumber: phone 
				});
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
	@import 'aOrderHistory.scss'
</style>
