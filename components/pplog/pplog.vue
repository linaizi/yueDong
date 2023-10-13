<template>
	<view class="">
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
						<input type="nickname" v-model.trim="paramsData.nickName" class="rt-input" placeholder="请输入昵称" maxlength="8"/>
					</view>
				</view>
				<view class="log-sj" @click="suiJi">随机头像昵称</view>
				<view class="log-btn log-yes" @click="getWxCode">允许</view>
				<view class="log-btn log-no" @click="closeLog">拒绝</view>
			</view>
		</uni-popup>
		
		<!-- 绑定手机号弹窗 -->
		<uni-popup ref="popup" :is-mask-click='false'>
			<view class="index-popup popup-box">
				<view class="indexPopup-close" @click="closePopup">
					<image class="close-img" :src="FILE_BASE_URL + '/ad3ad3e5-2bb4-400a-b846-5800a747fa3d.jpg'" mode="widthFix"></image>
				</view>
				<image class="indexPopup-img" :src="FILE_BASE_URL + '/ac2a9d09-19cc-49b7-9f61-36084df0508e.jpg'"></image>
				<p class="indexPopup-p">为保障您的账号安全 请绑定手机号码</p>
				<button type="default" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber" @click="closePopup" class="indexPopup-btn">绑定手机号码</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { debounce } from "@/common/throttle.js";
	import { WxLogin,getPhone,buildPhone,userReg } from '@/api/page/index.js'
	export default{
		props:{
			mid: {
                type: String,
                default: "",
            }
		},
		data(){
			return{
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				paramsData:{
					avatar: this.$BASE_URLS.FILE_BASE_URL+'/60a219d8-a949-41ec-9ed7-40be2b57d6dd.jpg',
					nickName:"翱翔的敦敦"
				},
				WxLoginCode:1,
				sjArr:[
					{ avatar:this.$BASE_URLS.FILE_BASE_URL+'/f8c3b0d7-4d29-4f89-acbd-67f4960c1fda.jpg', nickName:"飞翔的燕子" },
					{ avatar:this.$BASE_URLS.FILE_BASE_URL+'/df3f27d2-2f11-4809-9f60-e208d063da3d.jpg', nickName:"魔幻的夜曲" },
					{ avatar:this.$BASE_URLS.FILE_BASE_URL+'/b065af83-be01-4921-ad38-8cca3705961f.jpg', nickName:"铁拳的李白" },
					{ avatar:this.$BASE_URLS.FILE_BASE_URL+'/61255346-bb33-44b9-bb51-24d659ef01d1.jpg', nickName:"突破的火星" },
					{ avatar:this.$BASE_URLS.FILE_BASE_URL+'/38f9e3d9-fbee-463f-8bfa-8e9e9e9078d5.jpg', nickName:"潜伏的幽灵" },
					{ avatar:this.$BASE_URLS.FILE_BASE_URL+'/70f511c2-ff8a-412b-90ac-d21b7c119f5c.jpg', nickName:"躁动的巨人" },
					{ avatar:this.$BASE_URLS.FILE_BASE_URL+'/0eae5f35-4982-46ac-a188-211251198a2b.jpg', nickName:"悲伤的嫦娥" },
					{ avatar:this.$BASE_URLS.FILE_BASE_URL+'/8198078f-ad9a-4312-a399-e5b5ea88e71d.jpg', nickName:"勇敢的狼牙" },
					{ avatar:this.$BASE_URLS.FILE_BASE_URL+'/f827077d-414a-4ae7-b951-f661ce1f863b.jpg', nickName:"冷静的暗影" },
					{ avatar:this.$BASE_URLS.FILE_BASE_URL+'/717679f4-9d21-4b00-a35d-5ea22f436d24.jpg', nickName:"绽放的霞光" },
				],
				lastRandomIndex:-1,
			}
		},
		
		methods:{
			suiJi(){
				const sjArrLength = this.sjArr.length;
				
				let randomIndex;
				do {
				  randomIndex = Math.floor(Math.random() * sjArrLength);
				} while (randomIndex === this.lastRandomIndex);
				
				this.lastRandomIndex = randomIndex;
				
				this.paramsData = this.sjArr[randomIndex];
			},
			
			onChooseAvatar(e) {
				const { avatarUrl } = e.detail 
				uni.uploadFile({
					url: this.$BASE_URLS.FILE_upload_URL+'/elantra/img/file-upload', 
					filePath: avatarUrl,
					name: 'file',
					formData: {
						'user': 'test'
					},
					success: (f) => {
						let res = JSON.parse(f.data)
						if(res.code == 200){
							console.log(res.data)
							this.paramsData.avatar = res.data;
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
						this.$emit('update:mid',res.data);
						uni.setStorageSync('mid', res.data)
						this.$emit('getData',this.WxLoginCode);
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
			
			closeLog(){ this.$refs.logPopup.close() },
			
			
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
							this.$emit('getData');
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
							this.$emit('update:mid',res.data);
							uni.setStorageSync('mid', res.data)
							this.$emit('getData');
					}
				});
			},
			
		},
	
	}
</script>

<style lang="scss" scoped>
	.index-popup{
		text-align: center;
		.indexPopup-img{
			width: 64upx;
			height: 64upx;
			margin-bottom: 20upx;
		}
		.indexPopup-p{
			font-size: 32upx;
			color: #333;
			margin: 0 auto;
			width: 76%;
		}
	}
		
	.popup-box{
		background: #fff;
		padding: 88upx 40upx 75upx;
		border-radius: 24upx;
		position: relative;
		.indexPopup-close{
			position: absolute;
			right: 10upx;
			top: 5upx;
			width: 60upx;
			height: 60upx;
			@include dflex(center,center);
			.close-img{
				width: 24upx;
				height: 24upx;
			}
		}
		.indexPopup-p{
			width: 63%;
			margin: 0 auto 35upx;
		}
		.indexPopup-btn{
			width: 100%;
			height: 90upx;
			text-align: center;
			line-height: 90upx;
			background: #1677FF;
			border-radius: 100upx;
			font-size: 32upx;
			color:#F0f0f0;
			background: linear-gradient(270deg, #FF5000 0%, #FF9000 100%);
		}
	}
		
	// 登录弹窗
	.log-pp{
		background: #fff;
		border-radius: 20upx 20upx 0 0;
		padding: 40upx 44upx 50upx;
		.log-title{
			font-size: 30upx;
			color:#333;
			font-weight: bold;
		}
		.log-sj{
			font-size: 26upx;
			color:#5A6A94;
			padding-top: 26upx;
			margin-bottom: 30upx;
		}
		.log-btn{
			@include dflex(center,center);
			height:76upx;
			font-size:28upx;
			color:#5A6AB0;
		}
		.log-yes{
			background: #EAF0FF;
			border-radius: 4upx;
			color:#3358D3;
		}
		
	}
</style>
