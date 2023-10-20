<template>
	<view class="allBg gcBg" :style="bgStyle">
		<template v-if="isImageLoaded">
				<!-- <image src="https://file.yuedongxixie.com/file/ea8aac4e-172e-4298-aee2-3cbd774c4c4e.png" mode="" class="main-quan"></image> -->
				<!-- <image src="../../static/img/51.png" mode=""></image> -->
				<!-- <view class="lt-top">
					<p class="top-mon">券面额:￥<span class="mon-b">{{couInfo.amount}}</span> </p>
					<p class="top-p">(满{{couInfo.conditionAmount}}元可用)</p>
				</view>
				<view class="md-p">优惠券领取时间：</view>
				<view class="md-p1">{{couInfo.possessStartTime}} - {{couInfo.possessEndTime}}</view>
				<view class="md-p">优惠券使用时间</view>
				<view class="md-p1">{{couInfo.useStartTime}} - {{couInfo.useEndTime}}</view> -->
			
			<view :class="['gc-btn',{'gc-btnGray':btnNo}]" @click="subClick">{{btnTxt}}</view>
			
			<view class="txt-foot">
				<view class="foot-top">优惠券使用说明:</view>
				<p class="foot-p">1.此优惠券满<span>{{couInfo.conditionAmount}}元</span>即可使用,出示该优惠卷即可立减<span>{{couInfo.amount}}元</span></p>
				<p class="foot-p">2.此优惠券不可与店内其他优惠一同使用</p>
				<p class="foot-p">3.此券限活动期限内使用</p>
				<p class="foot-p">4.此券最终解释权归本店所有</p>
			</view>
		</template>
		
		<Pplog ref="logchild" :mid.sync="mid"  @getData='getUserData'></Pplog>	
		
	</view>
</template>

<script>
	import { couponInfo,limitCoupon } from '@/api/page/index.js'
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
				imgUrl:'',
				btnTxt:'领取优惠券',
				isImageLoaded:false,
				btnNo:false,
			}
		},
		onLoad(option) {
			console.log(option)
			this.couponId = option.id;
			this.imgUrl = option.imgUrl || this.$BASE_URLS.FILE_BASE_URL+'/15c8097c-e242-41f4-9900-fbe1cdd04330.png'
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
				if(!this.mid) {
					this.$refs.logchild.$refs.logPopup.open();
					return;
				}
				if(this.btnNo) return;
				
				limitCoupon({ couponId:this.couponId }).then((res) => {
					if(res.code == 200){
						uni.showToast({title: '领取成功', icon:'success'});
						setTimeout(()=>{
							this.initData()
						},1000)
					}
				})
			},
			
		},
	
	}
</script>

<style lang="scss" scoped>
	@import 'getCou.scss'
</style>
