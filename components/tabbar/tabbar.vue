<template>
   <!-- 底部导航 -->
   <view class="tabbar" :style="{'padding-bottom': paddingBottomHeight + 'upx'}">
      <view class="tabbar-item" v-for="item in list" :key="item.id" @click="tabbarChange(item)">
         <image class="item-img" :src="tabid == item.id ? item.img2 : item.img1" mode="heightFix"></image>
				 <view :class="['item-txt',{'item-txt-act':tabid == item.id}]">{{item.name}}</view>
      </view>
   </view>
</template>
 
<script>
	import { debounce } from "@/common/throttle.js";
	export default {
      props: {
				 tabid: {
				 	type: Number,
				 	default: 1
				 },
      },
      data() {
         return {
            paddingBottomHeight: 0, //苹果X以上手机底部适配高度
            list: [
				{ id:1, name:'首页', img1:"../../static/img/tab1.jpg", img2:"../../static/img/tab1-1.jpg", path: "/pages/index/index"},
				{ id:2, name:'分类', img1:"../../static/img/tab2.jpg", img2:"../../static/img/tab2-1.jpg", path: "/pages/sort/sort"},
				{ id:3, name:'购物车', img1:"../../static/img/tab3.jpg", img2:"../../static/img/tab3-1.jpg", path: "/pages/myCart/myCart"},
				{ id:4, name:'我的', img1:"../../static/img/tab4.jpg", img2:"../../static/img/tab4-1.jpg", path: "/pages/mine/mine"},
			],
         };
      },
			
	onReady() {
		let that = this;
		uni.getSystemInfo({
		   success: function(res) {
			  let model = ['X', 'XR', 'XS', '11', '12', '13', '14', '15'];
			  model.forEach(item => {
				 //适配iphoneX以上的底部，给tabbar一定高度的padding-bottom
				 if (res.model.indexOf(item) != -1 && res.model.indexOf('iPhone') != -1) {
					that.paddingBottomHeight = 40;
				 }
			  })
		   }
		});
	},
 
      methods: {
         tabbarChange: debounce(function(item) {
			 if(item.id==3){
				 if(uni.getStorageSync('mid')){
					 uni.navigateTo({
					    url: item.path,
					 })
				 }else{
					 uni.showToast({ title: '请先登录', icon:'none' })
					 if(this.tabid !==4){
						 setTimeout(()=>{
							 uni.navigateTo({
								url: "/pages/mine/mine",
							 })
						 },1000)
					 }
				 }
			 }else{
				 uni.navigateTo({
				    url: item.path,
				 })
			 }
					
         }),
      }
   };
</script>
 
<style scoped>
   .tabbarActive {
      color: #79D5AD !important;
   }
 
   .tabbar {
      position: fixed;
      bottom: 0;
      left: 0;
			z-index: 99;
      width: 100%;
			height: 98upx;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: #fff;
   }
 
   .tabbar-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 98upx;
   }
   
   .item-img {
		  width: 50upx;
      height: 50upx;
   }
   .item-txt{
		 font-size: 22upx;
		 color:#000000;
	 }
	 .item-txt-act{
		 color:#FF3445
	 }
 
</style>