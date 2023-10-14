<template>
	<view class="allBg">
		<view class="sadBox">
			<view class="sad-main">
				<template v-if="level==3">
					<view class="m-item">
						<view class="item-lt">店铺名</view>
						<view class="item-rt"><input type="text" v-model.trim="param.shopName" class="rt-input" placeholder="请输入店铺名" /></view>
					</view>
					<view class="m-item">
						<view class="item-lt">店铺地址</view>
						<view class="item-rt" @click="authVerification">
							<view :class="['rt-dz','overflow2',{'rt-gray':!param.address}]">{{param.address?param.address:'点击此处进行定位'}}</view>
							<uni-icons type="right" size="30rpx" color="#E5E5E5"></uni-icons>
						</view>
					</view>
					<view class="m-item">
						<view class="item-lt">门牌号</view>
						<view class="item-rt"><input v-model.trim="param.houseNumber" class="rt-input" placeholder="请输入具体门牌号以便配送" /></view>
					</view>
				</template>
				
				<view class="rInfo-fileImg">
					<view class="fileImg-lt">{{level==2?'个人照片':'店铺照片'}}</view>
					<view class="fileImg-rt">
						<uni-file-picker
							:image-styles="imageStyles"
							limit="1" 
							v-model="param.pic" 
							@select="select"  
							@delete="deletea">
						</uni-file-picker>
					</view>
				</view>
				
				<view class="m-item">
					<view class="item-lt">姓名</view>
					<view class="item-rt"><input type="text" v-model.trim="param.name" class="rt-input" placeholder="请输入姓名" maxlength="8"/></view>
				</view>
				<view class="m-item">
					<view class="item-lt">联系电话</view>
					<view class="item-rt"><input type="number" v-model.trim="param.phone" class="rt-input" placeholder="请输入手机号" maxlength="11"/></view>
				</view>
			</view>
			
			<view class="sad-btn" @click="saveAddr">保 存</view>
		</view>
	</view>
</template>

<script>
	import { addressList,    addressAdd,addressEdit } from '@/api/page/index.js'
	import { authVerification, mapsdk } from '@/common/tool.js'

	export default {
		data() {
			return {
				param:{
				},
				imageValue:[],
				level:2,
				imageStyles:{
					width:'170rpx',
					height:'170rpx',
				},
			}
		},
	
		onLoad(option) {
			this.level = option.level
			this.getAddr(this.level)
		},
		onShow () {
			uni.getStorage({
				key: 'currentLocation',
				success: (res) => {
				  if(res.data.errMsg == "chooseLocation:ok"){
					   this.$set(this.param,'address',res.data.address)
					   this.param.e =  res.data.longitude;
					   this.param.n =  res.data.latitude;
					  
					   setTimeout(()=>{
							uni.removeStorageSync('currentLocation')
					   },1000)
				  }
				}
			})
		},
		
		methods: {
			getAddr(){
				let addressType = this.level == 2 ? 3 : 2;
				addressList({ addressType }).then((res) => {
					if(res.code == 200){
						if(res.data.length>0){
							this.param = res.data[0]
							if(this.param.pic) this.param.pic = [{url:this.param.pic}];
							else{
								this.param.pic = []
							}
						}
					}
				});
			},
			
			authVerification,
			mapsdk,
			
			saveAddr(){
				let param = this.param;
				
				if(Object.keys(param).length == 0){
					uni.showToast({ title: `内容为空`, icon: 'none' });
					return; 
				}
				
				var fields = [
				  { key: 'name', name: '姓名' },
				  { key: 'phone', name: '手机' },
				];
				if(this.level == 3){
					fields.push({ key: 'shopName', name: '店铺名' }) 
					fields.push({ key: 'address', name: '定位地址' }) 
				}
				// 遍历字段并验证它们
				for (const field of fields) {
				  if (!param[field.key]) {
					uni.showToast({ title: `${field.name}不能为空`, icon: 'none' });
					return; // 如果有任何字段验证失败，直接返回
				  }
				}
				
				if(param.pic&&param.pic.length>0){
					param.pic = param.pic.map(item => item.url).join(',');
				}else{
					param.pic = ''
				}
				
				param.type = this.level == 2 ? 3 : 2;
				
				if(param.id){
					addressEdit(param).then((res) => {
						if(res.code == 200){
							uni.showToast({title: '修改成功', icon:'success'});
							setTimeout(() => {
								uni.navigateBack()
							}, 1000);
						}
					});
				}else{
					addressAdd(param).then((res) => {
						if(res.code == 200){
							uni.showToast({title: '添加成功', icon:'success'});
							setTimeout(() => {
								uni.navigateBack()
							}, 1000);
						}
					});
				
				}
			},
			
			// 获取上传状态
			select(e){
				if (!this.param.hasOwnProperty('pic')) {
				  this.$set(this.param, 'pic', []);
				}
				
				const imgUrl = e.tempFilePaths[0]
				uni.uploadFile({
					url: this.$BASE_URLS.FILE_upload_URL+'/elantra/img/file-upload', 
					filePath: imgUrl,
					name: 'file',
					header:{"Content-Type": "multipart/form-data"},
					success: (res) => {
						this.param.pic.push({
							url:JSON.parse(res.data).data,
						});
					}
				});
			},
			// 图片删除
			deletea(e,field){
				const num = this.param.pic.findIndex(v => v.url === e.tempFilePath);
				this.param.pic.splice(num, 1);
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	@import 'roleInfo.scss';
	@import '@/pages/setAddress/setAddress.scss';
</style>
