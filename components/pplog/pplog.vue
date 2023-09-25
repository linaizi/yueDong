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
	import { debounce } from "@/common/throttle.js";
	import { WxLogin,getPhone,buildPhone,userReg } from '@/api/page/index.js'
	export default{
		props:{
			mid:{
				type:Number
			},
		},
		data(){
			return{
				paramsData:{
					avatar:"https://file.aikbao.com/20230619140350568",
					nickName:"小明"
				},
				WxLoginCode:1,
			}
		},
		
		methods:{
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
	.kf-pp{
		width: 550upx;
		border-radius: 12upx;
		padding: 24upx 28upx 40upx;
		box-sizing: border-box;
		background: #fff;
		position: relative;
		.kf-title{
			font-size: 34upx;
			font-weight: bold;
			color:#333;
			text-align: center;
		}
		.kf-img{
			display: block;
			width: 450upx;
			margin: 16upx auto;
		}
		.kf-phone{
			font-size: 30upx;
			color:blue;
			font-weight: bold;
			text-align: center;
			text-decoration: underline;
		}
		.hbtxt{
			@include dflex(center,center);
			background: #1081f2;
			width: 250upx;
			height: 70upx;
			font-size: 30upx;
			color:#fff;
			border-radius: 100upx;
			margin: 30upx auto 0;
		}
		.kfClose{
			position: absolute;
			bottom:-80upx;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>
