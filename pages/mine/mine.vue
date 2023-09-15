<template>
	<view class="mineBox">
		<uni-nav-bar statusBar="true" backgroundColor="rgba(0,0,0,0)" title="我的"></uni-nav-bar>
		
		<view class="top">
			<view class="top-lt" @click="loginClick">
				<image class="headImg" :src="UserInfo.avatar ? UserInfo.avatar : '../../static/img/logo.jpg'"></image>
				<!-- <p class="lt-p">立即登录</p> -->
				<view class="lt-r">
					<view class="r-name">will</view>
					<view class="r-phone">手机号：15989359452</view>
				</view>
			</view>
			<view class="top-rt">
				<uni-icons type="location" size="56rpx" color="#777" @click="lctClick"></uni-icons>
				<uni-icons type="gear" size="56rpx" color="#777" @click="setClick" class="ml10"></uni-icons>
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
		
		<Tabbar :tabid="4"></Tabbar>
		<Ppkefu ref="kfchild"></Ppkefu>
		
		<!-- 登录弹窗 -->
		<uni-popup ref="logPopup" type="bottom">
			<view class="log-pp">
				<view class="log-title">获取您的昵称、头像</view>
				<view class="perItem">
					<view class="item-lt">头像</view>
					<view class="item-rt">
						<button class="rt-but" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
								<image class="rt-img" :src="avatarUrl"></image>
						</button> 
						<uni-icons type="right" size="32rpx" color="#777"></uni-icons>
					</view>
				</view>
				<view class="perItem">
					<view class="item-lt">昵称</view>
					<view class="item-rt">
						<input type="nickname" v-model.trim="Name" class="rt-input" placeholder="请输入昵称" maxlength="16"/>
					</view>
				</view>
				<view class="log-sj">随机头像昵称</view>
				<view class="log-btn log-yes">允许</view>
				<view class="log-btn log-no" @click="closeLog">拒绝</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import Tabbar from "@/components/tabbar/tabbar.vue"
	import Ppkefu from "@/components/ppkefu/ppkefu.vue"
	export default {
		components: {
			Tabbar,
			Ppkefu,
		},
		data() {
			return {
				Token: this.$store.state.Token,
				UserInfo:{},
				tabArr:[
					{imgUrl:`http://file.aikbao.com//20221206141224358`,tabName:'我的订单', tabId:0},
					{imgUrl:`http://file.aikbao.com/20211228145236509`,tabName:'我的优惠券', tabId:1},
					{imgUrl:`http://file.aikbao.com/20221206141307334`,tabName:'关于我们', tabId:2},
					{imgUrl:`http://file.aikbao.com/20211228145310428`,tabName:'联系客服', tabId:3},
					// {imgUrl:`http://file.aikbao.com/20221206142912946`,tabName:'邀请好友', tabId:6},
					// {imgUrl:`http://file.aikbao.com/20221206142857413`,tabName:'收藏夹', tabId:5},
				],
				
				avatarUrl:"../../static/img/logo.jpg",
				Name:"小明"
			}
		},
		onReady() {
		},
		methods: {
			loginClick(){
				this.$refs.logPopup.open()
			},
			closeLog(){ this.$refs.logPopup.close() },
			onChooseAvatar(e) {
				// const { avatarUrl } = e.detail 
				
				// uni.uploadFile({
				// 	url: this.$BASE_URLS.FILE_upload_URL+'/h5/img/fileUpload', 
				// 	filePath: avatarUrl,
				// 	name: 'file',
				// 	formData: {
				// 		'user': 'test'
				// 	},
				// 	success: (f) => {
				// 		let res = JSON.parse(f.data)
				// 		if(res.code == 200){
				// 			this.upInfo(res.data.url)
				// 		}
				// 	},
				// });
			},
			
			lctClick(){
				uni.navigateTo({
				    url: '/pages/myAddress/myAddress'
				});
			},
			setClick(){
				uni.navigateTo({
				    url: '/pages/personData/personData'
				});
			},
			
			jumpToSonPage(idx){//跳转到子页面
				let url=''
				switch(idx) {
				  case 0:
				    url='/pages/myOrder/myOrder'
				    break;
					case 1:
						url='/pages/coupon/coupon'
						break;
					case 2:
					  url='/pages/about/about'
					  break;
					case 3:
					  this.$refs.kfchild.$refs.kfPopup.open();
					  break;
				} 	
				if(idx!=3){
					uni.navigateTo({
					    url: url
					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'mine.scss'
</style>
