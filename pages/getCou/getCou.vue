<template>
	<view class="allBg gcBg">
		<image :src="imgUrl" class="gc-bgimg"></image>
		<view class="ge-main">
			<view class="lt-top">
				<p class="top-mon">券面额:￥<span class="mon-b">{{couInfo.amount}}</span> </p>
				<p class="top-p">(满{{couInfo.conditionAmount}}元可用)</p>
			</view>
			<view class="md-p">优惠券领取时间：</view>
			<view class="md-p1">{{couInfo.possessStartTime}} - {{couInfo.possessEndTime}}</view>
			<view class="md-p">优惠券使用时间</view>
			<view class="md-p1">{{couInfo.useStartTime}} - {{couInfo.useEndTime}}</view>
			
			<!-- <view class="gc-btn" @click="subClick">领取优惠券</view> -->
			<button class="gc-btn" @click="subClick">领取优惠券</button>
		</view>
		
		
		<!-- <view class="code-img-wrapper" @click="updateImageCode">
		  <canvas style="width:220rpx;height:86rpx;" canvas-id="canvas"></canvas>
		</view> -->
	</view>
</template>

<script>
	import { couponInfo,limitCoupon } from '@/api/page/index.js'
	// import { Mcaptcha  } from '@/common/mcaptcha.js'
	export default {
		data() {
			return {
				mid: uni.getStorageSync('mid'),
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				couponId:0,
				couInfo:{},
				imgUrl:this.$BASE_URLS.FILE_BASE_URL+"/551c702f-e753-4cd1-bb22-03d674a88b47.jpg"
			}
		},
		onLoad(option) {
			this.couponId = option.id
			this.initData()
		},
		// onReady() {
		//    this.mcaptcha = new Mcaptcha({
		//      el: 'canvas',
		//      width: 80,
		//      height: 35,
		//      createCodeImg: ""
		//    });
		//  },
	
		methods: {
			initData(){
				couponInfo({ couponId:this.couponId }).then((res) => {
					if(res.code == 200){
						this.couInfo = res.data;
						// 是否删除 ifDel =true  提示优惠券已下架
						// 是否领完 ifStock=true 提示优惠券已领完
						// 是否领取 ifUse=true 提示优惠券已领过
						// 全为false才能领取
					}
				})
			},
			
			subClick(){
				limitCoupon({ couponId:this.couponId }).then((res) => {
					if(res.code == 200){
						uni.showToast({title: '领取成功', icon:'success'});
					}
				})
			},
			
			// updateImageCode() {
			//   this.mcaptcha.refresh()
			// },
			// // 提交前校验图形验证码
			// submit() {
			//   if(!this.graphicVerifyCode) {
			//     return uni.showToast({ title: '请输入图形验证码' })
			//   }
			//   let validate = this.mcaptcha.validate(this.graphicVerifyCode)
			//   if(!validate) {
			//     return uni.showToast({ title: '图形验证码错误' })
			//   }
			//   console.log(1111)
			// },
			
		},
	
	}
</script>

<style lang="scss" scoped>
	@import 'getCou.scss'
</style>
