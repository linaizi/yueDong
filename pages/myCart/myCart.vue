<template>
	<view class="allBg flexBox">
		<uni-nav-bar statusBar="true" backgroundColor="#fff" title="购物车" fixed></uni-nav-bar>
		
		 <view class="myCart-top">商品库存有限，请尽快下单  <p v-if="!noDataShow" @click="editClick">{{showJs?"编辑":"完成"}}</p></view>
		 
		<scroll-view scroll-y="true" lower-threshold="50"
			@scrolltolower="scrollLower" 
		 	@scroll='fromTop' 
		 	:scroll-top="scrollTop"
		 	class="boxScroll scrollView"
		 	:refresher-enabled="isOpenRefresh"
		 	:refresher-triggered="triggered"
		 	@refresherpulling="onPulling"
		 	@refresherrefresh="onRefresh"
		 	@refresherrestore="onRestore"
		 	@refresherabort="onAbort" >
			
				<view class="myCartList">
					<view class="myCartItem" v-for="(item,index) in list" :key="index">
						<view :class="['circle',{'circle-red':item.check}]" @click="goodsClick(index)"></view>
						<view class="itemRt">
							<image :src="item.goodsInfoDto.goodsPic" class="rt-Img"></image>
							<view class="rt-mid">
								<view class="mid-name overflow2">{{item.goodsInfoDto.goodsName}}</view>
								<view class="mid-gz">规格：默认</view>
								<view class="mid-price">
									{{item.goodsInfoDto.goodsNowPrice}}
									<uni-number-box 
										v-model="item.goodsNum" 
										@minus="minClick(index)" 
										@plus="plusClick(index)" 
										@change="chgClick($event,index)"
										@focus="fcClick"
										background="#fff" 
										:min="1" 
										class="uniNum" />
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view v-show="isLoadMore" class="more_loading">  
						<uni-load-more :status="loadStatus" :contentText="contentText"></uni-load-more>
				</view>
		 </scroll-view>
		 
		 <view class="noGood" v-if="noDataShow">
				<image :src="FILE_BASE_URL + '/170c312a-64df-4b04-aa59-7cea333acc60.png'" mode="widthFix" class="noGood-img"></image>
				<p>购物车还是空的哦</p>
		 </view>
		 
		 <view class="myCart-foot">
				<view class="foot-lt" @click="allCkClick">
					<view :class="['circle',{'circle-red':allCheck}]"></view>
					<span class="lt-span">全选</span>
					<span class="red" v-if="showJs">总计: ￥{{totalMoney}}</span>
				</view>
				<view :class="['foot-rt',{'foot-rt-act':totalMoney>0}]" v-if="showJs" @click="jieSuan">去结算</view>
				<view :class="['foot-del',{'foot-del-act':showDel}]" v-else @click="delClick">删除</view>
		 </view>
		 
		 <view class="goTop" @click="toTop" v-if="flag">
		 		<image :src="FILE_BASE_URL + '/72355db4-ef1e-4845-b601-ba7fdd905cd4.png'" mode="aspectFit" class="goTop-img"></image>
		 </view>
		 
		  <Tabbar :tabid="3"></Tabbar>
	</view>
</template>

<script>
	import Tabbar from "@/components/tabbar/tabbar.vue"
	import { shoppingPage,shoppingDel,shoppingEditNum } from '@/api/page/index.js'
	export default {
		components: {
			Tabbar,
		},
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				noDataShow:false,
				totalMoney:0.00,
				numberValue:1,
				showJs:true, //显示结算，false显示删除
				allCheck:false, 
				showDel:false,
				ids:[],
				listQuery:{
					pageNo:1,
					pageSize:10
				},
				list:[],
				
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
				ysNum:1, //修改商品数量前的值
			}
		},
		onLoad(option) {
			this.initData()
		},
		onShow(){
			uni.hideTabBar({ //隐藏系统自动的底部导航
					animation: false
			})
		},
		methods: {
			initData(){
				shoppingPage(this.listQuery).then((res) => {
					if(res.code == 200){
						if(this.listQuery.pageNo<=res.data.totalPages){
							this.list.push(...res.data.data);
							this.isLoadMore=false
							this.loadStatus='loading'
							
							this.list.forEach((item) => {
								this.$set(item,'check',false)
							});
						}else{
							if(this.listQuery.pageNo == 1){
								this.isLoadMore=false;
							}else{
								this.isLoadMore=true
								this.loadStatus='nomore'
							}
						}
						
						this.noDataShow = this.list.length>0 ? false : true;
					}
				}).catch(e=>{
					this.isLoadMore=false
				});
				
			},
			
			//编辑事件
			editClick(){
				this.showJs = !this.showJs;
				this.list.forEach((item) => {
					item.check = false;
				});
				this.allCheck = false;
				this.totalMoney = 0;
			},
			
			//点击商品事件
			goodsClick(index) {
				this.list[index].check = !this.list[index].check;
				this.handleEdit()
		
				// 检查是否所有商品都被选中
				this.allCheck = this.list.every((item) => item.check);
			},
			
			//全选事件
			allCkClick() {
				this.allCheck = !this.allCheck;
				this.list.forEach((item) => {
					item.check = this.allCheck;
				});
				
				this.handleEdit()
			},
			
			//统计总金额
			handleEdit() {
				if(this.showJs){
					this.totalMoney = this.list
						.filter((item) => item.check)
						.reduce((total, item) => total + item.goodsInfoDto.goodsNowPrice*item.goodsNum, 0);
					this.totalMoney = parseFloat(this.totalMoney.toFixed(2));
				}else{
					this.ids = this.list.filter((item) => item.check).map((item) => item.id);
					this.showDel = this.ids.length > 0;
				}
			},
			
			minClick(i){
				this.ysNum = this.list[i].goodsNum 
			},	
			plusClick(i){
				this.ysNum = this.list[i].goodsNum 
			},
			fcClick(e){
				this.ysNum = e.detail.value
			},
			chgClick(value,i){
				this.EditNum(i,value)
			},
			EditNum(i,goodsNum){
				let parm = {
					 goodsId:this.list[i].goodsId,
					 goodsNum		
				}
				shoppingEditNum(parm).then((res) => {
					if(res.code == 200){
						this.handleEdit()
					}else{
						this.list[i].goodsNum = this.ysNum;
					}
				});
			},
			
			//点击结算事件
			jieSuan(){
				if(this.totalMoney<=0) return;
				
				const arr = this.list
				  .filter(item => item.check)
				  .map(item => {
				    const info = { ...item.goodsInfoDto }; 
				    info.goodsNum = item.goodsNum;
				    return info;
				  });
				
				uni.navigateTo({
				    url: '/pages/buy/buy?goodsData=' + JSON.stringify(arr)
				});
			},
			//删除事件
			delClick(){
				if(this.ids.length<=0) return;
				let param = {
					ids:this.ids.join(',')
				}
				shoppingDel(param).then((res) => {
					if(res.code==200){
						uni.showToast({title: '删除成功', icon:'success'});
						this.listQuery.pageNo = 1;
						this.list = []
						this.initData();
					}
				});
			},
			
			scrollLower(){
				if(!this.isLoadMore){  //此处判断，上锁，防止重复请求
					this.isLoadMore = true
					this.listQuery.pageNo++
					this.initData()
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
					this.listQuery.pageNo = 1
					this.list = []
					this.initData()
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
	@import 'myCart.scss'
</style>
