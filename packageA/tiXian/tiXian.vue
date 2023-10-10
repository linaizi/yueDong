<template>
	<view class="allBg flexBox">
		<view class="rod-mume">
			<view v-for="i in mumeArr" :key="i.id" :class="['mume-item',{'mume-item-act':i.id==listQuery.status}]" @click="mumeClick(i.id)">
				<span>{{i.name}}</span>
			</view>
		</view>
		<view class="asp-top">
			<view class="top-lt">
				<input type="text" 
					placeholder="请输入昵称搜索" 
					v-model="iptTxt" 
					@confirm="searchOrder" 
					@input="onKeyInput"
					placeholder-style="color:#999;fontSize:26rpx" 
					class="searchInput"/>
				<image v-if="iptClose" class="lt-right" @click="removeInput" :src="FILE_BASE_URL + '/2c34c18c-7b4c-498a-83e2-e03bcd59b07d.jpg'"></image>
			</view>
			<view class="top-serch" @click="searchOrder">搜索</view>
		</view>
		
		<scroll-view scroll-y="true" lower-threshold="150" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop" class="boxScroll">
			<view class="user-main">
				<view class="main-item" v-for="(item,index) in list" :key="item.uid">
					<view class="item-top">
						<image :src="item.adminUserDto.avatar" class="top-img"></image>
						<view class="top-mid">
							<view class="mid-name">
								{{item.adminUserDto.nickName}} <span class="n-g">{{item.adminUserDto.levelName}}</span> 
								<span class="n-g" v-if="item.adminUserDto.level==2&&item.adminUserDto.shopName">({{item.adminUserDto.shopName}})</span>
							</view>
							<view class="mid-p">手机号：{{item.adminUserDto.phone}}</view>
							<view class="mid-p" v-if="item.status!=1||item.status!=3">提现单号:<span>{{item.tradeSn}}</span></view>
							<view class="mid-p">申请时间:<span>{{item.createTime}}</span></view>
						</view>
						<view class="top-rt">
							<view class="rt-p">{{item.statusText}}</view>
							<view class="rt-mon">-<span>￥</span>{{item.amount}}</view>
						</view>
						
					</view>
					<view class="item-btn">
						<view class="btn" @click="laHeiClick(item.uid,index)">拉黑</view>
						<view class="btn" @click="xgClick(item.uid)">修改信息</view>
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
		
		<view class="noGood" v-if='noDataShow'>
			<image :src="FILE_BASE_URL + '/f426289f-7fe0-4431-ab45-78262049c918.png'" mode="widthFix" class="noGood-img"></image>
			<p>暂无数据~</p>
		</view>
		
		<!-- 修改信息弹窗 -->
		<uni-popup ref="XGpopup" type="bottom">
			<view class="XGmain">
				<view class="item" @click="DJClick">修改会员等级</view>
				<view class="item blue" @click="closeXG">取消</view>
			</view>
		</uni-popup>
		<!-- 修改会员等级弹窗 -->
		<uni-popup ref="DJPopup" type="center">
			 <view class="DJPpBox">
				 <view class="pp-title">修改会员等级</view>
				 <view class="pp-tm">
					 <view v-for="(t,i) in djArr" :key="i" :class="['tm-item',{'tm-item-act':i==djAct}]" @click="tmClick(i)">{{t.name}}</view>
				 </view>
				 
				 <view class="pp-btn">
					 <view class="btn1" @click="djClose">取消</view>
					 <view class="btn1 blue" @click="djYes">确认</view>
				 </view>
			 </view>
		 </uni-popup>
		
	</view>
</template>

<script>
	import { AwithdrawPage } from '@/api/page/manage.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mumeArr:[
					{name:'未审核', id:1 },
					{name:'打款中', id:2 },
					{name:'提现驳回', id:3 },
					{name:'打款失败', id:4 },
					{name:'提现成功', id:5 },
				],
				iptTxt:'',
				iptClose:false,
				
				
				djArr:[],
				djAct:0,
				xGuid:0,
				
				listQuery:{
					pageNo:1,
					pageSize:10,
					status:1
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
		methods: {
			mumeClick(id){
				this.list = [];
				this.loadStatus = 'loading'
				this.iptTxt = "";
				this.listQuery.realName = "";
				this.listQuery.pageNo = 1;
				this.listQuery.status  = id;
				
				this.initData();
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
				this.iptTxt = "";
				this.iptClose = false;
			},
			//搜索事件
			searchOrder(){
				this.listQuery.realName = this.iptTxt;
				this.listQuery.pageNo = 1;
				this.list = [];
				this.initData(); 
			},
			
			//修改信息
			xgClick(id){
				this.$refs.XGpopup.open();
				this.xGuid = id;
			},
			closeXG(){
				this.$refs.XGpopup.close();
			},
			DJClick(){
				this.$refs.XGpopup.close();
				this.$refs.DJPopup.open();
				this.djArr = this.mumeArr.filter(item => item.id != 0 && item.id != 2)
			},
			//选择修改后的等级
			tmClick(n){
				this.djAct = n;
			},
			djClose(){
				this.$refs.DJPopup.close();
			},
			djYes(){
				uni.showModal({
					title:"温馨提示",
					content:"确定修改当前用户等级?",
					confirmText:"确定",
					success: (res)=> {
						if (res.confirm) {
							let param = {
								level: this.djArr[this.djAct].id,
								uid: this.xGuid
							}
							AeditLevel(param).then((res) => {
								if(res.code == 200){
									uni.showToast({title:"修改成功",icon:'success'})
									this.listQuery.pageNo = 1;
									this.list = [];
									this.initData(); 
									this.$refs.DJPopup.close();
								}
							})
						} else if (res.cancel) {}
					}
				});
			},
			
			laHeiClick(uid){
				uni.showModal({
					title:"温馨提示",
					content:"确定拉黑当前用户?",
					confirmText:"确定",
					success: (res)=> {
						if (res.confirm) {
							AuserBlock({ uid }).then((res) => {
								if(res.code == 200){
									uni.showToast({title:"已拉黑",icon:'success'})
									this.list.splice(index, 1);
								}
							})
							
						} else if (res.cancel) {}
					}
				});
				
			},
			
			initData() {
				AwithdrawPage(this.listQuery).then((res) => {
					if (res.code === 200) {
					  if (this.listQuery.pageNo<=res.data.totalPages) {
							this.noDataShow = false;
							this.list.push(...res.data.data);
				
							if(this.listQuery.pageNo==res.data.totalPages){  //判断接口返回数据量小于请求数据量，则表示此为最后一页
								this.isLoadMore=true;                                             
								this.loadStatus='nomore';
							}else{
								this.isLoadMore=false;
								this.loadStatus='loading';
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
	@import 'tiXian.scss'
</style>
