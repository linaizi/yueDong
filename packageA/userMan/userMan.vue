<template>
	<view class="allBg flexBox">
		<view class="rod-mume">
			<view v-for="i in mumeArr" :key="i.id" :class="['mume-item',{'mume-item-act':i.id==listQuery.level}]" @click="mumeClick(i.id)">
				<span>{{i.name}}</span>
			</view>
		</view>
		<view class="asp-top">
			<view class="top-lt">
				<input type="text" 
					placeholder="请输入用户ID|昵称|手机号|真实姓名" 
					v-model="iptTxt" 
					@confirm="searchOrder" 
					@input="onKeyInput"
					placeholder-style="color:#999;fontSize:26rpx" 
					class="searchInput"/>
				<image v-if="iptClose" class="lt-right" @click="removeInput" :src="FILE_BASE_URL + '/2c34c18c-7b4c-498a-83e2-e03bcd59b07d.jpg'"></image>
			</view>
			<view class="top-serch" @click="searchOrder">搜索</view>
		</view>
		
		<view class="user-tab">
			<view v-for="i in tabArr" :key="i.id" :class="['tab-item',{'tab-item-act':i.id==tabAct}]" @click="tabClick(i)">
				<view class="item-name">{{i.name}}</view>
				<image v-if="i.check==0" class="icon-img" src="../../static/img/0.jpg" ></image>
				<image v-else-if="i.check==1" class="icon-img" src="../../static/img/1.jpg" ></image>
				<image v-else class="icon-img" src="../../static/img/2.jpg" ></image>
			</view>
		</view>
		
		<scroll-view scroll-y="true" lower-threshold="150" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop" class="boxScroll">
			<view class="user-main">
				<view class="main-item" v-for="(item,index) in list" :key="item.uid">
					<view class="item-top">
						<image :src="item.avatar" class="top-img"></image>
						<view class="top-rt">
							<view class="rt-name">
								{{item.nickName}} <span class="n-g">{{item.levelName}}</span> 
								<span class="n-g n6" v-if="item.level==2&&item.shopName">({{item.shopName}})</span>
								<span class="n-g n6" v-if="item.level==3&&item.headName">({{item.headName}})</span>
							</view>
							<view class="rt-p">手机号：{{item.phone}}</view>
							<view class="rt-p">用户ID：{{item.uid}}</view>
							<view class="rt-p">注册时间：{{item.createTime}}</view>
						</view>
						
						<view class="top-zd" v-if="item.level==4" @click="zdClick(item.uid)">
							<uni-icons type="staff" size="56rpx" color="#777"></uni-icons>
							<p class="zd-p">站点</p>
						</view>
					</view>
					<view class="item-list">
						<view class="item-it"><span class="it-s">交易额</span>￥{{item.payAmount}}</view>
						<view class="item-it"><span class="it-s">余额</span>￥{{item.balance}}</view>
						<view class="item-it"><span class="it-s">订单数</span>￥{{item.orderNum}}</view>
					</view>
					<view class="item-btn">
						<view class="btn" @click="laHeiClick(item.uid,index)">拉黑</view>
						<view class="btn" @click="xgClick(item)">操 作</view>
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
		
		<!-- 修改信息弹窗 -->
		<uni-popup ref="XGpopup" type="bottom">
			<view class="XGmain">
				<view class="item" @click="addFzrClick" v-if="level==3">修改代收点负责人</view>
				<view class="item" @click="DJClick">修改会员等级</view>
				<view class="item blue" @click="closeXG">取消</view>
			</view>
		</uni-popup>
		<!--修改代收点负责人弹窗 -->
		<uni-popup ref="FZRpopup" type="bottom">
			<view class="XGmain">
				<view class="item" v-for="f in fzrData" :key="f.uid" @click="editFZR(f.uid,false)">{{f.nickName}}</view>
				<view class="item" @click="editFZR(0,true)">无负责人</view>
				<view class="item blue" @click="closeFZR">取 消</view>
			</view>
		</uni-popup>
		<!--负责任人名下站点弹窗 -->
		<uni-popup ref="ZDpopup" type="bottom">
			<view class="XGmain">
				<view class="item" v-for="f in zdData" :key="f.cid" >{{f.shopName}}</view>
				<view class="item blue" @click="closeZD">关 闭</view>
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
	import { AuserList,AeditLevel,AuserBlock,AeditGroup,AuserFindCol } from '@/api/page/manage.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mumeArr:[
					{name:'全部', id:0 },
					{name:'用户', id:1 },
					{name:'骑手', id:2 },
					{name:'代收点', id:3 },
					{name:'代收点负责人', id:4 },
					{name:'工厂', id:5 },
				],
				iptTxt:'',
				iptClose:false,
				
				tabArr:[
					{name:'交易额', id:0, check:0 },
					{name:'订单数', id:1, check:0 },
				],
				tabAct:0,
				djArr:[],
				djAct:0,
				xGuid:0,
				level: 0, //修改信息获取用户等级
				fzrData:[],//负责人数据
				xGheadName:'', //操作当前站点对应的负责人
				zdData:[],//负责人名下站点数据
				
				listQuery:{
					pageNo:1,
					pageSize:10,
					level:0
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
				this.listQuery.content = "";
				this.listQuery.pageNo = 1;
				this.listQuery.level  = id;
				this.listQuery.sort = undefined;
				this.tabAct=0;
				this.tabArr.forEach((item)=>{
					item.check = 0
				})
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
				this.searchOrder()
			},
			//搜索事件
			searchOrder(){
				this.listQuery.content = this.iptTxt;
				this.listQuery.pageNo = 1;
				this.list = [];
				this.initData(); 
			},
			
			tabClick(i){
				if (this.tabAct !== i.id) {
					let prevTab = this.tabArr.find(tab => tab.id === this.tabAct);
					if (prevTab) prevTab.check = 0;
					i.check = 1
					this.tabAct = i.id;
				}else{
					if(i.check == 1) i.check = 2;
					else if(i.check == 2 || i.check == 0) i.check = 1;
				}
				
				if (i.id === 0) {
				    this.listQuery.sort = i.check === 0 ? undefined : (i.check === 1 ? 2 : 1);
				} else {
					this.listQuery.sort = i.check === 0 ? undefined : (i.check === 1 ? 4 : 3);
				}
				
				this.listQuery.pageNo = 1;
				this.list = [];
				this.initData(); 
			},
			
			//修改信息
			xgClick(item){
				this.$refs.XGpopup.open();
				this.xGuid = item.uid;
				this.xGheadName = item.headName;
				this.level = item.level;
			},
			closeXG(){
				this.$refs.XGpopup.close();
			},
			DJClick(){
				this.$refs.XGpopup.close();
				this.$refs.DJPopup.open();
				this.djArr = this.mumeArr.filter(item => item.id != 0 && item.id != this.level && item.id != 2)
			},
			//选择修改后的等级
			tmClick(n){
				this.djAct = n;
			},
			djClose(){
				this.$refs.DJPopup.close();
				this.djAct=0;
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
									this.djClose();
								}
							})
						} else if (res.cancel) {}
					}
				});
			},
			
			//修改负责人弹窗
			addFzrClick(){
				let paran = {
					pageNo: 1,
					pageSize: 20,
					level: 4
				}
				AuserList(paran).then((res) => {
					if (res.code === 200) {
						this.fzrData = res.data.filter(item => item.nickName != this.xGheadName)
						this.$refs.XGpopup.close();
						this.$refs.FZRpopup.open();
					}
				})
			},
			editFZR(uid,ifCancel){
				let paran = {
					cId: this.xGuid,
				}
				
				paran.rId = ifCancel ? 0 : uid;
				paran.ifCancel = ifCancel
			
				AeditGroup(paran).then((res) => {
					if (res.code === 200) {
						uni.showToast({title:"修改成功",icon:'success'})
						this.listQuery.pageNo = 1;
						this.list = [];
						this.initData(); 
						this.closeFZR();
					}
				})
			},
			closeFZR(){ this.$refs.FZRpopup.close() },
			
			//负责人名下站点弹窗
			zdClick(uid){
				let param = {
					pageNo:1,
					pageSize:20,
					rId:uid
				}
				AuserFindCol(param).then((res) => {
					if (res.code === 200) {
						if(res.data.length==0){
							uni.showToast({title: '当前用户暂无代收点~', icon:'none'});
						}else{
							this.$refs.ZDpopup.open();
							this.zdData = res.data;
						}
					}
				})
			},
			closeZD(){ this.$refs.ZDpopup.close() },
			
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
				AuserList(this.listQuery).then((res) => {
					if (res.code === 200) {
						if (res.data.length>0) {
							this.noDataShow = false;
							this.list.push(...res.data);
			
							if(res.data.length<this.listQuery.pageSize){  //判断接口返回数据量小于请求数据量，则表示此为最后一页
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
	@import 'userMan.scss';
	@import '../pageA.scss';
</style>
