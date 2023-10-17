<template>
	<view class="allBg">
		<view class="apd-title">买家评价</view>
		<view class="apd-main">
			<view class="main-top" v-for="(i,ind) in JSON.parse(infoData.goodsInfo)" :key="ind">
				<image :src="i.goodsPic" class="top-lt"></image>
				<view class="top-mid">
					<p class="mid-p">{{i.goodsName}}</p>
					<p class="mid-g">规格：默认</p>
				</view>
				<view class="top-rt">
					<uni-icons type="hand-up-filled" size="56rpx" color="#FF5C5C"></uni-icons>
					<p class="rt-p">好评</p>
				</view>
			</view>
			
		</view>
		
		<view class="odBox" >
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
				<p>运费: <span>￥{{infoData.freightAmount}}</span></p>
			</view>
			<view class="od-allPrice"><span>合计: </span>￥{{infoData.payAmount}}</view>
		</view>
		
		<view class="apd-title">卖家回复</view>
		<view class="apd-hf">
			<textarea class="hf-txt" v-model="infoData.replyContent" placeholder="请输入回复内容" maxlength="-1"/>
		</view>
		<view class="apd-btn" @click="subFB">发布回复</view>
		
	</view>
</template>

<script>
	import { commentReply } from '@/api/page/manage.js'
	export default {
		
		data() {
			return {
				infoData:{}
			}
		},
		onLoad(option) {
			this.infoData = JSON.parse(option.item)
			console.log(this.infoData)
		},
		methods: {
			subFB(){
				let param = {
					content: this.infoData.replyContent,
					id: this.infoData.id
				}
				commentReply(param).then((res) => {
					if(res.code == 200){
						uni.showToast({ title: '发布成功',icon:'success' });
						setTimeout(()=>{
							uni.$emit('hfOk');
							uni.navigateBack({
								delta: 1
							})
						},1000)
					}
				})
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
	@import 'pingLun.scss'
</style>
