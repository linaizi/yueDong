<template>
	<view class="allBg">
		<view class="odBg">
			<view class="od-zt">
				<uni-icons type="spinner-cycle" size="48upx" color="#fff"></uni-icons>
				<uni-icons type="info" size="48upx" color="#fff"></uni-icons><span class="ml10">已取消</span>
			</view>
			<view class="od-time">需支付:￥59.70 剩余00小时09分47秒</view>
					
			<view class="od-main">
				<view class="odBox">
					<view class="od-adr">
						<uni-icons type="location" size="56upx" color="#333333"></uni-icons>
						<view class="adr-rt">
							<view class="rt-name">小明 <span>13411112222</span></view>
							<p>广东省广州市天河区五山路483号华南农业大学 201</p>
						</view>
					</view>
					<view class="od-title">
						<view class="title-lt">发货方式</view>
						<view class="title-rt">上门取送</view>
					</view>
					<view class="od-title">
						<view class="title-lt">预约上门取鞋时间</view>
						<view class="title-rt">9月6日(周三)13:30-14:00</view>
					</view>
				</view>
				
				<view class="odBox">
					<view class="od-title">
						<view class="title-lt">订单信息</view>
					</view>
					<view class="od-info">
						<p class="info-p">订单编号：20230906202011586734 <span @click.stop="copy(123)">复制</span></p>
						<p>下单时间：2023-09-06 20:20:11</p>
						<p>支付方式：未付款</p>
					</view>
				</view>
				
				<view class="odBox">
					<view class="od-title">
						<view class="title-lt">商品信息</view>
					</view>
					<view class="ordre-item">
						<image src="../../static/img/good1.png" class="main-lt"></image>
						<view class="item-mid">
							<p class="mid-p overflow1">高级鞋类精选三双</p>
							<p>规格：默认</p>
							<p>x4</p>
						</view>
						<view class="main-rt">￥81.90</view>
					</view>
					<view class="ordre-item">
						<image src="../../static/img/good1.png" class="main-lt"></image>
						<view class="item-mid">
							<p class="mid-p overflow1">高级鞋类精选三双</p>
							<p>规格：默认</p>
							<p>x4</p>
						</view>
						<view class="main-rt">￥81.90</view>
					</view>
					
					<view class="od-price">
						<p>商品总价<span>￥69.60</span></p>
						<p>运费  <span>￥0.00</span></p>
					</view>
					
					<view class="od-allPrice"><span>合计：</span>￥81.90</view>
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
							<view class="qtBox-tt">图片上传：</view>
							<view class="image-grid">
							  <image v-for="(i,ind) in imgArr" :key="ind" :src="i" mode="widthFix" class="image" @click="getImgIndex(index)"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			
		</view>
		
		
	</view>
</template>

<script>
	
	export default {
		components: {
			
		},
		data() {
			return {
				imgArr:[
					"../../static/img/good1.png",
					"../../static/img/swiper1.jpg",
					"../../static/img/index1.png",
					"../../static/img/good1.png",
					"../../static/img/swiper1.jpg",
					"../../static/img/index1.png"
				]
			}
		},
		onReady() {
		
		},
		methods: {
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
