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
					<view style="width: 100%; height: 100%;">
						<izUploaderImg
							ref="izUpImg1" 
							v-model="formData.goodsPic"  
							:number="1"  
							@change="change($event,'goodsPic')">
						</izUploaderImg>
					</view>
				</uni-forms-item>
				<uni-forms-item label="商品轮播图(≤9张)" name="goodsImgs">
					<view style="width: 100%; height: 100%;">
						<izUploaderImg
							ref="izUpImg2" 
							v-model="formData.goodsImgs"  							
							@change="change($event,'goodsImgs')">
						</izUploaderImg>
					</view>
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
					<view style="width: 100%; height: 100%;">
						<izUploaderImg
							ref="izUpImg3" 
							v-model="formData.goodsInfoImas"  
							:number="9"  
							@change="change($event,'goodsInfoImas')">
						</izUploaderImg>
					</view>
				</uni-forms-item>
				<uni-forms-item label="最低起售数量" name="fewPayNum">
					<uni-easyinput v-model="formData.fewPayNum" placeholder="不填默认为1" placeholder-style="font-size:28rpx"/>
					<span class="ml10">件</span>
				</uni-forms-item>	
				<uni-forms-item label="自定义排序" name="sort">
					<uni-easyinput v-model="formData.sort" placeholder="商品排序,范围在0-99" placeholder-style="font-size:28rpx"/>
				</uni-forms-item>
				<uni-forms-item label="商品销量" name="saleas">
					<uni-easyinput v-model="formData.saleas" placeholder="请输入商品销量" placeholder-style="font-size:28rpx"/>
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
	import izUploaderImg from '@/components/iz-uploader-img/iz-uploader-img.vue'
	
	export default {
		components: {
			izUploaderImg
		},
		data() {
			return {
				isEdit:false,
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
					imaa: {
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
				arr.goodsPic = [{ src: arr.goodsPic, url:arr.goodsPic}];
				arr.goodsInfoImas = mapUrlsToObjects(arr.goodsInfoImas);
				
				this.formData = arr;
				this.isEdit = true;
			}
			
			function mapUrlsToObjects(array) {
			  return array.map(function(imgUrl) {
			    return { src: imgUrl, url: imgUrl };
			  });
			}
			
		},
		onReady() {
			// 需要在onReady中设置规则
			this.$refs.baseForm.setRules(this.rules)	
			if(this.isEdit){
				setTimeout(()=>{
					this.$refs.izUpImg1.init(this.formData.goodsPic)
					this.$refs.izUpImg2.init(this.formData.goodsImgs)  
					this.$refs.izUpImg3.init(this.formData.goodsInfoImas)  
				},1200)
			}
			
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
			
			change(e,name){
				this.$set(this.formData,name,e.urls)
			},
			
			submitForm(tr) {
				this.$refs.baseForm.validate().then(res=>{
					console.log('表单数据信息：', res);
					let param = { ...res };
					param.goodsImgs = res.goodsImgs.join(',');
					param.goodsInfoImas = res.goodsInfoImas.join(',');
					param.goodsPic = res.goodsPic.join(',');
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
