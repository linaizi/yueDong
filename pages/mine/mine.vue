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
		
		<!-- 登录弹窗 -->
		<uni-popup ref="logPopup" type="bottom">
			<view class="log-pp">
				<view class="log-title">获取您的昵称、头像</view>
				<view class="perItem">
					<view class="item-lt">头像</view>
					<view class="item-rt">
						<button class="rt-but" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
								<image class="rt-img" :src="paramsData.avatar"></image>
						</button> 
						<uni-icons type="right" size="32rpx" color="#777"></uni-icons>
					</view>
				</view>
				<view class="perItem">
					<view class="item-lt">昵称</view>
					<view class="item-rt">
						<input type="nickname" v-model.trim="paramsData.nickName" class="rt-input" placeholder="请输入昵称" maxlength="16"/>
					</view>
				</view>
				<view class="log-sj">随机头像昵称</view>
				<view class="log-btn log-yes" @click="getWxCode">允许</view>
				<view class="log-btn log-no" @click="closeLog">拒绝</view>
			</view>
		</uni-popup>
		
		<!-- 绑定手机号弹窗 -->
		<uni-popup ref="popup" :is-mask-click='false'>
			<view class="index-popup popup-box">
				<view class="indexPopup-close" @click="closePopup">
					<image class="close-img" src="http://file.aikbao.com/2022052515464761366?/width/24/height/24" mode="widthFix"></image>
				</view>
				<image class="indexPopup-img" src="http://file.aikbao.com/2022042908450255730?/width/128/height/128"></image>
				<p class="indexPopup-p">为保障您的账号安全 请绑定手机号码</p>
				<button type="default" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber" @click="closePopup" class="indexPopup-btn">绑定手机号码</button>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import Tabbar from "@/components/tabbar/tabbar.vue"
	import Ppkefu from "@/components/ppkefu/ppkefu.vue"
	import { debounce } from "@/common/throttle.js";
	import { WxLogin,getPhone,buildPhone,myDetail,userReg } from '@/api/page/index.js'
	
	export default {
		components: {
			Tabbar,
			Ppkefu,
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
				
				paramsData:{
					avatar:"https://file.aikbao.com/20230619140350568",
					nickName:"小明"
				},
				WxLoginCode:1,
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
			getUserData(){
				myDetail().then((res) => {
						this.UserInfo = res.data;
						uni.setStorageSync('UserInfo', JSON.stringify(res.data))
						if(this.WxLoginCode==200) {
							this.$refs.logPopup.close();
							uni.showToast({title: '登录成功', icon:'success'});
						}
				});
			},
			
			loginClick(){
				if(!this.mid) this.$refs.logPopup.open();
			},
			closeLog(){ this.$refs.logPopup.close() },
			onChooseAvatar(e) {
				const { avatarUrl } = e.detail 
				
				uni.uploadFile({
					url: this.$BASE_URLS.FILE_upload_URL+'/h5/img/fileUpload', 
					filePath: avatarUrl,
					name: 'file',
					formData: {
						'user': 'test'
					},
					success: (f) => {
						let res = JSON.parse(f.data)
						if(res.code == 200){
							this.upInfo(res.data.url)
						}
					},
				});
			},
			
			//获取微信code
			getWxCode: debounce(function(){
				var _that = this;
				uni.login({
					provider: 'weixin',
					success: function(res) {
						_that.LoginWx(res.code)
					}
				});	
			}),
			
			//登录
			LoginWx(code){
				let param = {
					...this.paramsData,
					code
				}
				WxLogin(param).then((res) => {
					this.WxLoginCode = res.code;
					if(res.code == 200){
						this.mid = res.data;
						uni.setStorageSync('mid', res.data)
						this.getUserData();
					}else{
						this.$refs.logPopup.close()
						this.$refs.popup.open()
						if(res.code == 5001){
							uni.setStorageSync('mid', res.data)
						}else if(res.code == 5002){
							this.paramsData.openId = res.data.openId;
							this.paramsData.unionId = res.data.unionId;
						}
					}
				});
			},
			
			closePopup(){
				this.$refs.popup.close()
			},
			//获取手机号
			decryptPhoneNumber(e) {  
				if (e.detail.errMsg == "getPhoneNumber:ok") {
					getPhone({ jscode: e.detail.code }).then((res) => {
						if(res.code == 200){
								if(this.WxLoginCode == 5001) this.bindPhone(res.data.phoneNumber);
								if(this.WxLoginCode == 5002) this.mobileLog(res.data.phoneNumber);
						}
					});
				} else {
					//拒绝授权或授权失败
				}
			},
			
			//绑定手机号
			bindPhone(phone){
				buildPhone({phone}).then((res) => {
					if(res.code == 200){
							uni.showToast({title: '绑定成功', icon:'success'});
							this.$refs.popup.close();
							this.getUserData();
					}
				});
			},
			
			//用户注册
			mobileLog(phone){
				let param = {
					...this.paramsData,
					phone
				}
				userReg(param).then((res) => {
					if(res.code == 200){
							uni.showToast({title: '登录成功', icon:'success'});
							this.$refs.popup.close();
							this.mid = res.data;
							uni.setStorageSync('mid', res.data)
							this.getUserData();
					}
				});
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
