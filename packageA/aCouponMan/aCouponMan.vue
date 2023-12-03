<template>
	<view class="allBg flexBox">
		<view class="rod-mume">
			<view v-for="i in mumeArr" :key="i.id" :class="['mume-item',{'mume-item-act':i.id==listQuery.status}]" @click="mumeClick(i.id)">
				<span>{{i.name}}</span><span v-if="i.id==listQuery.status&&total!=0">({{total}})</span>
			</view>
		</view>
		<view class="tabBox">
			<view :class="['tab',{'tab-act':listQuery.type == 2}]" @click="tabClick(2)">满减券</view>
			<view :class="['tab',{'tab-act':listQuery.type == 1}]" @click="tabClick(1)">新人券</view>
		</view>
		
		<scroll-view scroll-y="true" lower-threshold="50" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop" class="boxScroll acmBox">
			<view class="acm-main">
				<view class="main-item" v-for="(item,index) in list" :key="index">
					<view class="item-lt">
						<view class="lt-top">
							<p class="top-mon">券面额:￥<span class="mon-b">{{item.amount}}</span> </p>		
							<p class="top-p">(满{{item.conditionAmount}}元可用)</p>
							<p class="top-r" v-if="item.ifStock">券已领完</p>
						</view>
						<view class="md-p2">
							<span class="p2-span">券ID: {{item.id}}</span>
							<span class="p2-span">券数量: {{item.totalNum||0}}</span>
							<span class="p2-span">券已领取数量: {{item.limitNum||0}}</span>
						</view>
						<view class="md-p">优惠券领取时间：</view>
						<view class="md-p1">{{item.possessStartTime}} - {{item.possessEndTime}}</view>
						<view class="md-p">优惠券使用时间</view>
						<view class="md-p1">{{item.useStartTime}} - {{item.useEndTime}}</view>
					</view>
					<view class="item-rt">
						<view class="rt-del" @click="delClick(item.id,index)"><uni-icons type="trash" size="36rpx" color="#fff"></uni-icons><p>删除</p></view>
						<view class="rt-share" v-if="listQuery.status==2&&!item.ifStock" @click="openShare(item.id)">分享</view>
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
		
		<view class="acm-btn">
			<view class="btn" @click="toAddCou">新增优惠券</view>
		</view>
		
		<!-- 分享弹窗 -->
		<uni-popup ref="sharePopup" type="center">
			 <view class="timePpBox">
				 <view class="share-main">
					<view class="tk-item">
						<span class="tk-span">分享标题：</span>
						<input type="text" v-model="shareCou.title" placeholder="请输入分享标题" class="tk-ipt">
					</view>
					<view class="tk-item" >
						<span class="tk-span">分享图片：</span>
						<textarea  @blur="bindTextAreaBlur($event,'imgs')" v-model="shareCou.img" auto-height placeholder="请输入分享图片地址" class="tk-ipt"/>
					</view>
					<view class="tk-img" >
						<uni-file-picker
							limit="1" 
							v-model="shareCou.imgs" 
							@select="select($event,'imgs','img')"  
							@delete="deletea($event,'imgs','img')">
						</uni-file-picker>
					</view>
					<view class="tk-item" >
						<span class="tk-span">页面背景图：</span>
						<textarea  @blur="bindTextAreaBlur($event,'bgImgs')" v-model="shareCou.bgImg" auto-height placeholder="请输入页面背景图地址" class="tk-ipt"/>
					</view>
					<view class="tk-img" >
						<uni-file-picker
							limit="1" 
							v-model="shareCou.bgImgs" 
							@select="select($event,'bgImgs','bgImg')"  
							@delete="deletea($event,'bgImgs','bgImg')">
						</uni-file-picker>
					</view>
					
				 </view>
				 <view class="pp-btn">
					 <view class="btn1" @click="shareClose">取消</view>
					 <view class="btn1 blue">
						 <button type="default" open-type="share" class="itemBox-btn"></button>
						 分享
					</view>
				 </view>
			 </view>
		 </uni-popup>
		 
	</view>
</template>

<script>
	import { AcouponList,AcouponDel } from '@/api/page/manage.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mumeArr:[
					{name:'未开始', id:1 },
					{name:'活动中', id:2 },
					{name:'已结束', id:3 },
				],
				shareCou:{	//分享优惠券数据
					imgs: [],
					img:'',
					bgImgs: [],
					bgImg:'',
				},
				
				listQuery:{
					pageNo:1,
					pageSize:10,
					status:2,
					type:2,
				},
				list:[],
				total:0,
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
			this.initData()
		},
		onShow() {
			var _that = this;
			uni.$once('addCou',function(data){
				_that.listQuery.status =  -1;
				_that.mumeClick(2)
			})
		},
		methods: {
			mumeClick(n){
				if(n==this.listQuery.status) return;
				this.loadStatus = 'loading'
				this.list = [];
				this.listQuery.status = n;
				this.listQuery.pageNo = 1;
				this.listQuery.type = 2;	
				this.initData();
			},
			
			tabClick(n){
				if(n==this.listQuery.type) return;
				this.loadStatus = 'loading'
				this.list = [];
				this.listQuery.pageNo = 1;
				this.listQuery.type = n;
				this.initData();
			},
			
			delClick(id,index){
				uni.showModal({
					title:"温馨提示",
					content:"确定删除当前优惠券?",
					confirmText:"确定",
					success: (res)=> {
						if (res.confirm) {
							AcouponDel({ id }).then((res) => {
								if(res.code == 200){
									uni.showToast({ title: `删除成功`,icon:'success' });
									this.list.splice(index, 1);
								}
							})
						} else if (res.cancel) {}
					}
				});
				
			},
			
			toAddCou(){
				uni.navigateTo({
				    url: '/packageA/addCoupon/addCoupon' 
				});
			},
			
			initData() {
				AcouponList(this.listQuery).then((res) => {
					if (res.code === 200) {
						this.total = res.data.totalItems;
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
			
			bindTextAreaBlur(e,fl){
				this.shareCou[fl] = [];
				this.shareCou[fl].push({
					url:e.detail.value
				})
			},
			openShare(id){
				this.shareCou.id = id;
				this.$refs.sharePopup.open()
			},
			shareClose(){
				this.$refs.sharePopup.close();
				this.shareCou = {	
					imgs: [],
					img:'',
					bgImgs: [],
					bgImg:''
				}
			},
			// 分享给好友
			onShareAppMessage(options){
				var that = this;
				var shareObj = {
					title: this.shareCou.title || '跃动洗鞋:专业洗鞋 修鞋 干洗衣服',        
					path: '/pages/getCou/getCou?id=' + this.shareCou.id + '&imgUrl=' + this.shareCou.bgImg,        // 默认是当前页面，必须是以‘/’开头的完整路径
					imageUrl: this.shareCou.img || `${this.$BASE_URLS.FILE_BASE_URL}/a22373d4-fbb0-4fd5-bf45-f3d47e29f93f.jpg`, // 图片封面，本地文件路径、网络图片路，支持PNG及JPG，默认当前页面截图，显示图片长宽比是 5:4。
				}
				// 来自页面内的按钮的转发
				if( options.from == 'button' ){
					// 返回shareObj
					return shareObj;
				}
			},
			// 获取上传状态
			select(e,imgs,img){
				e.tempFilePaths.forEach((item)=>{
					const imgUrl = item
					uni.uploadFile({
						url: this.$BASE_URLS.FILE_upload_URL+'/elantra/img/file-upload', 
						filePath: imgUrl,
						name: 'file',
						header:{"Content-Type": "multipart/form-data"},
						success: (res) => {
							this.shareCou[img] = JSON.parse(res.data).data
							this.shareCou[imgs].push({
								url:JSON.parse(res.data).data,
							})
						}
					});
				})	
			},
			// 图片删除
			deletea(e,fls,fl){
				const num = this.shareCou[fls].findIndex(v => v.url === e.tempFilePath);
				this.shareCou[fls].splice(num, 1);
				this.shareCou[fl] = ''
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
	@import 'aCouponMan.scss';
	@import '../pageA.scss';
</style>
