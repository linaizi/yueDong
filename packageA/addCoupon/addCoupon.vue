<template>
	<view class="allBg">
		<view class="addSp-form">
			<uni-forms ref="baseForm" :modelValue="formData" :rules="rules">
				<uni-forms-item label="优惠券类型" name="type">
					<uni-data-select
						v-model="formData.type"
						:localdata="cateData"
					></uni-data-select>
				</uni-forms-item>
				<uni-forms-item label="券面额" name="amount">
					<uni-easyinput v-model="formData.amount" placeholder="请输入券面额" placeholder-style="font-size:28rpx"/>
					<span class="ml10">元</span>
				</uni-forms-item>
				<uni-forms-item label="使用条件" name="conditionAmount">
					<uni-easyinput v-model="formData.conditionAmount" placeholder="满多少元可用" placeholder-style="font-size:28rpx"/>
					<span class="ml10" style="flex-shrink: 0;">元内可用</span>
				</uni-forms-item>
				<uni-forms-item label="券领取时间" name="lqTime">
					 <uni-datetime-picker v-model="formData.lqTime" type="datetimerange" rangeSeparator="至" />
				</uni-forms-item>
				<uni-forms-item label="券使用时间" name="syTime">
					 <uni-datetime-picker v-model="formData.syTime" type="datetimerange" rangeSeparator="至" />
				</uni-forms-item>
			</uni-forms>
		</view>
		
		<view class="addSp-btn">
			<view class="btn" @click="submitForm">保 存</view> 
		</view>
		
	</view>
</template>

<script>
	import { AcouponAdd } from '@/api/page/manage.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				cateData:[
					{
						value: 1,
						text: '新人券',
					},
					{
						value: 2,
						text: '满减券',
					},
				],
				formData: {},
				rules: {
					type:{
						rules:[{
							required: true,
							errorMessage: '优惠券类型不能为空'
						}]
					},
					amount:{
						rules:[{
							required: true,
							errorMessage: '券面额不能为空'
						}, {
							format: 'number',
							errorMessage: '只能输入数字'
						}]
					},
					conditionAmount:{
						rules:[{
							required: true,
							errorMessage: '使用条件不能为空'
						}, {
							format: 'number',
							errorMessage: '只能输入数字'
						}]
					},
					lqTime:{
						rules:[{
							required: true,
							errorMessage: '领取时间不能为空'
						}]
					},
					syTime:{
						rules:[{
							required: true,
							errorMessage: '使用时间不能为空'
						}]
					},
				}
			}
		},
		// watch: {
		// 	datetimerange(newval) {
		// 		console.log("范围选:", this.datetimerange);
		// 		this.listQuery.beginTime = this.datetimerange[0]
		// 		this.listQuery.endTime = this.datetimerange[1]
				
		// 	},
		// },
		onReady() {
			// 需要在onReady中设置规则
			this.$refs.baseForm.setRules(this.rules)
		},
		
		methods: {			
			submitForm(tr) {
				this.$refs.baseForm.validate().then(res=>{
					console.log('表单数据信息：', res);
					
					const { lqTime, syTime, ...newItem } = res;
					let param = newItem
					
					param.possessStartTime = res.lqTime[0];
					param.possessEndTime = res.lqTime[1];
					[param.useStartTime,param.useEndTime] = res.syTime;
					
					if(new Date(param.useEndTime) <= new Date(param.possessEndTime)){
						uni.showToast({
							title: `优惠券使用的结束时间不能低于优惠券领取的结束时间`,
							duration:3000,
							icon:'none',
						});
						return;
					}
						
					AcouponAdd(param).then((res) => {
						if (res.code === 200) {
						  uni.showToast({ title: `保存成功`,icon:'success' });
						  setTimeout(()=>{
							uni.$emit('addCou');
							uni.navigateBack({
								delta: 1
							})
						  },1000)
						}
					})
					
				}).catch(err =>{
					console.log('表单错误信息：', err);
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	@import 'addCoupon.scss'
</style>
