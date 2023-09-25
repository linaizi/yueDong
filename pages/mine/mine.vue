<template>
	<view class="mineBox">
		<uni-nav-bar statusBar="true" backgroundColor="rgba(0,0,0,0)" title="我的"></uni-nav-bar>
		
		<view class="top">
			<view class="top-lt" @click="loginClick">
				<image class="headImg" :src="UserInfo.avatar ? UserInfo.avatar : '../../static/img/logo.jpg'"></image>
				<view class="lt-r" v-if="mid">
					<view class="r-name">{{UserInfo.nickName}}</view>
					<view class="r-phone">手机号：{{UserInfo.phone}}</view>
				</view>
				<p class="lt-p" v-else>立即登录</p>
			</view>
			<view class="top-rt" v-if="mid">
				<uni-icons type="location" size="56rpx" color="#777" @click="lctClick"></uni-icons>
				<uni-icons type="gear" size="56rpx" color="#777" @click="setClick" class="ml10"></uni-icons>
			</view>
		</view>
		
		<image src="../../static/img/index1.png" mode="widthFix" class="w100"></image>
		
		<view class="userCenterBox">
			<view class="titleBox">用户中心</view>
			<view class="box flex">
				<view class="itemBox" v-for="item in tabArr" :key="item.tabId" @click="jumpToSonPage(item.tabId)">
					<button type="default" open-type="share" v-if="item.tabId==1&&mid" class="itemBox-btn"></button>
					<image :src="item.imgUrl" class="itemIcon"></image>
					<view>{{item.tabName}}</view>
				</view>
			</view>
		</view>
		
		<view class="userCenterBox">
			<view class="titleBox">菜单栏</view>
			<view class="box flex">
				<view class="itemBox" @click="goShopGl">
					<image src="http://file.aikbao.com//20221206141224358" class="itemIcon"></image>
					<view>商城管理</view>
				</view>
			</view>
		</view>
		
		<Tabbar :tabid="4"></Tabbar>
		<Ppkefu ref="kfchild"></Ppkefu>
		<Pplog ref="logchild" :mid.sync="mid"  @getData='getUserData'></Pplog>
		
	</view>
</template>

<script>
	import Tabbar from "@/components/tabbar/tabbar.vue"
	import Ppkefu from "@/components/ppkefu/ppkefu.vue"
	import { myDetail } from '@/api/page/index.js'
	import Pplog from "@/components/pplog/pplog.vue"
	
	export default {
		components: {
			Tabbar,
			Ppkefu,
			Pplog,
		},
		data() {
			return {
				mid: uni.getStorageSync('mid'),
				UserInfo:{},
				tabArr:[
					{imgUrl:`http://file.aikbao.com//20221206141224358`,tabName:'我的订单', tabId:0},
					{imgUrl:`http://file.aikbao.com/20211228145236509`,tabName:'我的优惠券', tabId:1},
					{imgUrl:`http://file.aikbao.com/20221206141307334`,tabName:'关于我们', tabId:2},
					{imgUrl:`http://file.aikbao.com/20211228145310428`,tabName:'联系客服', tabId:3},
					// {imgUrl:`http://file.aikbao.com/20221206142912946`,tabName:'邀请好友', tabId:6},
					// {imgUrl:`http://file.aikbao.com/20221206142857413`,tabName:'收藏夹', tabId:5},
				],
			}
		},
		onLoad(option) {
			if(uni.getStorageSync('UserInfo')){
				this.UserInfo = JSON.parse(uni.getStorageSync('UserInfo'))
			}
			
			if(this.mid){
				this.getUserData()
			}
		},
	
		methods: {
			getUserData(wcode){
				myDetail().then((res) => {
					if(res.code == 200){
						this.UserInfo = res.data;
						uni.setStorageSync('UserInfo', JSON.stringify(res.data))
						if(wcode==200) {
							this.$refs.logchild.$refs.logPopup.close();
							uni.showToast({title: '登录成功', icon:'success'});
						}
					}else if(res.code == 500){
						uni.removeStorageSync('UserInfo')
						uni.removeStorageSync('mid')
						this.mid = ''
						this.UserInfo = {}
					}
				});
			},
			
			loginClick(){
				if(!this.mid) this.$refs.logchild.$refs.logPopup.open();
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
			
			goShopGl(){
				uni.navigateTo({
				    url: '/packageA/aIndex/aIndex'
				});
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	@import 'mine.scss'
</style>
