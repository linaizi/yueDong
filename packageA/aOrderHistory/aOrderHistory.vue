<template>
	<view class="contentBox">
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
		<comfirm-popup :config="{}" :isShowPopup="showDelPopup" @sure="sureDel" @cancel="cancelDel"></comfirm-popup>
		
		
		<view class="noData" v-show="show">
			<image :src="FILE_BASE_URL + '/090f837d-62e0-424a-b83e-1db06563e6e8.jpg'"></image>
			<view>未找到此订单</view>
		</view>

		<view class="orderList" v-show="!show&&!show1">
			<view class="orderItem" v-for="(item,index) in list" :key="index" @click="goProductDetails(item)"> 
				<view class="shopMallBox">
					<view class="shopName">
						<span class="shopName-span">{{item.platformName}}</span>
						<view class="shopName-title overflow1">{{item.sellerShopTitle}}</view>
					</view>
					<view class="state">{{stuArr[item.status-1]}}</view>
				</view>
				<view class="goodsMsgBox">
					<image :src="item.goodsImgUrl" class="goodsImg"></image>
					<view class="titleBox">
						<view class="title overflow2">{{item.goodsName}}</view>
						<view class="orderNumBox">
							<view style="user-select: text !important;">订单编号：{{item.parentOrderId}}</view>
							<view class="copyBox" @click.stop="fuzhi(item.parentOrderId)">复制</view>
						</view>
						<view class="orderTime">
							<view>下单时间：{{item.orderTime}}</view>
						</view>
					</view>
				</view>
				<view class="priceBox">
					<view class="priceContent">
						<view class="payPrice">付款{{item.payAmount}}</view>
						<view class="estimate">预估￥<text class="priceNum">{{item.commission}}</text></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getOrderList } from '@/api/page/index.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				showDelPopup:false,
				phInput:"请输入订单编号",
				inputTxt:'',
				odHistory:[],
				
				show:false,
				show1:true,
				listQuery:{
					pageNo:1
				},
				list:[],
				stuArr:['待结算','结算','失效'],
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
				
				this.$set(this.listQuery, `orderId`, this.inputTxt)
				this.getList()
			},
			
			getList(){
				if(!this.listQuery.orderId){
					uni.showToast({title:'请输入订单号',icon:'none'})
					return;
				}
				
				this.list = [];
				getOrderList(this.Token,this.listQuery).then((res) => {
					if(res.code == 200){
						this.show1 = false;
						if(res.data.list.length>0){
							this.list = res.data.list;
							this.show = false;
						}else{
							this.show = true;
						}
						
					}
				});
			},
			
			// 跳转商品详情
			goProductDetails(i){
				if(i.platform==4||i.platform==5||i.platform==6||i.platform==9){
					return;
				}
				var arr = {
				  itemSource:i.platform,
				  goodsId:i.goodsId,
				  goodsSign:i.goodsSign,
				}
				
				 uni.navigateTo({
					url: '/pages/productDetails/productDetails?arr=' + JSON.stringify(arr) 
				 })
			},
			
			hisClick(i){
				this.inputTxt = this.odHistory[i]
				this.$set(this.listQuery, `orderId`, this.odHistory[i])
				this.getList()
			},
			
			delHistory(){
				this.showDelPopup=true
			},
			sureDel(){
				this.odHistory = []
				uni.setStorageSync('odHistory', JSON.stringify(this.odHistory))
				this.showDelPopup=false
			},
			cancelDel(){
				this.showDelPopup=false
			},
			
			fuzhi(value){
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
			
			removeInput(){
				this.show1 = true;
				this.show = false;
				this.inputTxt = '';
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	@import 'aOrderHistory.scss'
</style>
