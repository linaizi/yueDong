<template>
	<view class="allBg flexBox">
		<view class="asp-top">
			<view class="top-lt">
				<input type="text" 
					placeholder="请输入商品名称搜索" 
					v-model="inputTxt" 
					@confirm="searchOrder" 
					@input="onKeyInput"
					confirm-type="search"
					placeholder-style="color:#999;fontSize:28rpx" 
					class="searchInput"/>
				<image v-if="iptClose" class="lt-right" @click="removeInput" :src="FILE_BASE_URL + '/2c34c18c-7b4c-498a-83e2-e03bcd59b07d.jpg'"></image>
			</view>
			<view class="top-rt" @click="toAddShop">添加商品</view>
		</view>
		
		<view class="rod-mume">
			<view v-for="i in mumeArr" :key="i.id" :class="['mume-item',{'mume-item-act':i.id==listQuery.status}]" @click="mumeClick(i)"> 
				<span>{{i.name}}</span><span v-if="i.id==listQuery.status&&total!=0">({{total}})</span>
			</view>
		</view>
		
		<scroll-view scroll-y="true" lower-threshold="150" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop" class="boxScroll">
				<view class="asp-main">
					<view class="main-item" v-for="(item,index) in list" :key="index">
						<view class="item-lt">
							<image :src="item.goodsPic" class="lt-img"></image>
						</view>
						<view class="item-mid">
							<view class="mid-title overflow2">{{item.goodsName}}</view>
							<view class="mid-price">￥{{item.goodsNowPrice}}</view>	
							<view class="mid-kc">库存:{{item.stockNum}}</view>
						</view>
						<view class="item-rt">
							<uni-icons type="more-filled" size="46rpx" color="#666" @click="moreClick(index)"></uni-icons>
							<view class="rt-list" v-if="item.isListHidden">
								<view class="list-item" @click="editClick(item)">
									<uni-icons type="compose" size="46rpx" color="#fff"></uni-icons><p>编辑</p>
								</view>
								<view class="list-item" v-if="listQuery.status==1" @click="updownClick(item.id,2,index)">
									<uni-icons type="download" size="46rpx" color="#fff"></uni-icons><p>下架</p>
								</view>
								<view class="list-item" v-else  @click="updownClick(item.id,1,index)">
									<uni-icons type="upload" size="46rpx" color="#fff"></uni-icons><p>上架</p>
								</view>
								<view class="list-item" @click="delClick(item.id,index)">
									<uni-icons type="trash" size="46rpx" color="#fff"></uni-icons><p>删除</p>
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view v-show="isLoadMore" class="more_loading">
						<uni-load-more :status="loadStatus" :contentText="contentText"></uni-load-more>
				</view>
		</scroll-view>
		
		<view class="noGood" v-if='noDataShow'>
			<image :src="FILE_BASE_URL + '/3ee934e5-e364-4dad-9417-88a4776bfd87.png'" mode="widthFix" class="noGood-img"></image>
			<p>暂无商品</p>
		</view>
			
		<view class="goTop" @click="toTop" v-if="flag">
			<image :src="FILE_BASE_URL + '/72355db4-ef1e-4845-b601-ba7fdd905cd4.png'" mode="aspectFit" class="goTop-img"></image>
		</view>
		
		<Pgtab :tabid="3"></Pgtab>
		
	</view>
</template>

<script>
	import Pgtab from "../components/pgtab/pgtab.vue"
	import { goodsList,goodsDel,editGoodsStatus } from '@/api/page/manage.js'
	export default {
		components: {
			Pgtab
		},
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				inputTxt:'',
				iptClose:false,
				mumeArr:[
					{name:'出售中', id:1 },
					{name:'下架中', id:2 },
				],
				
				listQuery:{
					pageNo:1,
					pageSize:10,
					status:1
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
			uni.$once('addOk',function(data){
				let obj = { id: 1}
				_that.mumeClick(obj)
			})
		},
		methods: {
			initData(){
				goodsList(this.listQuery).then((res) => {
					if(res.code == 200){
						this.total = res.data.totalItems;
						if(this.listQuery.pageNo<=res.data.totalPages){
							this.noDataShow = false;
							res.data.data.forEach(item=>{
								item.isListHidden = false;
							})
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
			
			//实时获取输入值
			onKeyInput(event){
				if(event.target.value)
					this.iptClose = true
				else
					this.iptClose = false
			},
			//清空输入框值
			removeInput(){
				this.inputTxt = "";
				this.iptClose = false;
				this.searchOrder()
			},
			//搜索事件
			searchOrder(){
				this.listQuery.goodsName = this.inputTxt;
				this.listQuery.pageNo = 1;
				this.list = [];
				this.initData(); 
			},
			
			mumeClick(obj){
				this.loadStatus = 'loading'
				this.list = [];
				this.listQuery.pageNo = 1;
				this.listQuery.status = obj.id;
				this.$nextTick(()=>{
					this.initData();
				})
				
			},
			
			moreClick(index){
				this.list[index].isListHidden = !this.list[index].isListHidden;
				this.list.forEach((item, i) => {
					if (i !== index) {
						item.isListHidden = false;
					}
				});
			},
			
			//编辑
			editClick(obj){
				this.list.forEach(item=>{
					item.isListHidden = false;
				})
				uni.navigateTo({
				    url: '/packageA/addShop/addShop?item=' + JSON.stringify(obj)
				});
			},
			
			//上架 下架
			updownClick(goodsId,goodsStatus,index){
				editGoodsStatus({ goodsId, goodsStatus }).then((res) => {
					if(res.code == 200){
						uni.showToast({ title: `已${goodsStatus==1?'上架':'下架'}`,icon:'success' });
						this.list.splice(index, 1);
					}
				})
			},
			
			//删除
			delClick(goodsId,index){
				uni.showModal({
					title:"温馨提示",
					content:"确定删除当前商品?",
					confirmText:"确定",
					success: (res)=> {
						if (res.confirm) {
							goodsDel({ goodsId }).then((res) => {
								if(res.code == 200){
									uni.showToast({ title: '删除成功',icon:'success' });
									this.list.splice(index, 1);
								}
							})
						} else if (res.cancel) {}
					}
				});
			},
			
			toAddShop(){
				uni.navigateTo({
				    url: '/packageA/addShop/addShop' 
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
	@import 'aShop.scss';
	@import '../pageA.scss';
</style>
