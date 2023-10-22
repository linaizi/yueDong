<template>
	<view class="allBg flexBox">
		<view class="aod-top">
			<view class="top-lt" @click="toHis"><uni-icons type="search" size="32rpx" color="#999"></uni-icons> 搜索</view>
			<view class="top-rt" @click="openTimePk">{{timeTxt}}<uni-icons type="bottom" size="36rpx" color="#446DFD" ></uni-icons></view>
		</view>
		
		<view class="aod-mume">
			<view v-for="i in mumeArr.slice(0, 4)" :key="i.id" :class="['mume-item',{'mume-item-act':i.id==listQuery.status}]" @click="mumeClick(i)"> 
				<span>{{i.name}}</span>
			</view>
			<view :class="['mume-item',{'mume-item-act':isActiveItem(listQuery.status)}]" @click="moneShow=!moneShow">
				<span>{{mumeMone}}</span> <uni-icons type="bars" size="30rpx" :color="moneColor" ></uni-icons>
			</view>
			<view class="mone-list" v-if="moneShow">
				<view class="list" v-for="item in mumeArr.slice(-10)" :key="item.id" @click="mumeClick(item)">{{item.name}}</view>
			</view>
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
						<view class="rt-btn" v-if="item.status==12" @click.stop="TKSHclick(item,1)">同意</view>
						<view class="rt-btn rt-btn1" v-if="item.status==12" @click.stop="TKSHclick(item,2)">拒绝</view>
						<!-- <view class="rt-btn" @click="bzClick">备注</view> -->
						<!-- <view class="rt-btn rt-btn1">发货</view> -->
					</view>
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
		
		<!-- 退款审核弹窗 -->
		<uni-popup ref="TKpopup" type="center">
			 <view class="timePpBox">
				 <view class="pp-title">售后理由</view>
				 <view class="pp-tk">
					<view class="tk-item">
						<span class="tk-span">退款原因：</span> {{TKdata.afterReason}}
					</view>
					<view class="tk-item" v-if="TKdata.afterRemark">
						<span class="tk-span">退款备注：</span> {{TKdata.afterRemark}}
					</view>
					<input type="text" v-if="TKdata.status == 2" v-model="TKdata.afterRefuseReason" placeholder="请输入拒绝理由" class="tk-ipt">
				 </view>
				 <view class="pp-btn">
					 <view class="btn1" @click="TKno">取消</view>
					 <view class="btn1 blue" @click="TKyes"> {{TKdata.status === 2 ? '拒绝' : '同意'}}</view>
				 </view>
			 </view>
		 </uni-popup>
					
		<!-- 备注输入框 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose"  mode="input" title="备注" 
				placeholder="请输入备注内容(限15个字符)"  @confirm="iptconfirm">
			</uni-popup-dialog>
		</uni-popup>
		
		<!-- 时间筛选弹窗 -->
		<uni-popup ref="timePopup" type="center">
			 <view class="timePpBox">
				 <view class="pp-title">筛选时间</view>
				 <view class="pp-tm">
					 <view v-for="(t,i) in tmArr" :key="i" :class="['tm-item',{'tm-item-act':i==tmId}]" @click="tmClick(i)">{{t}}</view>
				 </view>
				 <view class="pp-timePk" v-if="tmId==4">
					  <Datetime-Picker v-model="datetimerange" type="datetimerange" rangeSeparator="至" />
				 </view>
				 <view class="pp-btn">
					 <view class="btn1" @click="tmClose">取消</view>
					 <view class="btn1 blue" @click="tmYes">确认</view>
				 </view>
			 </view>
		 </uni-popup>
	
		
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
		 
		<Pgtab :tabid="2"></Pgtab>
	</view>
</template>

<script>
	import Pgtab from "../components/pgtab/pgtab.vue"
	import { AorderPage,AorderEdit,AorderOperate } from '@/api/page/manage.js'
	import { rtStatus } from '@/common/tool.js'
	import DatetimePicker from "@/packageA/uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.vue"
	
	export default {
		components: {
			Pgtab,
			DatetimePicker
		},
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mid: uni.getStorageSync('mid'),
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
					{name:'售后(待审核)', id:12 },
					{name:'已关闭', id:16 },
				],
				mumeMone:'更多状态',
				moneShow:false,
				moneColor:"#666",
				
				tmArr:['汇总','今日','昨日','7日','自定义'],
				timeTxt: '汇总',
				tmId:0,
				datetimerange:[],
				visibleIds: [], // 用于跟踪哪些项目的 "lt-more" 可见
				staArr:[],
				staId:0,
				staObj:{},
				TKdata:{//退款数据
					afterReason:'',
					afterRemark:'',
					afterRefuseReason:'',
					status:'',
				}, 
				
				listQuery:{
					pageNo:1,
					pageSize:10,
					status:0,
					type:0
				},
				list:[],
				noDataShow:false,
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
				this.listQuery.beginTime = this.datetimerange[0]
				this.listQuery.endTime = this.datetimerange[1]
			},
		},
		methods: {
			initData(){
				AorderPage(this.listQuery).then((res) => {
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
						
					}
				}).catch(e=>{
					this.isLoadMore=false
				})
			},
			
			openTimePk(){
				this.$refs.timePopup.open();
				this.moneShow = false;
			},
			
			//mume事件
			isActiveItem(itemId){
				return [4,5,6,7,8,9,10,3,12,13].includes(itemId) ;
			},
			mumeClick(obj){
				if(this.listQuery.status == obj.id) return;
				
				this.listQuery.status = obj.id;
				this.moneShow = false;
				if(this.isActiveItem(obj.id)){
					this.mumeMone = obj.name;
					this.moneColor = '#446DFD'
				}
				else{
					this.mumeMone = '更多状态'
					this.moneColor = '#666'
				}
				this.fetchData()	
			},
			
			//自定义时间事件
			tmClick(i){
				this.tmId = i;
			},
			tmClose(){
				this.$refs.timePopup.close();
				 this.tmId = this.listQuery.type;
			},
			tmYes(){
				if(this.listQuery.type != 4){
					this.listQuery.beginTime = undefined;
					this.listQuery.endTime = undefined;
				}
				this.listQuery.type = this.tmId;
				this.timeTxt = this.tmArr[this.listQuery.type];
				this.$refs.timePopup.close();
				this.fetchData()
			},
			
			fetchData(){
				this.listQuery.pageNo = 1;
				this.list = [];
				this.initData();
			},
			
			//退款审核事件
			TKSHclick(item, n){
				this.$refs.TKpopup.open();
				this.TKdata.orderNo = item.orderNo;
				this.TKdata.afterReason = item.afterReason || '';
				this.TKdata.afterRemark = item.afterRemark || '';
				this.TKdata.afterRefuseReason = ''
				this.TKdata.status = n;
			},
			TKyes(){
				if(this.TKdata.status === 2&&!this.TKdata.afterRefuseReason){
					uni.showToast({title: '拒绝理由不能为空', icon:'none'});
					return;
				}
				let param = {
					orderNo: this.TKdata.orderNo,
					status: this.TKdata.status,
					afterRefuseReason: this.TKdata.afterRefuseReason
				}
				
				var _that = this;
				AorderOperate(param).then((res) => {
					if(res.code == 200){
						uni.showToast({title: '操作成功', icon:'success'});
						_that.$refs.TKpopup.close();
						setTimeout(()=>{
							const currentPages = getCurrentPages();
							uni.redirectTo({
							  url: `/${currentPages[currentPages.length - 1].route}`
							});
						},1000)
					}
				})
			},
			TKno(){
				this.$refs.TKpopup.close();
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
				this.staId=0;
				this.$refs.staPopup.close();
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
									this.staClose()
									this.fetchData();
								}
							})
							
						} else if (res.cancel) {}
					}
				});
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
			toDetail(item){
				uni.navigateTo({
					url: '/packageA/aOrderDetail/aOrderDetail?orderId=' + item.orderId + "&orderNo=" + item.orderNo
				});
			},		
				
			//返回订单状态
			rtStatus,
			
			totalMon(goodsInfo){
				if(!goodsInfo) return;
				goodsInfo = JSON.parse(goodsInfo);
				return goodsInfo.reduce((total, item) => total + item.goodsNowPrice * item.goodsNum, 0);
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
	@import 'aOrder.scss';
	@import '../pageA.scss'
</style>
