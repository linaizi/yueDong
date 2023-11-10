<template>
	<view class="allBg flexBox">
		<view class="rmn-top">
			<view class="top-it">
				<view class="it-t">账号余额(元)</view>
				<view class="it-m">{{balance}}</view>
				<view class="it-f" @click="txClick">提现</view>
			</view>
			<view class="top-it">
				<view class="it-t">已提现金额(元)</view>
				<view class="it-m">{{withdrawAmount}}</view>
				<view class="it-b" @click="ToJL">提现记录</view>
			</view>
		</view>
		
		<template v-if="list.length>0">
			<view class="rmn-title">收入明细</view>
			
			<scroll-view scroll-y="true" lower-threshold="150" @scrolltolower="scrollLower" @scroll='fromTop' :scroll-top="scrollTop" class="boxScroll">
				<view class="rmn-main">
					<view class="main-item" v-for="(item, index) in list" :key="index">
						<view class="item-lf">
							<h3>{{codeTxt(item.balanceCode)}}</h3>
							<p>操作时间：{{item.createTime}}</p>
							<p>备注：{{item.remark}}</p>
						</view>
						<view class="item-rf">
							<p :class="[item.balanceCode == 'withdraw' ?'rf-p1':'rf-p3']">{{item.balanceCode == 'withdraw' ?'-':'+'}}{{item.money.toFixed(2)}}</p>
							<p class="rf-p2">余额:￥{{item.leaveMoney}}</p>
						</view>
					</view>
				</view>
				
				<view v-show="isLoadMore" class="more_loading">
					<uni-load-more :status="loadStatus" :contentText="contentText"></uni-load-more>
				</view>
			</scroll-view>
		</template>
			
		<view class="goTop" @click="toTop" v-if="flag">
			<image :src="FILE_BASE_URL + '/72355db4-ef1e-4845-b601-ba7fdd905cd4.png'" mode="aspectFit" class="goTop-img"></image>
		</view>
		
		<uni-popup ref="txPopup" type="center">
			<view class="pp-tx">
				<view class="tx-title">提现</view>
				<input class="tx-input" type="text" v-model="realName" placeholder="请输入你的真实姓名" style="margin-bottom: 20rpx;" />
				<input class="tx-input" type="number" v-model="amount" :placeholder="'请输入提现金额≤'+balance" @input="onKeyInput" />
				<view class="tx-sm">
					<p class="sm-p">提现说明</p>
					<p class="sm-p"><span class="red">*</span>每天可申请一次提现</p>
					<p class="sm-p"><span class="red">*</span>每次最低1元起提</p>
					<p class="sm-p"><span class="red">*</span>申请提现后1-3个工作日内到账</p>
					<p class="sm-g">如：张三在3月4日申请提现，最快3月5日即可到账，最晚3月7日到账，非工作日不计算在内</p>
				</view>
				<view class="tx-btn">
					<view class="btn" @click="closeTc">取消</view>
					<view class="btn btn1" @click="yesTc">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { walletPage,withdrawMoney,DSwalletPage,DSwithdrawMoney } from '@/api/page/index.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				amount:'',
				realName:'',
				level:0,
				listQuery:{
					pageNo:1,
					pageSize:10,
				},
				balance:0,
				withdrawAmount:0,
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
			this.level = option.level
			this.initData()
		},
		methods: {
			initData() {
				const fetchData = (queryFunction) => {
					queryFunction(this.listQuery).then((res) => {
						if(res.code == 200){
							this.balance = res.data.balance;
							this.withdrawAmount = res.data.withdrawAmount;
							
							if(res.data.walletBalanceDtos.length>0){
								this.list.push(...res.data.walletBalanceDtos);
									
								if(res.data.walletBalanceDtos.length<this.listQuery.pageSize){  //判断接口返回数据量小于请求数据量，则表示此为最后一页
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
					})
					.catch((e) => {
						this.isLoadMore = false;
					});
				};
				
				if (this.level == 2) {
					fetchData(walletPage);
				} else if (this.level == 3) {
					fetchData(DSwalletPage);
				}
			},
			
			txClick(){
				this.$refs.txPopup.open();
			},
			closeTc(){
				this.$refs.txPopup.close();
				this.amount = '';
				this.realName = '';
			},
			yesTc(){
				if(!this.amount) {
					uni.showToast({title: '请输入金额', icon:'none'});
					return;
				}
				if(!this.realName) {
					uni.showToast({title: '请输入您的真实姓名', icon:'none'});
					return;
				}
				
				let params = {
					amount: this.amount,
					realName: this.realName,
				}
				const txAPI = (queryFunction) => {
					queryFunction(params).then((res) => {
						if(res.code == 200){
							uni.showToast({title: '提现成功', icon:'success'});
							this.$refs.txPopup.close();
							this.amount='';
							this.realName='';
							this.list = [];
							this.listQuery.pageNo = 1
							this.initData()
						}
					})
				};
				if (this.level == 2) {
					txAPI(withdrawMoney);
				} else if (this.level == 3) {
					txAPI(DSwithdrawMoney);
				}
			},
			//实时获取输入值
			onKeyInput(event){
				if(event.target.value>this.balance)
					uni.showToast({title: '已超出最大提现金额', icon:'none'});
			},
			
			ToJL(){
				uni.navigateTo({
				    url: '/pagesR/roleTiXian/roleTiXian?level=' + this.level
				});
			},
			
			codeTxt(code){
				const codeArr = {
					'withdraw' : "用户提现",
					"commission" : "跑腿佣金结算",
					"withdraw_reject" : "提现驳回",
					"withdraw_fail" : "提现失败返款"
				}
				return codeArr[code]
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
	@import 'roleMoney.scss'
</style>
