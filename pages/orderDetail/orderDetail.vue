<template>
	<view class="allBg">
		<view class="odBg">
			<view class="od-zt">
				<uni-icons type="spinner-cycle" size="48rpx" color="#fff" v-if="infoData.status==11" ></uni-icons>
				<uni-icons type="info" size="48rpx" color="#fff" v-else></uni-icons>
				<span class="ml10">{{rtStatus(infoData.status)}}</span>
			</view>
			<view class="od-time" v-if="infoData.status==1">
				需支付:￥{{infoData.payAmount}} 剩余时间：
				<uni-countdown 
					color="#FFFFFF"
					splitor-color="#FFF"
					:show-day="false" 
					:hour="djsTime.Hour" 
					:minute="djsTime.Minute" 
					:second="djsTime.Second"
					@timeup="timeup"/>
			</view>
					
			<view class="od-main">
				<view class="odBox">
					<view class="od-adr">
						<uni-icons type="location" size="56rpx" color="#333333"></uni-icons>
						<view class="adr-rt">
							<view class="rt-name">{{infoData.name||''}} <span class="ml10">{{infoData.phone||''}}</span></view>
							<p v-if="infoData.address">{{infoData.address}} {{infoData.houseNumber}}</p>
						</view>
					</view>
					<view class="od-title">
						<view class="title-lt">发货方式</view>
						<view class="title-rt">{{infoData.type == 1 ? "上门取送" : "到店服务"}}</view>
					</view>
					<view class="od-title">
						<view class="title-lt">代收点</view>
						<view class="title-rt">{{ infoData.caddress && infoData.caddress.shopName }}</view>
					</view>
					<view class="od-title" v-if="infoData.type == 1">
						<view class="title-lt">预约上门取鞋时间</view>
						<view class="title-rt">{{handleTime(infoData.reservationTime)}}</view>
					</view>
				</view>
				
				<view class="odBox">
					<view class="od-title">
						<view class="title-lt">订单信息</view>
					</view>
					<view class="od-info">
						<p class="info-p">订单编号：{{infoData.orderNo||''}} <span @click.stop="copy(infoData.orderNo)">复制</span></p>
						<p>下单时间：{{infoData.createTime||''}}</p>
						<p>支付方式：{{infoData.status==1 ? "未付款" : "微信支付"}}</p>
					</view>
				</view>
				
				<view class="odBox" v-if="infoData.goodsInfo">
					<view class="od-title">
						<view class="title-lt">商品信息</view>
					</view>
					<view class="ordre-item" v-for="(i,ind) in JSON.parse(infoData.goodsInfo)" :key="ind">
						<image :src="i.goodsPic" class="main-lt"></image>
						<view class="item-mid">
							<p class="mid-p overflow1">{{i.goodsName}}</p>
							<p>规格：默认</p>
							<p>x{{i.goodsNum}}</p>
						</view>
						<view class="main-rt">￥{{i.goodsNowPrice}}</view>
					</view>
					
					<view class="od-price">
						<p>商品总价: <span>￥{{infoData.goodsTotalAmount}}</span></p>
						<p v-if="infoData.couponId">优惠券: <span class="p-red">-￥{{infoData.couponDto.amount}}</span></p>
						<p>运费: <span>￥{{infoData.freightAmount}}</span></p>
					</view>
					
					<view class="od-allPrice"><span>合计: </span>￥{{infoData.payAmount}}</view>
					<view class="od-sh">
						<view class="sh-btn" v-if="isShowSH(infoData.status)" @click="goSH">申请售后</view>
						<view class="sh-btn" v-if="infoData.afterRefuseReason" @click="goSHXQ">售后详情</view>
					</view>
				</view>
				
				<view class="odBox">
					<view class="od-title">
						<view class="title-lt">其他信息</view>
					</view>
					<view class="od-qt">
						<view class="qtBox">
							<view class="qtBox-tt">备注：</view>
							<view class="qtBox-txt">{{infoData.remark}}</view>
						</view>
						<view class="qtBox">
							<view class="qtBox-tt"><span class="tt-red">*</span>图片上传：</view>
							<view class="image-grid">
							  <image v-for="(i,ind) in infoData.pics" :key="ind" :src="i" mode="widthFix" class="image" @click="getImgIndex(infoData.pics,ind)"></image>
							</view>
						</view>
					</view>
				</view>
				
			</view>
			
		</view>

	</view>
</template>

<script>
	import { orderInfo } from '@/api/page/index.js'
	import { rtStatus,handleTime } from '@/common/tool.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				imgArr:[],
				listQuery:{
					orderId:0,
					orderNo:0
				},
				infoData:{},
				djsTime:{
					Hour:0,
					Minute:10,
					Second:10,
				},
			}
		},
		onLoad(option) {
			this.listQuery.orderId = option.orderId;
			this.listQuery.orderNo = option.orderNo;
			
		},
		onShow() {
			this.initData();
		},
		methods: {
			handleTime,
			
			initData(){
				orderInfo(this.listQuery).then((res) => {
					if(res.code == 200){
						this.infoData = res.data;
						
						if(res.data.status==1){
							const createTime = new Date();
							const endTime = new Date(res.data.closeTime);
							const timeDifference = endTime - createTime;
							
							// 计算小时、分钟和秒
							this.djsTime.Hour = Math.floor(timeDifference / (1000 * 60 * 60));
							this.djsTime.Minute = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
							this.djsTime.Second = Math.floor((timeDifference % (1000 * 60)) / 1000);
						}
					}
				})
			},
			
			//返回订单状态
			rtStatus,
			
			isShowSH(sta){
				return [2].includes(sta);
			},
			goSH(){
				let arr = {
					orderNo: this.infoData.orderNo,
					goodsInfo: this.infoData.goodsInfo,
					goodsTotalAmount: this.infoData.goodsTotalAmount,
					freightAmount: this.infoData.freightAmount,
					payAmount: this.infoData.payAmount
				}
				uni.navigateTo({
				    url: '/pages/afterSales/afterSales?arr=' + JSON.stringify(arr)
				});
			},
			goSHXQ(){
				let arr = {
					orderNo: this.infoData.orderNo,
					goodsInfo: this.infoData.goodsInfo,
					goodsTotalAmount: this.infoData.goodsTotalAmount,
					freightAmount: this.infoData.freightAmount,
					payAmount: this.infoData.payAmount,
					afterAmount: this.infoData.afterAmount,
					afterReason: this.infoData.afterReason,
					afterRemark: this.infoData.afterRemark,
					afterRefuseReason: this.infoData.afterRefuseReason,
					status:this.infoData.status,
				}
				uni.navigateTo({
				    url: '/pages/afterSalesDetails/afterSalesDetails?arr=' + JSON.stringify(arr)
				});
			},
			
			//倒计时回调事件
			timeup(){
				this.initData();
			},
			
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
			
			getImgIndex(obj,index) { //图片预览
				let imgs = obj.map(item => {
					//只返回图片路径
					return item
				})
				//调用预览图片的方法
				uni.previewImage({
					urls: imgs,
					current: index
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	@import 'orderDetail.scss'
</style>
