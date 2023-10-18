<template>
	<view class="allBg gcBg" :style="bgStyle">
		<!-- https://file.yuedongxixie.com/file/d19d89ee-9d85-4345-8994-1b991cdbdffe.jpg -->
		<template v-if="isImageLoaded">
			<view class="ge-main">
				<view class="lt-top">
					<p class="top-mon">券面额:￥<span class="mon-b">{{couInfo.amount}}</span> </p>
					<p class="top-p">(满{{couInfo.conditionAmount}}元可用)</p>
				</view>
				<view class="md-p">优惠券领取时间：</view>
				<view class="md-p1">{{couInfo.possessStartTime}} - {{couInfo.possessEndTime}}</view>
				<view class="md-p">优惠券使用时间</view>
				<view class="md-p1">{{couInfo.useStartTime}} - {{couInfo.useEndTime}}</view>
			</view>
			
			<view :class="['gc-btn',{'gc-btnGray':btnNo}]" @click="subClick">{{btnTxt}}</view>
		</template>
		
		<Pplog ref="logchild" :mid.sync="mid"  @getData='getUserData'></Pplog>	
		
		<!-- <view class="code-img-wrapper" @click="updateImageCode">
		  <canvas style="width:220rpx;height:86rpx;" canvas-id="canvas"></canvas>
		</view> -->
	</view>
</template>

<script>
	import { couponInfo,limitCoupon } from '@/api/page/index.js'
	// import { Mcaptcha  } from '@/common/mcaptcha.js'
	import Pplog from "@/components/pplog/pplog.vue"
	export default {
		components: {
			Pplog,
		},
		data() {
			return {
				mid: uni.getStorageSync('mid'),
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				couponId:0,
				couInfo:{},
				imgUrl:this.$BASE_URLS.FILE_BASE_URL+"/551c702f-e753-4cd1-bb22-03d674a88b47.jpg",
				btnTxt:'领取优惠券',
				isImageLoaded:false,
				btnNo:false,
			}
		},
		onLoad(option) {
			this.couponId = option.id;
			uni.showLoading({
				title: '加载中...',
				mask:true,
			});
			this.preloadImage(this.imgUrl);
		},
		onShow(){
			this.initData()
		},
		computed: {
		    bgStyle() {
		      return {
		        background: `url(${this.imgUrl}) no-repeat`,
		        display: this.isImageLoaded ? "block" : "none",
				backgroundSize: "100% 100%",
		      };
		    },
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
			
			// 是否删除 ifDel =true  提示优惠券已下架
			// 是否领完 ifStock=true 提示优惠券已领完
			// 是否领取 ifUse=true 提示优惠券已领过
			// 全为false才能领取
			initData(){
				couponInfo({ couponId:this.couponId }).then((res) => {
					if(res.code == 200){
						this.couInfo = res.data;
						if(res.data.ifDel){
							this.btnNo = true;
							this.btnTxt = '优惠券已下架'
						}else if(res.data.ifStock){
							this.btnNo = true;
							this.btnTxt = '优惠券已领完'
						}else if(res.data.ifUse){
							this.btnNo = true;
							this.btnTxt = '已领取'
						}
					}
				})
			},
			
			preloadImage(url) {
				const img = new Image();
				img.onload = () => {
					this.isImageLoaded = true;
					uni.hideLoading()
				};
				img.src = url;
			},
			
			//pplog组件回调
			getUserData(wcode){
				if(wcode==200) {
					this.$refs.logchild.$refs.logPopup.close();
					this.subClick()
				}
			},
			
			subClick(){
				if(this.btnNo) return;
				
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
