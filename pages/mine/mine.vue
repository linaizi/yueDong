<template>
	<view class="mineBox">
		<uni-nav-bar statusBar="true" backgroundColor="rgba(0,0,0,0)" title="我的"></uni-nav-bar>
		
		<view class="top">
			<view class="top-lt">
				<image class="headImg" :src="UserInfo.avatar ? UserInfo.avatar : '../../static/img/logo.jpg'"></image>
				<!-- <p class="lt-p">立即登录</p> -->
				<view class="lt-r">
					<view class="r-name">will</view>
					<view class="r-phone">手机号：15989359452</view>
				</view>
			</view>
			<view class="top-rt">
				<uni-icons type="location" size="28" color="#777" @click="lctClick" ></uni-icons>
				<uni-icons type="gear" size="28" color="#777" @click="setClick" class="ml10"></uni-icons>
			</view>
		</view>
		
		<image src="../../static/img/index1.png" mode="widthFix" class="w100"></image>
		
		<view class="userCenterBox">
			<view class="titleBox" @click="xd">用户中心</view>
			<view class="box flex">
				<view class="itemBox" v-for="item in tabArr" :key="item.tabId" @click="jumpToSonPage(item.tabId)">
					<button type="default" open-type="share" v-if="item.tabId==1&&Token" class="itemBox-btn"></button>
					<image :src="item.imgUrl" class="itemIcon"></image>
					<view>{{item.tabName}}</view>
				</view>
			</view>
		</view>
		
		
		<Tabbar :id="4"></Tabbar>
	</view>
</template>

<script>
	import Tabbar from "@/components/tabbar/tabbar.vue"
	export default {
		components: {
			Tabbar,
		},
		data() {
			return {
				Token: this.$store.state.Token,
				UserInfo:{},
				tabArr:[
					{imgUrl:`http://file.aikbao.com//20221206141224358`,tabName:'我的订单', tabId:0},
					{imgUrl:`http://file.aikbao.com/20211228145236509`,tabName:'我的优惠券', tabId:1},
					{imgUrl:`http://file.aikbao.com/20221206141307334`,tabName:'关于我们', tabId:3},
					{imgUrl:`http://file.aikbao.com/20211228145310428`,tabName:'联系客服', tabId:4},
					// {imgUrl:`http://file.aikbao.com/20221206142912946`,tabName:'邀请好友', tabId:6},
					// {imgUrl:`http://file.aikbao.com/20221206142857413`,tabName:'收藏夹', tabId:5},
				],
			}
		},
		onReady() {
		},
		methods: {
			lctClick(){
				
			},
			setClick(){
				uni.navigateTo({
				    url: '/pages/personData/personData'
				});
			},
			
			jumpToSonPage(idx){//跳转到子页面
				let url=''
				// switch(idx) {
				//   case 0:
				//     url='/packageA/myOrder/myOrder'
				//     break;
				// 	case 2:
				// 	  url='/packageA/activeChain/activeChain'
				// 	  break;
				// 	case 3:
				// 	  url='/packageA/browseRecords/browseRecords'
				// 	  break;
				// 	case 4:
				// 	  url='/packageA/teacherOrService/teacherOrService?type=1'
				// 	  break;
				// 	case 5:
				// 	  url='/packageA/favorites/favorites'
				// 	  break;
				// 	case 6:
				// 	  url='/packageA/friendsList/friendsList'
				// 	  break;
				// } 
				
				// if(!this.Token){
				// 	this.goAuthorize()
				// 	return;
				// }			
				
				uni.navigateTo({
				    url: url
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'mine.scss'
</style>
