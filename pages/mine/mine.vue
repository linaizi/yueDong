<template>
	<view class="mineBox">
		<uni-nav-bar statusBar="true" backgroundColor="rgba(0,0,0,0)" title="我的"></uni-nav-bar>
		
		<view class="top">
			<view class="top-lt" @click="loginClick">
				<image class="headImg" :src="UserInfo.avatar ? UserInfo.avatar : '../../static/img/user.png'"></image>
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
		
		<image :src="FILE_BASE_URL + '/5680d7d6-630a-4dbb-809f-f9aec3137e5e.png'" mode="widthFix" class="wh180" @click="goSort"></image>
		
		<view class="userCenterBox">
			<view class="titleBox">用户中心</view>
			<view class="box flex">
				<view class="itemBox" v-for="item in tabArr" :key="item.tabId" @click="jumpToSonPage(item.tabId)">
					<!-- <button type="default" open-type="share" v-if="item.tabId==1&&mid" class="itemBox-btn"></button> -->
					<image :src="item.imgUrl" class="itemIcon"></image>
					<view>{{item.tabName}}</view>
				</view>
				<view class="itemBox" @click="jumpToSonPage(4)" v-if="isOk&&UserInfo.level==6">
					<image :src="FILE_BASE_URL + '/cb83f150-bd4d-4bcf-945e-6caabcfd8ba1.jpg'" class="itemIcon"></image>
					<view>商城管理</view>
				</view>
			</view>
		</view>
		
		<view class="userCenterBox" v-if="isOk&&UserInfo.level!=1&&UserInfo.level!=6">
			<view class="titleBox">{{UserInfo.levelName}}菜单栏</view>
			<view class="box flex">
				<view class="itemBox" @click="roleClick(1)">
					<image :src="FILE_BASE_URL + '/2ca190a4-0b8c-4cea-8499-ab1ec68f8931.jpg'" class="itemIcon"></image>
					<view>订单管理</view>
				</view>
				<view class="itemBox" @click="roleClick(2)"  v-if="UserInfo.level!=5">
					<image :src="FILE_BASE_URL + '/2ca190a4-0b8c-4cea-8499-ab1ec68f8931.jpg'" class="itemIcon"></image>
					<view>金额管理</view>
				</view>
				<view class="itemBox" @click="roleClick(3)" v-if="UserInfo.level==3">
					<image :src="FILE_BASE_URL + '/2ca190a4-0b8c-4cea-8499-ab1ec68f8931.jpg'" class="itemIcon"></image>
					<view>骑手管理</view>
				</view>
			</view>
		</view>
		
		<br><br><br>
		
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
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mid: uni.getStorageSync('mid'),
				UserInfo:{},
				tabArr:[
					{imgUrl:this.$BASE_URLS.FILE_BASE_URL+'/2ca190a4-0b8c-4cea-8499-ab1ec68f8931.jpg',tabName:'我的订单', tabId:0},
					{imgUrl:this.$BASE_URLS.FILE_BASE_URL+'/179e5927-3eb7-44e3-81b8-2561ecc129a5.jpg',tabName:'我的优惠券', tabId:1},
					{imgUrl:this.$BASE_URLS.FILE_BASE_URL+'/3b194d4b-1412-44c2-bfe6-1effcc5ff5b7.jpg',tabName:'关于我们', tabId:2},
					{imgUrl:this.$BASE_URLS.FILE_BASE_URL+'/e9b08ce8-c807-4799-b0aa-5b84b532f4b9.jpg',tabName:'联系客服', tabId:3},
				],
				isOk:false,
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
		onShow(){
			uni.hideTabBar({ //隐藏系统自动的底部导航
					animation: false
			})
		},
	
		methods: {
			getUserData(wcode){
				myDetail().then((res) => {
					if(res.code == 200){
						this.UserInfo = res.data;
						this.isOk = true;
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
			
			goSort(){
				uni.switchTab({
				   url: '/pages/sort/sort',
				})
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
					case 4:
						url='/packageA/aIndex/aIndex'
						break;
				} 	
				if(idx!=3){
					if((idx==0||idx==1)&&!this.mid){
						uni.showToast({title: '请先登录', icon:'none'});
					}else{
						uni.navigateTo({
						    url
						});
					}
				}
			},
			
			roleClick(n){
				let url=''
				switch(n) {
					case 1:
						url='/pagesR/roleOrder/roleOrder?level=' + this.UserInfo.level
						break;
					case 2:
						url='/pagesR/roleMoney/roleMoney?level=' + this.UserInfo.level
						break;
					case 3:
						url='/pagesR/siteManage/siteManage'
						break;
				} 
				
				uni.navigateTo({
				    url
				});
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	@import 'mine.scss'
</style>
