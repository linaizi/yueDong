<template>
   <!-- 底部导航 -->
   <view class="tabbar" :style="{'padding-bottom': paddingBottomHeight + 'rpx'}">
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
				{ id:1, name:'首页', 
					img1:this.$BASE_URLS.FILE_BASE_URL+'/c23d3cb6-9abe-46c9-8300-2106357f2605.jpg', 
					img2:this.$BASE_URLS.FILE_BASE_URL+'/34a0a57e-38d5-4f6a-973f-b01f41116c39.jpg', 
					path: "/packageA/aIndex/aIndex"},
				{ id:2, name:'订单', 
					img1:this.$BASE_URLS.FILE_BASE_URL+'/24787815-1fd1-4c5b-a4e1-37157227762f.jpg', 
					img2:this.$BASE_URLS.FILE_BASE_URL+'/a4ca9eaf-3f66-4526-a1f8-5007fd8f094f.jpg',  
					path: "/packageA/aOrder/aOrder"},
				{ id:3, name:'商品', 
					img1:this.$BASE_URLS.FILE_BASE_URL+'/c9fcac6a-42b4-4b8d-953d-7989e9a39b22.jpg', 
					img2:this.$BASE_URLS.FILE_BASE_URL+'/e364bbea-2489-460c-9487-83e8888a37b4.jpg', 
					 path: "/packageA/aShop/aShop"},
				{ id:4, name:'设置', 
					img1:this.$BASE_URLS.FILE_BASE_URL+'/39e21b26-1e84-4d81-87cf-aef644cf22e5.jpg', 
					img2:this.$BASE_URLS.FILE_BASE_URL+'/e0a325b3-16e6-4f87-80c0-42d1a8cb80fe.jpg',  
					path: "/packageA/aSet/aSet"},
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
			if(this.tabid == item.id) return;
			  
			uni.redirectTo({
				url: item.path,
			})
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
	  z-index: 9;
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