<template>
	<view class="allBg aoddBg">
		<view class="aodd-top"><view class="top-txt">{{rtStatus(infoData.status)}}</view></view>
		
		<view class="aodd-addr">
			<view class="addr-top">
				<view class="top-lt"><uni-icons type="location" size="58rpx" color="#447FFD" ></uni-icons></view>
				<view class="top-rt">
					<p class="rt-p">{{infoData.name}} {{infoData.phone}}</p>
					<p class="rt-p">{{infoData.address}} {{infoData.houseNumber}}</p>
				</view>
			</view>
			<view class="addr-foot">
				<view class="foot" @click="PhoneCall(infoData.phone)">联系收货人</view>
				<view class="foot" @click="copy(infoData.address+infoData.houseNumber)">复制地址</view>
				<view class="foot" @click="daoHang(infoData)">地图导航</view>
			</view>
		</view>
		
		<view class="aodd-whbg">
			<view class="title">商品信息</view>
			<view class="ordre-item" v-for="(i,ind) in infoData.goodsInfos" :key="ind">
				<image :src="i.goodsPic" class="main-lt"></image>
				<view class="item-mid">
					<p class="mid-p overflow1">{{i.goodsName}}</p>
					<p>规格：默认</p>
					<p>x{{i.goodsNum}}</p>
				</view>
				<view class="main-rt">￥{{i.goodsNowPrice}}</view>
			</view>
			<view class="p bet-p"><view class="p-lt">商品总价</view><view class="p-rt">￥{{infoData.goodsTotalAmount}}</view></view>
			<view class="p bet-p"><view class="p-lt">运费</view><view class="p-rt">￥{{infoData.freightAmount}}</view></view>
			<view class="p bet-p"><view class="p-lt1">订单总价</view><view class="p-rt1">￥{{infoData.payAmount}}</view></view>
		</view>	
		
		<view class="aodd-whbg">
			<view class="title">订单信息</view>
			<view class="p"><view class="p-lt">下单时间:</view><view class="p-rt">{{infoData.createTime}}</view></view>
			<view class="p" @click="copy(infoData.orderNo)"><view class="p-lt">订单号:</view><view class="p-rt">{{infoData.orderNo}}</view></view>
			<view class="p"><view class="p-lt">支付方式:</view><view class="p-rt">微信支付</view></view>
			<view class="p"><view class="p-lt">发货方式:</view><view class="p-rt">{{infoData.type == 1 ? "上门取送":"到店服务"}}</view></view>
			<view class="p" v-if="infoData.type == 1"><view class="p-lt">预约上门取鞋时间:</view><view class="p-rt">{{infoData.reservationTime}}</view></view>
			<view class="od-qt" style="padding-bottom: 0;">
				<view class="qtBox" v-if="infoData.remark">
					<view class="qtBox-tt">用户备注：</view>
					<view class="qtBox-txt">{{infoData.remark}}</view>
				</view>
				<view class="qtBox">
					<view class="qtBox-tt">用户上传的图片：</view>
					<view class="image-grid">
					  <image v-for="(i,ind) in infoData.pics" :key="ind" :src="i" mode="widthFix" class="image" @click="getImgIndex(infoData.pics,ind)"></image>
					</view>
				</view>
			</view>
			<template v-if="infoData.orderOperates">
				<view class="od-qt" style="padding-bottom: 0;" v-for="(oot,ooind) in infoData.orderOperates" :key="ooind">
					<view class="qtBox" v-if="oot.remarks">
						<view class="qtBox-tt">{{typeTxt(oot.type)}}备注：</view>
						<view class="qtBox-txt">{{oot.remarks}}</view>
					</view>
					<view class="qtBox" v-if="oot.pic.length>0">
						<view class="qtBox-tt">{{typeTxt(oot.type)}}上传的图片：</view>
						<view class="image-grid">
						  <image v-for="(i,ind) in oot.pic" :key="ind" :src="i" mode="widthFix" class="image" @click="getImgIndex(oot.pic,ind)"></image>
						</view>
					</view>
				</view>
			</template>
		</view>
		
	</view>
</template>

<script>
	import { AorderInfo } from '@/api/page/manage.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				listQuery:{
					orderId:0,
					orderNo:0
				},
				infoData:{},
			}
		},
		onLoad(option) {
			this.listQuery.orderId = option.orderId;
			this.listQuery.orderNo = option.orderNo;
			this.initData();
		},
		methods: {
			initData(){
				AorderInfo(this.listQuery).then((res) => {
					if(res.code == 200){
						this.infoData = res.data;
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
					  12: '申请售后(待审核)',
					  13: '售后成功已关闭',
				};
				return statusDict[id]
			},
			typeTxt(type){
				const arr = {
				      1: '骑手',
				      2: '送货骑手',
				      3: '代收点',
				      4: '厂家',
				};
				return arr[type]
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
			//打电话
			PhoneCall(){
				uni.makePhoneCall({
					phoneNumber: '13411112222' 
				});
			},
			
			//导航
			daoHang(i){
				uni.openLocation({
					latitude: i.n,
					longitude: i.e,
					name: i.shopName || '',//终点名称
					address: i.address,//终点详细地址
					success: function (res) {
						console.log('success',res);
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
	@import 'aOrderDetail.scss'
</style>
