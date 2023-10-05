<template>
	<view class="bgBox">
		<view class="perItem">
			<view class="item-lt">头像</view>
			<view class="item-rt">
				<button class="rt-but" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
						<image class="rt-img" :src="UserInfo.avatar"></image>
				</button> 
				<uni-icons type="right" size="32rpx" color="#777"></uni-icons>
			</view>
		</view>
		<view class="perItem">
			<view class="item-lt">昵称</view>
			<view class="item-rt">
				<input type="nickname" v-model.trim="UserInfo.nickName" class="rt-input" placeholder="请输入昵称" maxlength="8"/>
			</view>
		</view>
		
		<!-- <uni-file-picker
			limit="9" 
			v-model="imageValue" 
			@select="select"  
			@delete="deletea">
		</uni-file-picker> -->
		
		<view class="perBtn" @click="updClick">确 定</view>
	</view>
</template>

<script>
	import { updUserInfo } from '@/api/page/index.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				UserInfo:{},
				
				imgURL:'',
				imageValue:[],
			}
		},
		onReady() {
			this.UserInfo = JSON.parse(uni.getStorageSync('UserInfo'))
		},
		methods: {
			onChooseAvatar(e) {
				const { avatarUrl } = e.detail 
				
				uni.uploadFile({
					url: this.$BASE_URLS.FILE_upload_URL+'/elantra/img/file-upload', 
					filePath: avatarUrl,
					name: 'file',
					success: (f) => {
						let res = JSON.parse(f.data)
						if(res.code == 200){
							// console.log(res.data)
						}
					},
					fail: (e) => {
						console.log('err:',e)
					},
				});
			},
			
			updClick(){
				let param = {
					avatar:this.UserInfo.avatar,
					nickName:this.UserInfo.nickName,
				}
				updUserInfo(param).then((res) => {
						uni.setStorageSync('UserInfo', JSON.stringify(this.UserInfo))
						uni.showToast({title: '修改成功', icon:'success'});
						setTimeout(() => {
							uni.navigateBack()
						}, 1200);
				});
			},
			
			// 获取上传状态
			select(e){
				const imgUrl = e.tempFilePaths[0]
				uni.uploadFile({
					url: this.$BASE_URLS.FILE_upload_URL+'/elantra/img/file-upload', 
					filePath: imgUrl,
					name: 'file',
					header:{"Content-Type": "multipart/form-data"},
					success: (res) => {
						console.log(JSON.parse(res.data).data)
					}
				});
			},
			
			// 图片删除
			deletea(e){
				const num = this.imageValue.findIndex(v => v.url === e.tempFilePath);
				this.imageValue.splice(num, 1);
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'personData.scss'
</style>
