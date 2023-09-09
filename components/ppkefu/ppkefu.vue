<!-- 首页轮播组件 -->
<template>
		<uni-popup ref="kfPopup" type="center">
			<view class="kf-pp">
				<view class="kf-title">请联系跃动洗鞋微信</view>
						<image src="https://file.aikbao.com/20230616101226811" :show-menu-by-longpress="true" class="kf-img" mode="widthFix"></image>
						<view class="kf-phone" @click="PhoneCall">或点击致电：13411112222</view>
						<view class="hbtxt" @click="preservationImg(0,'https://file.aikbao.com/2023070714050925')">保存图片</view>
						<uni-icons type="close" size="36" color="#fff" @click="closeHb" class="kfClose"></uni-icons>
			</view>
		</uni-popup>
</template>

<script>
	import { preservationImg } from '@/common/tool.js'
	export default{
		data(){
			return{
			}
		},
		
		methods:{
			preservationImg,
			
			PhoneCall(){
				uni.makePhoneCall({
					phoneNumber: '13411112222' 
				});
			},
			closeHb(){
				this.$refs.kfPopup.close()
			},
		},
	
	}
</script>

<style lang="scss" scoped>
	.kf-pp{
		width: 550upx;
		border-radius: 12upx;
		padding: 24upx 28upx 40upx;
		box-sizing: border-box;
		background: #fff;
		position: relative;
		.kf-title{
			font-size: 34upx;
			font-weight: bold;
			color:#333;
			text-align: center;
		}
		.kf-img{
			display: block;
			width: 450upx;
			margin: 16upx auto;
		}
		.kf-phone{
			font-size: 30upx;
			color:blue;
			font-weight: bold;
			text-align: center;
			text-decoration: underline;
		}
		.hbtxt{
			@include dflex(center,center);
			background: #1081f2;
			width: 250upx;
			height: 70upx;
			font-size: 30upx;
			color:#fff;
			border-radius: 100upx;
			margin: 30upx auto 0;
		}
		.kfClose{
			position: absolute;
			bottom:-80upx;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>
