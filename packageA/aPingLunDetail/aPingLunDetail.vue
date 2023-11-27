<template>
	<view class="allBg">
		<view class="apd-title">买家评价</view>
		<view class="apd-main">
			<view class="main-top">
				<image :src="infoData.goodsPic" class="top-lt"></image>
				<view class="top-mid">
					<p class="mid-p">{{infoData.goodsName}}</p>
					<p class="mid-g">规格：默认</p>
				</view>
				<view class="top-rt">
					<template v-if="infoData.type==1">
						<uni-icons type="hand-up-filled" size="56rpx" color="#FF5C5C"></uni-icons><p class="rt-p">好评</p>
					</template>
					<template v-else-if="infoData.type==2">
						<uni-icons type="hand-up" size="56rpx" color="#FF5C5C"></uni-icons><p class="rt-p">中评</p>
					</template>
					<template v-else>
						<uni-icons type="hand-down" size="56rpx" color="#FF5C5C"></uni-icons><p class="rt-p">差评</p>
					</template>
				</view>
			</view>
			
			<p class="apd-p" v-if="infoData.content">{{infoData.content}}</p>
			<view class="image-grid" v-if="infoData.pic.length>0">
			  <image v-for="(i,ind) in infoData.pic" :key="ind" :src="i" mode="aspectFill" class="image" @click="getImgIndex(infoData.pics,ind)"></image>
			</view>
		</view>
		
		<view class="apd-title">卖家回复</view>
		<view class="apd-hf">
			<textarea class="hf-txt" v-model="infoData.replyContent" placeholder="请输入回复内容" maxlength="-1"/>
			<uni-data-select 
				class="apd-slt" 
				placeholder="可选择快捷回复" 
				v-model="infoData.replyContent" 
				:localdata="cateData" >
			</uni-data-select>
		</view>
		<view class="apd-btn" @click="subFB">发布回复</view>
		
	</view>
</template>

<script>
	import { commentReply } from '@/api/page/manage.js'
	export default {
		
		data() {
			return {
				infoData:{},
				cateData:[
					{
						text: '感谢您的支持！',
						value: '非常感谢您对我们产品的喜爱和支持，我们将继续努力，为您提供更好的产品和服务',
						
					},
					{
						text: '期待您的再次光临',
						value: '我们期待在未来再次为您提供优质的产品和服务，如果有任何问题或需求，请随时联系我们。',
						
					},
					{
						text: '您的满意是我们最大的动力！',
						value: '我们非常高兴听到您对产品的满意，这是我们团队努力工作的最好回报。',
						
					},
					{
						text: '感谢您的反馈',
						value: '我们感谢您分享您的意见。我们将认真考虑您的反馈，不断改进我们的产品。',
						
					},
					{
						text: '如果有任何建议，我们愿意听取',
						value: '如果您有任何关于如何改进我们的产品或服务的建议，我们非常愿意倾听。',
						
					},
					{
						text: '请联系我们',
						value: '如果您对产品不满意，或遇到了问题，请不要犹豫，与我们联系，我们将竭诚为您解决。',
						
					},
					{
						text: '非常抱歉您的不满',
						value: '我们对您的不满深感抱歉。我们将努力改进，确保不再出现类似问题。',
						
					},
					{
						text: '请给我们一个机会',
						value: '我们希望能够弥补我们犯下的错误。请联系我们，让我们知道您的具体问题，以便我们解决。',
						
					},
					{
						text: '客户满意度是我们的首要任务',
						value: '我们的目标是确保每位客户都满意。如果您不满意，我们将采取一切必要措施来解决问题。',
						
					},
				],
			}
		},
		onLoad(option) {
			this.infoData = JSON.parse(option.item)
			console.log(this.infoData)
		},
		methods: {
			subFB(){
				let param = {
					content: this.infoData.replyContent,
					id: this.infoData.id
				}
				commentReply(param).then((res) => {
					if(res.code == 200){
						uni.showToast({ title: '发布成功',icon:'success' });
						setTimeout(()=>{
							uni.$emit('hfOk');
							uni.navigateBack({
								delta: 1
							})
						},1000)
					}
				})
			},
			
			getImgIndex(obj,index) { //图片预览
				let imgs = obj.map(item => {
					//只返回图片路径
					return item
				})
				//调用预览图片的方法
				uni.previewImage({
					urls: imgs,
					current: index
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	@import 'aPingLunDetail.scss'
</style>
