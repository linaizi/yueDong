<template>
	<view class="comparisonBox mask" v-if="isShowComparison">
		<view class="popupBox">
			<view class="title">{{comparisonMsg.title}}</view>
			<view>{{comparisonMsg.tips}}</view>
			<view class="btn">好的</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			isShowComparison:{
				type:Boolean
			},
			comparisonMsg:{
				type:Object
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.comparisonBox{
	.popupBox{
		background: #fff;
		width: 576upx;
		border-radius: 24upx;
		padding:44upx 66upx 42upx;
		box-sizing: border-box;
		font-size: 28upx;
		color: #666;
		.title{
			font-size: 36upx;
			color:#333333;
			font-weight: 600;
			margin-bottom: 23upx;
			text-align: center;
		}
		.btn{
			width:444upx;
			height: 90upx;
			text-align: center;
			line-height: 90upx;
			background: linear-gradient(270deg, #FF3445 0%, #FD4903 100%);
			border-radius: 45upx;
			font-size: 32upx;
			color:#F0F0F0;
			margin-top: 55upx;
		}
	}
}
</style>
