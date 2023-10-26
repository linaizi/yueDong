<template>
	<view class="allBg">
		<view class="odBg">
			<view class="od-zt">
				<uni-icons type="spinner-cycle" size="48rpx" color="#fff" v-if="infoData.status==11" ></uni-icons>
				<uni-icons type="info" size="48rpx" color="#fff" v-else></uni-icons>
				<span class="ml10">{{rtStatus(infoData.status)}}</span>
			</view>
					
			<view class="od-main">
				<view class="odBox">
					<view class="od-adr">
						<uni-icons type="location" size="56rpx" color="#333333" @click="daoHang(infoData)"></uni-icons>
						<view class="adr-rt">
							<view class="rt-name flex">
							{{infoData.name}} <span>{{infoData.phone}}</span>
							 <view class="name-tell" @click="PhoneCall(infoData.phone)">
							 	<uni-icons type="phone" size="30rpx" color="#446DFD"></uni-icons>联系用户
							 </view>
						</view>
							<p @click="daoHang(infoData)" v-if="infoData.address">{{infoData.address}} {{infoData.houseNumber}}</p>
						</view>
					</view>
					<view class="od-title">
						<view class="title-lt">发货方式</view>
						<view class="title-rt">{{infoData.type == 1 ? "上门取送" : "到店服务"}}</view>
					</view>
					<view class="od-title" v-if="infoData.type == 1">
						<view class="title-lt">预约上门取鞋时间</view>
						<view class="title-rt">{{handleTime(infoData.reservationTime)}}</view>
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
						<p>商品总价<span>￥{{infoData.goodsTotalAmount}}</span></p>
						<p>运费  <span>￥{{infoData.freightAmount}}</span></p>
					</view>
					
					<view class="od-allPrice"><span>合计：</span>￥{{infoData.payAmount}}</view>
				</view>
				
				<view class="odBox">
					<view class="od-title">
						<view class="title-lt">订单信息</view>
					</view>
					<view class="od-info">
						<p class="info-p">订单编号：{{infoData.orderNo}} <span @click.stop="copy(infoData.orderNo)">复制</span></p>
						<p>下单时间：{{infoData.createTime}}</p>
						<p>支付方式：{{infoData.status==1 ? "未付款" : "微信支付"}}</p>
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
									<view class="qtBox-tt">骑手备注：</view>
									<view class="qtBox-txt">{{oot.remarks}}</view>
								</view>
								<view class="qtBox">
									<view class="qtBox-tt">骑手上传的图片：</view>
									<view class="image-grid">
									  <image v-for="(i,ind) in oot.pic" :key="ind" :src="i" mode="widthFix" class="image" @click="getImgIndex(oot.pic,ind)"></image>
									</view>
								</view>
							</view>
						</template>
					</view>
				</view>
			
				<template v-if="infoData.status==3 || infoData.status ==8">
					<view class="odBox">
						<view class="od-title">
							<view class="title-lt">操作</view>
						</view>
						<view class="od-qt">
							<view class="qtBox">
								<view class="qtBox-tt">备注：</view>
								<view class="qtBox-txt"><input type="text" v-model="listQuery.remarks" placeholder="请输入备注" class="txt-ipt" /></view>
							</view>
							<view class="qtBox">
								<view class="qtBox-tt"><span class="tt-red">*</span>图片上传：</view>
								<izUploaderImg
									v-model="izUpImgs"  
									:number="99"  
									@change="change">
								</izUploaderImg>
							</view>
						</view>
					</view>
					<view class="od-btn" @click="subClick">提 交</view>
				</template>
				
				<template v-if="infoData.status==9">
					<view class="od-btn" @click="subClick">确认送达</view>
				</template>
				
			</view>
			
		</view>

	</view>
</template>

<script>
	import { orderInfo,orderEdit } from '@/api/page/index.js'
	import { rtStatus,handleTime } from '@/common/tool.js'
	import izUploaderImg from '@/components/iz-uploader-img/iz-uploader-img.vue'
	export default {
		components: {
			izUploaderImg
		},
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				imgArr:[],
				listQuery:{
					orderId:0,
					orderNo:0
				},
				infoData:{},
				izUpImgs:[],
			}
		},
		onLoad(option) {
			this.listQuery.orderId = option.orderId;
			this.listQuery.orderNo = option.orderNo;
			this.initData();
		},
		onReady() {
			
		},
		methods: {
			handleTime,
			
			initData(){
				uni.showLoading()
				orderInfo(this.listQuery).then((res) => {
					if(res.code == 200){
						this.infoData = res.data;
					}
					uni.hideLoading()
				})
			},
			
			//返回订单状态
			rtStatus,
			
			//打电话
			PhoneCall(phone){
				uni.makePhoneCall({
					phoneNumber: phone 
				});
			},
			
			//倒计时回调事件
			timeup(){
				this.initData();
			},
			
			change(e,name){
				this.izUpImgs = e.urls
			},
			
			subClick(){
				if(this.izUpImgs.length==0&&this.infoData.status!==9){
					uni.showToast({title: '图片上传不能为空', icon:'none'});
					return;
				}
				
				const statusMapping = {
					3: 1,
					8: 2,
				};
				this.listQuery.status = statusMapping[this.infoData.status] || 3;
				
				this.listQuery.pics = this.izUpImgs.join(',');
				
				orderEdit(this.listQuery).then((res) => {
					if(res.code == 200){
						uni.showToast({title: '提交成功', icon:'success'});
						setTimeout(()=>{
							uni.$emit('ERoleOdDetail');
							uni.navigateBack({
								delta: 1
							})
						},1000)
					}
				})
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
	@import 'roleOrderDetail.scss'
</style>
