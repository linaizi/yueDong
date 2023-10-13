<template>
	<view class="allBg addSpBg">
		<view class="addSp-form">
			<uni-forms ref="baseForm" :modelValue="formData" :rules="rules">
				<uni-forms-item label="商品分类" name="cateId">
					<uni-data-select
						v-model="formData.cateId"
						:localdata="cateData"
						@change="cateChange"
					></uni-data-select>
				</uni-forms-item>
				<uni-forms-item label="商品主图(1张)" name="goodsPic">
					<uni-file-picker
						limit="1" 
						v-model="formData.goodsPic" 
						@select="select($event,'goodsPic')"  
						@delete="deletea($event,'goodsPic')">
					</uni-file-picker>
				</uni-forms-item>
				<uni-forms-item label="商品轮播图(≤9张)" name="goodsImgs">
					<uni-file-picker
						limit="9" 
						v-model="formData.goodsImgs" 
						@select="select($event,'goodsImgs')"  
						@delete="deletea($event,'goodsImgs')">
					</uni-file-picker>
				</uni-forms-item>
				<uni-forms-item label="商品名称" name="goodsName">
					<uni-easyinput v-model="formData.goodsName"  placeholder="请输入商品名称" placeholder-style="font-size:28rpx"/>
				</uni-forms-item>
				<uni-forms-item label="商品原价" name="goodsPrice">
					<uni-easyinput v-model="formData.goodsPrice" placeholder="请输入商品原价" placeholder-style="font-size:28rpx"/>
					<span class="ml10">元</span>
				</uni-forms-item>
				<uni-forms-item label="商品现价" name="goodsNowPrice">
					<uni-easyinput v-model="formData.goodsNowPrice" placeholder="请输入商品现价" placeholder-style="font-size:28rpx"/>
					<span class="ml10">元</span>
				</uni-forms-item>
				<uni-forms-item label="商品库存" name="stockNum">
					<uni-easyinput v-model="formData.stockNum" placeholder="请输入商品库存" placeholder-style="font-size:28rpx"/>
					<span class="ml10">件</span>
				</uni-forms-item>
				<uni-forms-item label="商品详情图(≤9张)" name="goodsInfoImas">
					<uni-file-picker
						limit="9" 
						v-model="formData.goodsInfoImas" 
						@select="select($event,'goodsInfoImas')"  
						@delete="deletea($event,'goodsInfoImas')">
					</uni-file-picker>
				</uni-forms-item>
			
			</uni-forms>
		</view>
		
		<view class="addSp-btn">
			<view class="btn" @click="submitForm(false)">保 存</view> 
			<view class="btn btn1" @click="submitForm(true)">上 架</view> 
		</view>
		
		
	</view>
</template>

<script>
	import { categoryList } from '@/api/page/index.js'
	import { goodsAdd,goodsEdit } from '@/api/page/manage.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				cateData:[],
				formData: {
					stockNum:1000
				},
				rules: {
					cateId:{
						rules:[{
							required: true,
							errorMessage: '商品分类不能为空'
						}]
					},
					goodsPic: {
						rules: [{
								required: true,
								errorMessage: '图片不能为空',
							}
						]
					},
					goodsImgs: {
						rules: [{
								required: true,
								errorMessage: '图片不能为空',
							}
						]
					},
					goodsName:{
						rules:[{
							required: true,
							errorMessage: '商品名称不能为空'
						}]
					},
					goodsPrice:{
						rules:[{
							required: true,
							errorMessage: '商品原价不能为空'
						}, {
							format: 'number',
							errorMessage: '只能输入数字'
						}]
					},
					goodsNowPrice:{
						rules:[{
								format: 'number',
								errorMessage: '只能输入数字'
							}, {
								required: true,
								errorMessage: '商品现价不能为空'
							},
							{
								validateFunction: function(rule, value, data, callback) {
									if (value> data.goodsPrice) {
										callback('商品现价不能大于原价')
									}
									return true
								}
							}
						]
					},
					stockNum:{
						rules:[{
							required: true,
							errorMessage: '库存不能为空'
						}, {
							format: 'number',
							errorMessage: '只能输入数字'
						}]
					},
					goodsInfoImas: {
						rules: [{
								required: true,
								errorMessage: '图片不能为空',
							}
						]
					},
				}
			}
		},
		onLoad(option) {
			this.getCateList()  //获取分类列表
			if(option.item) {
				let arr = JSON.parse(option.item)
				arr.goodsImgs = mapUrlsToObjects(arr.goodsImgs);
				arr.goodsPic = [{url:arr.goodsPic}];
				arr.goodsInfoImas = mapUrlsToObjects(arr.goodsInfoImas);
				
				this.formData = arr;
			}
			
			function mapUrlsToObjects(array) {
			  return array.map(function(imgUrl) {
			    return { url: imgUrl };
			  });
			}
			
		},
		onReady() {
			// 需要在onReady中设置规则
			this.$refs.baseForm.setRules(this.rules)
		},
		
		methods: {
			getCateList(){
				categoryList().then((res) => {
					if(res.code == 200){
						this.cateData = res.data.map(option => {
							return {
								value: option.id,
								text: option.cname,
							};
						});
					}
				})
			},
			
			cateChange(){},
			
			//用于内置组件或三方组件返回值的校验 如input组件值的变化，无法及时通知 uni-forms ，从而无法正常的校验，
			// 这时就需要我们手动将这些值加入到uni-forms的校验
			// 设置表单某项对应得值来触发表单校验；接受两个参数，第一个参数为表单域的 name ，第二个参数为表单域的值
			setValue(name,value){
				this.$refs.baseForm.setValue(name,value)
			},
			
			// 获取上传状态
			select(e,field){
				// 如果formData中不存在field属性，初始化为空数组
				if (!this.formData.hasOwnProperty(field)) {
				  this.$set(this.formData, field, []);
				}
				
				e.tempFilePaths.forEach((item)=>{
					const imgUrl = item
					uni.uploadFile({
						url: this.$BASE_URLS.FILE_upload_URL+'/elantra/img/file-upload', 
						filePath: imgUrl,
						name: 'file',
						header:{"Content-Type": "multipart/form-data"},
						success: (res) => {
							this.formData[field].push({
								url:JSON.parse(res.data).data,
							});
						}
					});
				})	
				
			},
			// 图片删除
			deletea(e,field){
				const num = this.formData[field].findIndex(v => v.url === e.tempFilePath);
				this.formData[field].splice(num, 1);
			},
			
			submitForm(tr) {
				this.$refs.baseForm.validate().then(res=>{
					console.log('表单数据信息：', res);
					let param = { ...res };
					param.goodsImgs = res.goodsImgs.map(item => item.url).join(',');
					param.goodsInfoImas = res.goodsInfoImas.map(item => item.url).join(',');
					param.goodsPic = res.goodsPic.map(item => item.url).join(',');
					param.ifSaveAndGrounding = tr;
					
					uni.showLoading()
					let txt = "添加成功"
					const fetchData = (queryFunction) => {
						queryFunction(param).then((res) => {
							if (res.code === 200) {
							  uni.showToast({ title: txt, icon:'success' });
							  setTimeout(()=>{
							  	uni.$emit('addOk');
							  	uni.navigateBack({
							  		delta: 1
							  	})
							  },1000)
							}
							uni.hideLoading()
						})
						
					};
					
					if (this.formData.id) {
						txt = "更新成功"
						param.id = this.formData.id;
						fetchData(goodsEdit);
					} else{
						fetchData(goodsAdd);
					}
					
					
				}).catch(err =>{
					console.log('表单错误信息：', err);
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'addShop.scss'
</style>
