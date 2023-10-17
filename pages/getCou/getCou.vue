<template>
	<view class="allBg">
		<view class="code-img-wrapper" @click="updateImageCode">
		  <canvas style="width:220rpx;height:86rpx;" canvas-id="canvas"></canvas>
		</view>
		<input type="text" v-model="graphicVerifyCode"/>
		<view class="" @click="submit">提交</view>
		
	</view>
</template>

<script>
	import { couponInfo } from '@/api/page/index.js'
	import { Mcaptcha  } from '@/common/mcaptcha.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				graphicVerifyCode:'',
				couponId:0,
				couInfo:{},
			}
		},
		onLoad(option) {
			console.log(option)
			// this.couponId = option.id
			this.couponId = option.id
			this.initData()
		},
		onReady() {
		   this.mcaptcha = new Mcaptcha({
		     el: 'canvas',
		     width: 80,
		     height: 35,
		     createCodeImg: ""
		   });
		 },
	
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
			
			updateImageCode() {
			  this.mcaptcha.refresh()
			},
			// 提交前校验图形验证码
			submit() {
			  if(!this.graphicVerifyCode) {
			    return uni.showToast({ title: '请输入图形验证码' })
			  }
			  let validate = this.mcaptcha.validate(this.graphicVerifyCode)
			  if(!validate) {
			    return uni.showToast({ title: '图形验证码错误' })
			  }
			  console.log(1111)
			},
			
		},
	
	}
</script>

<style lang="scss" scoped>
	@import 'getCou.scss'
</style>
