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
					placeholder="请输入真实姓名搜索" 
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
								{{item.adminUserDto.nickName}}({{item.realName}}) <span class="n-g">{{item.adminUserDto.levelName}}</span> 
								<span class="n-g" v-if="item.adminUserDto.level==2&&item.adminUserDto.shopName">({{item.adminUserDto.shopName}})</span>
							</view>
							<view class="mid-p">手机号：{{item.adminUserDto.phone}}</view>
							<view class="mid-p overflow1" v-if="item.status!=1||item.status!=3">提现单号:<span>{{item.tradeSn}}</span></view>
							<view class="mid-p">申请时间:<span>{{item.createTime}}</span></view>
						</view>
						<view class="top-rt">
							<view :class="['rt-gray',{'rt-red':[2,3,4].includes(item.status)},{'rt-blue':item.status==5}]">{{item.statusText}}</view>
							<view class="rt-mon">-<span>￥</span>{{item.amount}}</view>
						</view>
						
					</view>
					<view class="item-btn" v-if="item.status==1">
						<view class="btn" @click="noClick(item.id)">驳回</view>
						<view class="btn" @click="yesClick(item.id)">同意</view>
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
			<image :src="FILE_BASE_URL + '/f426289f-7fe0-4431-ab45-78262049c918.jpg'" mode="widthFix" class="noGood-img"></image>
			<p>暂无数据~</p>
		</view>
		
		<!-- 驳回弹窗 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="驳回内容" 
				placeholder="请输入内容" @confirm="iptConfirm"></uni-popup-dialog>
		</uni-popup>
					
	</view>
</template>

<script>
	import { AwithdrawPage,AwithdrawOperate } from '@/api/page/manage.js'
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
				id:null,
				
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
				if(this.listQuery.status == id) return;
				
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
				this.searchOrder();
			},
			//搜索事件
			searchOrder(){
				this.listQuery.realName = this.iptTxt;
				this.listQuery.pageNo = 1;
				this.list = [];
				this.initData(); 
			},
			
			noClick(id){
				this.$refs.inputDialog.open();
				this.id = id;
			},
			iptConfirm(val){
				this.toOperate(this.id,2,val)
			},
			
			yesClick(id){
				uni.showModal({
					title:"温馨提示",
					content:"确定同意当前用户的提现?",
					confirmText:"确定",
					success: (res)=> {
						if (res.confirm) {
							this.toOperate(id,1)
						} else if (res.cancel) {}
					}
				});
				
			},
			
			toOperate(id,status,remark){
				let param = {
					id,
					status,
					remark
				}
				
				AwithdrawOperate(param).then((res) => {
					if(res.code == 200){
						uni.showToast({title:"操作成功",icon:'success'})
						this.listQuery.pageNo = 1;
						this.list = [];
						this.initData(); 
					}
				})
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
