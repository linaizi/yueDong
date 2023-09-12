<template>
	<view class="allBg">
		<view class="topBox">
			<view class="tab-t">
				<view :class="['t-item',{'t-item-lt':tabNum==0}]" @click="tabNum=0"><image src="../../static/img/tab2-1.jpg" mode="" class="t-img"></image>到店服务</view>
				<view :class="['t-item',{'t-item-rt':tabNum==1}]" @click="tabNum=1"><image src="../../static/img/tab2-1.jpg" mode="" class="t-img"></image>上面取送</view>
			</view>
			<view class="tab-form" v-if="tabNum==0">
				<uni-forms :model="formData" border class="aa">
					<uni-forms-item label="姓名" name="name">
						<input type="text" v-model="formData.name" placeholder="请输入姓名" maxlength="10" class="tab-ipt" />
					</uni-forms-item>
					<uni-forms-item label="电话" name="phone">
						<input type="number" v-model="formData.phone" placeholder="请输入电话" maxlength="11" class="tab-ipt"/>
					</uni-forms-item>
				</uni-forms>
			</view>
			<view class="tab-form" v-else>
				<view class="form-noadr" v-if="false">
					<span>+</span>请添加同城配送地址
				</view>
				<view class="form-adr" v-else>
					<view class="adr-lt">
						<view class="lt-t">阿道夫 <span>13411112222</span><p>配送范围内</p></view>
						<view class="lt-b overflow2">广东省广州市天河区五山路483号华南农业大学201</view>
					</view>
					<uni-icons type="forward" size="22" color="#666"></uni-icons>
				</view>
			</view>
		</view>
		
		<view class="buyBox">
			<view class="title">跃动球鞋洗护</view>
			
			<view class="dsdBox" v-if="true">
				<view class="dsd-adr">
					<view class="adr-t">
						<view class="t-l">
							<uni-icons type="paperplane" size="18" color="#999"></uni-icons>
							校园通代收点
							<uni-icons type="right" size="16" color="#999"></uni-icons>
						</view>
						<view class="t-r"><uni-icons type="location" size="18" color="#CDCDCD"></uni-icons>距您85.87km</view>
					</view>
					<view class="adr-b">华南农业大学校园泰山区通代收点</view>
				</view>
				<view class="buy-time">
					<p>预约提货时间</p>
					<view class="time-red">今天(周一)17:30-18:00<uni-icons type="right" size="16" color="#999"></uni-icons></view>
				</view>
			</view>
			<view class="dsdBox-no" v-else>请添加联系人 <p>添加配送地址</p></view>
			
			<view class="ordre-item buy-item">
				<image src="../../static/img/good1.png" class="main-lt"></image>
				<view class="item-mid">
					<p class="mid-p overflow1">高级鞋类精选三双</p>
					<p>规格：默认</p>
					<p>x4</p>
				</view>
				<view class="main-rt">￥81.90</view>
			</view>
			
			<view class="buy-time">
				<p><span>惠</span>预约提货时间</p>
				<view  :class="hasQ ? 'time-red':'time-gray'">
					<span>1张可用</span>
					<!-- 暂无可用优惠券 -->
					<uni-icons type="right" size="16" color="#999"></uni-icons>
				</view>
			</view>
			<view class="buy-all"> <p class="all-g">共1件</p> <p>共计：</p> <p class="all-r">￥69.60</p> </view>
		</view>
		
		<view class="buyBox">
			<view class="title">自定义表单</view>
			
			<view class="formbBd">
				<p>备注：</p>
				<input type="text" placeholder="请输入备注"  class="bd-ipt" />
			</view>
			<view class="formbBd">
				<p><span>*</span>图片上传：</p>
				<view class="formbBd-img">
					<uni-file-picker 
						limit="9" 
						v-model="imageValue" 
						@select="select"  
						@progress="progress" 
						@success="success"
						@fail="fail" 
						@delete="deletea">
					</uni-file-picker>
				</view>
			</view>
		</view>
		
		<view style="height: 140upx;"></view>
		
	</view>
</template>

<script>
	
	export default {
		components: {
			
		},
		data() {
			return {
				formData:{},
				imgURL:'',
				imageValue:[],
				tabNum:0,
				hasQ:true,
			}
		},
		onLoad() {
			//全局定义的图片访问地址前缀
			this.imgURL=this.$imgURL
		},
		methods: {
			// 获取上传状态
			select(e){
				console.log('选择文件：',e)
				const tempFilePaths = e.tempFilePaths;
				const imgUrl=tempFilePaths[0]
				uni.uploadFile({
					url: 'https://xxx.xxx.com/api/uploadpic2/', 
					filePath: imgUrl,
					name: 'imgUrl',
					header:{"Content-Type": "multipart/form-data"},
					success: (uploadFileRes) => {
						console.log('uploadFileRes',JSON.parse(uploadFileRes.data));
						let path=JSON.parse(uploadFileRes.data)
						//后端返回的地址，存入图片地址
						this.imageValue.push({
							url:this.imgURL+path.imgUrl,
							name:''
						})
						console.log('imageValue',this.imageValue)
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
	@import 'buy.scss'
</style>
