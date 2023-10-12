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
				{ 	id:1, name:'首页', 
					img1:this.$BASE_URLS.FILE_BASE_URL+'/4f56dca9-c229-461d-ab82-b876b41efd83.jpg', 
					img2:this.$BASE_URLS.FILE_BASE_URL+'/bf5fe9a5-c9b4-4f6e-b49a-d3bb33e8fd3e.jpg', 
					path: "/pages/index/index",
				},
				{ 	id:2, name:'分类', 
					img1:this.$BASE_URLS.FILE_BASE_URL+'/73b1f901-d621-4718-8e99-da724271bca3.jpg', 
					img2:this.$BASE_URLS.FILE_BASE_URL+'/27dc26b8-1ace-4584-b15a-aefdae119485.jpg', 
					path: "/pages/sort/sort"},
				{ id:3, name:'购物车', 
					img1:this.$BASE_URLS.FILE_BASE_URL+'/92424fc3-0ca0-4a30-a400-cbf82ee19c86.jpg', 
					img2:this.$BASE_URLS.FILE_BASE_URL+'/eba02379-fb14-4aea-9bf4-1337c84fef6b.jpg', 
					path: "/pages/myCart/myCart"},
				{ id:4, name:'我的', 
					img1:this.$BASE_URLS.FILE_BASE_URL+'/f305f685-c768-4a50-9ac7-b5b9d01bb91d.jpg', 
					img2:this.$BASE_URLS.FILE_BASE_URL+'/a8175a59-d4c8-4a3a-a68c-468097c1e460.jpg', 
					path: "/pages/mine/mine"},
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
			 
			 if(item.id==3){
				 if(uni.getStorageSync('mid')){
					 uni.switchTab({
					    url: item.path,
					 })
				 }else{
					 uni.showToast({ title: '请先登录', icon:'none' })
					 if(this.tabid !==4){
						 setTimeout(()=>{
							 uni.switchTab({
								url: "/pages/mine/mine",
							 })
						 },1000)
					 }
				 }
			 }else{
				 uni.switchTab({
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