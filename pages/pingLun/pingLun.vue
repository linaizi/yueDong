<template>
	<view class="allBg">
		<view class="pl-top">
			<view class="top-lt">描述相符</view>
			<view class="top-item" v-for="item in iconArr" :key="item.id" @click="iconClick(item)">
				<image :src="item.check ? item.img1 : item.img" mode="" class="item-img"></image>
				<span :class="{'s-red':item.check}">{{item.name}}</span>
			</view>
		</view>
		
		<view class="pl-box">
			<view class="pl-title">开始评价</view>
			<textarea placeholder="对我们的服务怎么样~" class="pl-text" v-model="content"></textarea>
			
			<view class="pl-title">上传图</view>
			<uni-file-picker
				limit="9" 
				v-model="imageValue" 
				@select="select"  
				@delete="deletea">
			</uni-file-picker>
		</view>
		
		<view class="pl-nm" @click="isNM = !isNM">
			<view :class="['circle',{'circle-red':isNM}]"></view>
			匿名提交
		</view>
		<view class="pl-btn" @click="subClick">提 交</view>
		
	</view>
</template>

<script>
	import { debounce } from "@/common/throttle.js";
	import { commentAdd } from '@/api/page/index.js'
	export default {
		
		data() {
			return {
				iconArr:[
					{ 
						img:this.$BASE_URLS.FILE_BASE_URL+'/5e83b5ae-a4b5-4adc-89ef-5b2def33af81.png', 
						img1:this.$BASE_URLS.FILE_BASE_URL+'/5b8475e5-bb1d-4ed3-8252-9be0325ae7a6.png', 
						id:1,
						name:'好评',
						check:false
					},
					{ 
						img:this.$BASE_URLS.FILE_BASE_URL+'/0e2dd0da-dad9-44e3-88b6-e0c008940653.png', 
						img1:this.$BASE_URLS.FILE_BASE_URL+'/c8dd5279-7f7c-477e-884a-77a1dc2e6b6e.png', 
						id:2,
						name:'中评',
						check:false
					},
					{ 
						img:this.$BASE_URLS.FILE_BASE_URL+'/8408c5c9-fe55-47e0-bff0-e1665b3c15d0.png', 
						img1:this.$BASE_URLS.FILE_BASE_URL+'/267f7d12-74f4-4f10-92e8-f58322dcdb56.png', 
						id:3,
						name:'差评',
						check:false
					},
				],
				type: 0,
				content:'',
				imageValue:[],
				goodsInfo:{},
				isNM:false,
			}
		},
		onLoad(option) {
			this.goodsInfo = JSON.parse(option.goodsInfo)
		},
		methods: {
			iconClick(selectedItem){
				this.type = selectedItem.id;
				this.iconArr.forEach(item => {
					item.check = item.id === selectedItem.id;
				});
			},
			
			subClick: debounce(function(){
				if (this.type === 0) {
					uni.showToast({ title: '请选择描述相符', icon: 'none' });
					return;
				}
				let pics = this.imageValue.map(item => item.url).join(',');
				
				const requests = this.goodsInfo.map(item => {
				    const param = {
				      content: this.content,
				      ifAnonymous: this.isNM,
				      pic: pics,
				      type: this.type,
				      goodsId: item.id,
				      goodsName: item.goodsName,
				      goodsPic: item.goodsPic,
				    };
				
				    return commentAdd(param); // 返回请求的 Promise
				});
				
				// 使用 Promise.all 来等待所有请求完成
				Promise.all(requests)
				    .then(() => {
						uni.showToast({title: '评价成功', icon:'success'});
						setTimeout(()=>{
							uni.$emit('PingLun');
							uni.navigateBack({
								delta: 1
							})
						},1000)
				    })
				    .catch(error => {
				      console.error('An error occurred:', error);
				      // 处理请求错误
				    });
			},2000),
			
			// 获取上传状态
			select(e){
				e.tempFilePaths.forEach((item)=>{
					const imgUrl = item
					uni.uploadFile({
						url: this.$BASE_URLS.FILE_upload_URL+'/elantra/img/file-upload', 
						filePath: imgUrl,
						name: 'file',
						header:{"Content-Type": "multipart/form-data"},
						success: (res) => {
							this.imageValue.push({
								url:JSON.parse(res.data).data,
							})
						}
					});
				})	
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
	@import 'pingLun.scss'
</style>
