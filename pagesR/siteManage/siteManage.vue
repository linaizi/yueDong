<template>
	<view class="allBg flexBox">
		<view class="asp-top">
			<view class="top-lt">
				<input type="number" 
					placeholder="请输入手机号" 
					confirm-type="search"
					v-model="phone" 
					@confirm="searchPhone" 
					@input="onKeyInput"
					placeholder-style="color:#999;fontSize:28rpx" 
					maxlength="11"
					class="searchInput"/>
				<image v-if="iptClose" class="lt-right" @click="removeInput" :src="FILE_BASE_URL + '/2c34c18c-7b4c-498a-83e2-e03bcd59b07d.jpg'"></image>
			</view>
			<view class="top-rt" @click="setBL">
				<uni-icons type="gear" size="46rpx" color="#666"></uni-icons>
				<view class="rt-t">骑手佣金比例</view>
			</view>
		</view>
		
		<template v-if="Object.keys(schData).length > 0">
			<view class="stman-title">搜索结果</view>
			<view class="stman">
				<view class="item">
					<image :src="schData.user.avatar" class="img"></image>
					<view class="item-mid">
						<view class="name">{{schData.user.nickName}}</view>
						<view class="item-p">手机号: {{schData.user.phone}}</view>
					</view>
					<view class="item-rt" @click="setRemoveQs(schData,1)"><uni-icons type="personadd" size="46rpx" color="#333"></uni-icons><p>设为骑手</p></view>
				</view>
			</view>	
		</template>
		
		<view class="stman-title">骑手列表</view>
		
		<scroll-view scroll-y="true" lower-threshold="150" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop" class="boxScroll">
				<view class="stman">
					<view class="item" v-for="(i,ind) in list" :key="ind">
						<image :src="i.userAddress.pic" class="img"></image>
						<view class="item-mid">
							<view class="name">{{i.user.nickName}}<span v-if="i.userAddress.name">({{i.userAddress.name}})</span></view>
							<view class="item-p">手机号: {{i.userAddress.phone}}</view>
							<view class="item-p">订单数: {{i.orderNum}}</view>
							<view class="item-p">总收入: ￥{{i.userWalletDto.balance+i.userWalletDto.withdrawAmount}}</view>
						</view>
						<view class="item-rt"  @click="setRemoveQs(i,2)">
							<uni-icons type="trash" size="46rpx" color="#333"></uni-icons><p>删除</p>
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
		
		<!-- 设置骑手佣金比例 -->
		<uni-popup ref="BLpopup" type="center">
			 <view class="timePpBox">
				 <view class="pp-title">骑手佣金比例</view>
				 <view class="pp-tm">
					 <view class="pp-iptBox">
					 	<input type="number" v-model="amountRate1" placeholder="请输入佣金比例" class="pp-ipt"> %
					 </view>
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
	import { riderPage,editRider,amount,getriderAmount,editriderAmount } from '@/api/page/index.js'
	import { isValidPhoneNumber } from '@/common/tool.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				iptClose:false,
				phone:'',
				schData:{},
				amountRate:0, //骑手佣金比例
				amountRate1:0, //骑手佣金比例
				listQuery:{
					pageNo:1,
					pageSize:10,
				},
				list:[],
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
			this.initData();
			this.getRiderAmt()
		},
		methods: {
			initData(){
				riderPage(this.listQuery).then((res) => {
					if(res.code == 200){
						if(this.listQuery.pageNo<=res.data.totalPages){
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
			
			// 获取骑手佣金金额
			getRiderAmt(){
				getriderAmount().then((res) => {
					if(res.code==200){
						this.amountRate =  res.data;
					}
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
				this.phone = "";
				this.iptClose = false;
			},
			//搜索
			searchPhone(){			
				if(this.iptClose) {
					if (isValidPhoneNumber(this.phone)) {
						let param = {
							phone:this.phone,
							pageNo:1,
							pageSize:10,
						}
						riderPage(param).then((res) => {
							if(res.code = 200){
								this.schData = res.data.data[0];
							}
						})
					} else {
					  uni.showToast({title: '手机号格式不正确', icon:'none'});
					}
				}
			},
			isValidPhoneNumber,
			
			// 设置骑手佣金比例
			setBL(){
				this.amountRate1 = this.amountRate;
				this.$refs.BLpopup.open();
			},
			staClose(val){
				this.$refs.BLpopup.close()
			},
			staYes(){
				this.amountRate1 -= 0;
				
				if(Number.isInteger(this.amountRate1)&&this.amountRate1 <= 100) {
				    editriderAmount({ amountRate: this.amountRate1 }).then((res) => {
				    	if(res.code==200){
				    		uni.showToast({title: '修改成功', icon:'success'});
				    		this.staClose()
							this.getRiderAmt()
				    	}
				    })
				}else{
					uni.showToast({title: '值为整数且不能超过100', icon:'none'});
				}
			},
			
			// 设置取消骑手
			setRemoveQs(item,type){
				uni.showModal({
					title:'温馨提示',
					cancelText: '取消',
					confirmText: '确定',
					content: type==1?'确定当前用户设置为骑手?':"确定删除?",
					success: function(res) {
						if (res.confirm) {
							let param = {
								rid:item.user.id,
								type
							}
							editRider(param).then((res) => {
								if(res.code = 200){
									uni.showToast({title: '修改成功', icon:'success'});
									setTimeout(()=>{
										 const currentPages = getCurrentPages();
										uni.redirectTo({
										  url: `/${currentPages[currentPages.length - 1].route}`
										});
									},1000)
								}
							})
						} else if (res.cancel) {
							
						}
					}
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
	@import 'siteManage.scss'
</style>
