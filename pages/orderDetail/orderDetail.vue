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
							<view class="rt-name">{{infoData.name}} <span>{{infoData.phone}}</span></view>
							<p>{{infoData.address}} {{infoData.houseNumber}}</p>
						</view>
					</view>
					<view class="od-title">
						<view class="title-lt">发货方式</view>
						<view class="title-rt">{{infoData.type == 1 ? "上门取送" : "到店服务"}}</view>
					</view>
					<view class="od-title" v-if="infoData.type == 1">
						<view class="title-lt">预约上门取鞋时间</view>
						<view class="title-rt">9月6日(周三)13:30-14:00</view>
					</view>
				</view>
				
				<view class="odBox">
					<view class="od-title">
						<view class="title-lt">订单信息</view>
					</view>
					<view class="od-info">
						<p class="info-p">订单编号：{{infoData.orderNo}} <span @click.stop="copy(infoData.orderNo)">复制</span></p>
						<p>下单时间：{{infoData.createTime}}</p>
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
						<p>商品总价<span>￥{{totalMon(infoData.goodsInfo)}}</span></p>
						<p>运费  <span>￥{{infoData.freightAmount}}</span></p>
					</view>
					
					<view class="od-allPrice"><span>合计：</span>￥{{totalMon(infoData.goodsInfo)+infoData.freightAmount}}</view>
				</view>
				
				<view class="odBox">
					<view class="od-title">
						<view class="title-lt">其他信息</view>
					</view>
					<view class="od-qt">
						<view class="qtBox">
							<view class="qtBox-tt">备注：</view>
							<view class="qtBox-txt">啥打法十分大是的发送到发按时发顺丰司法送到发生大师傅撒地方阿发送到发发送到发斯蒂芬</view>
						</view>
						<view class="qtBox">
							<view class="qtBox-tt"><span class="tt-red">*</span>图片上传：</view>
							<view class="image-grid">
							  <image v-for="(i,ind) in imgArr" :key="ind" :src="i" mode="widthFix" class="image" @click="getImgIndex(ind)"></image>
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
				}
			}
		},
		onLoad(option) {
			this.listQuery.orderId = option.orderId;
			this.listQuery.orderNo = option.orderNo;
			this.initData();
		},
		methods: {
			initData(){
				orderInfo(this.listQuery).then((res) => {
					if(res.code == 200){
						this.infoData = res.data;
						
						if(res.data.status==1){
							const createTime = new Date(res.data.createTimeStr);
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
			
			rtStatus(id){
				const statusDict = {
				      1: '待付款',
				      2: '已付款',
				      3: '骑手未取货',
				      4: '骑手已取货',
				      5: '厂家未取货',
				      6: '厂家已取货',
				      7: '代收点已收货',
				      8: '送货骑手未取货',
				      9: '送货骑手已取货',
				      10: '骑手已送达',
				      11: '已完成',
				};
				
				return statusDict[id]
			},
			
			totalMon(goodsInfo){
				if(!goodsInfo) return;
				goodsInfo = JSON.parse(goodsInfo);
				return goodsInfo.reduce((total, item) => total + item.goodsNowPrice * item.goodsNum, 0);
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
			
			getImgIndex(index) { //图片预览
				console.log(index);
				//准备一个装图片路径的  数组imgs
				let imgs = this.dataList.goods_gallery_urls.map(item => {
					//只返回图片路径
					return item
				})
				// console.log(imgs);
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
