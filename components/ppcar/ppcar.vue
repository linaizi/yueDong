<!-- 首页轮播组件 -->
<template>
		<uni-popup ref="popup" type="bottom">
			 <view class="ppBox">
				 <view class="ppTop">
						<image :src="ppCarData.img"  class="mid-img"></image>
					 <view class="ppTop-mid">
						 <p class="mid-red"><span>￥</span>{{ppCarData.newprice}}</p>
						 <p class="mid-gray">库存：9999</p>
					 </view>
					 <uni-icons type="closeempty" size="60upx" color="#999" @click="closeCar"></uni-icons>
				 </view>
				 <view class="ppMid">
					 <view class="ppMid-top">
						 <h3>规格</h3>
						 <view class="topList">
							 <span class="active">默认</span>
						 </view>
					 </view>
					 <view class="ppMid-foot">
						 <view class="foot-lt">数量 <p>(<span>{{ppCarData.qg}}</span>件起售)</p></view>
						 <uni-number-box :value="ppCarData.numberValue" :min="ppCarData.minSale" @change="change" />
					 </view>
				 </view>
				 <view class="ppFoot">
						<view class="ppFoot-btn">加入购物车</view>
						<view class="ppFoot-btn ppFoot-btn-rt" @click="goBuy">立即购买</view>
				 </view>
			 </view>
		</uni-popup>
</template>

<script>
	export default{
		props:{
			ppCarData:{
				type:Object
			}
		},
		data(){
			return{
			}
		},
		
		methods:{
			closeCar(){ this.$refs.popup.close() },
			
			change(value) {
				this.ppCarData.numberValue = value
			},
			
			goBuy(){
				uni.navigateTo({
				    url: '/pages/buy/buy'
				});
			},
		},
	
	}
</script>

<style lang="scss" scoped>
	.ppBox{
		background: #fff;
		border-radius: 14upx 14upx 0 0;
		.ppTop{
			margin: 0 25upx;
			padding: 15upx 15upx 20upx 0;
			@include dflex(space-between,null);
			border-bottom: 2upx solid #F0F0F0;
			.mid-img{
				width: 130upx;
				height: 130upx;
				margin-top: -45upx;
				border-radius: 8upx;
			}
			.ppTop-mid{
				flex: 1;
				margin-left: 25upx;
				.mid-red{
					color: #FF3445;
					font-weight: bold;
					font-size: 38upx;
					padding-top: 8upx;
					span{
						font-weight: normal;
						font-size: 24upx;
					}
				}
				.mid-gray{
					font-size: 28upx;
					color: #999;
				}
			}
		}
		
		.ppMid{
			margin: 20upx 25upx 40upx;
			.ppMid-top{
				h3{
					font-size: 28upx;
					margin-bottom: 20upx;
					padding-left: 10upx;
					color:#333;
				}
				.topList{
					@include dflex(null,center);
					span{
						font-size: 28upx;
						border-radius: 12upx;
						width: 96upx;
						height: 56upx;
						text-align: center;
						line-height: 56upx;
					}
					.active{
						color: #FF3445;
						border:2upx solid #FF4544;
						background: #FFECEC;
					}
				}
			}
			.ppMid-foot{
				@include dflex(space-between,center);
				margin: 45upx 0 25upx;
				padding-left: 10upx;
				color:#333;
				.foot-lt{
					font-size: 28upx;
					font-weight: bold;
					@include dflex(null,null)
					p{
						margin-left: 12upx;
						font-weight: normal;
						font-size: 26upx;
						color: #B0B0B0;
						span{
							color: #FF3445;
						}
					}
				}
			}
		}
	
		.ppFoot{
				@include dflex(center,center);
				height: 130upx;
				border-top: 2upx solid #F0F0F0;
				.ppFoot-btn{
					width: 330upx;
					height: 80upx;
					text-align: center;
					line-height: 79upx;
					font-size: 28upx;
					color: #fff;
					border-radius: 200upx;
					background: linear-gradient(270deg, #FF3445 0%, #FD4903 100%);
					margin: 0 13upx;
				}
				.ppFoot-btn-rt{
					background: linear-gradient(270deg, #FF5000 0%, #FF9000 100%);
				}
		}
		
	}
</style>
