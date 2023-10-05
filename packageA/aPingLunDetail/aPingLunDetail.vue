<template>
	<view class="allBg">
		<view class="apd-title">买家评价</view>
		<view class="apd-main">
			<view class="main-top">
				<image :src="infoData.goodsPic" class="top-lt"></image>
				<view class="top-mid">
					<p class="mid-p">{{infoData.goodsName}}</p>
					<p class="mid-g">规格：默认</p>
				</view>
				<view class="top-rt">
					<uni-icons type="hand-up-filled" size="56rpx" color="#FF5C5C"></uni-icons>
					<p class="rt-p">好评</p>
				</view>
			</view>
			
			<p class="apd-p">{{infoData.content}}</p>
			<view class="image-grid" v-if="infoData.pic.length>0">
			  <image v-for="(i,ind) in infoData.pic" :key="ind" :src="i" mode="widthFix" class="image" @click="getImgIndex(infoData.pics,ind)"></image>
			</view>
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import 'aPingLunDetail.scss'
</style>
