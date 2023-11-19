<template>
	<view class="allBg">
		<view class="as-contain">
			<view class="asBox">
				<template v-if="infoData.goodsInfo">
					<view class="ordre-item" v-for="(i,ind) in JSON.parse(infoData.goodsInfo)" :key="ind">
						<image :src="i.goodsPic" class="main-lt"></image>
						<view class="item-mid">
							<p class="mid-p overflow1">{{i.goodsName}}</p>
							<p>规格：默认</p>
							<p>x{{i.goodsNum}}</p>
						</view>
						<view class="main-rt">￥{{i.goodsNowPrice}}</view>
					</view>
				</template>
				
				
				<view class="as-price">
					<p class="as-p">商品总价: <span>￥{{infoData.goodsTotalAmount}}</span></p>
					<p class="as-p">
						合计: ￥{{infoData.payAmount}}
						<span class="p-span" v-if="infoData.freightAmount">(含运费￥{{infoData.freightAmount}})</span>
					</p>
				</view>
			</view>
			
			<view class="asBox1">
				<view class="m-item">
					<view class="item-lt">退款原因</view>
					<view class="item-rt">
						<uni-data-select
							v-model="param.afterReason"
							:localdata="cateData"
						></uni-data-select>
					</view>
				</view>
				<view class="m-item">
					<view class="item-lt">退款金额</view>
					<view class="item-rt"><span class="rt-red">￥{{ param.afterAmount }}</span></view>
				</view>
				<view class="m-item">
					<view class="item-lt">退款备注</view>
					<view class="item-rt"><input v-model.trim="param.afterRemark" class="rt-input" placeholder="最多可填140个字" /></view>
				</view>
				<view class="m-item">
					<view class="item-lt">联系客服</view>
					<view class="item-rt">
						<view class="phone" @click.stop="PhoneCall('13113966491')"><uni-icons type="phone" size="30rpx" color="#446DFD"></uni-icons>13113966491</view>
					</view>
				</view>
			</view>
				
			
			<view class="sad-btn" @click="saveAddr">提 交</view>
		</view>
		
	</view>
</template>

<script>
	import { afterAmount,afterOrder } from '@/api/page/index.js'
	
	export default {
		data() {
			return {
				infoData:{},
				param:{},
				
				cateData:[
					{ value: '不想洗了', text: '不想洗了' },
					{ value: '协商一致退款', text: '协商一致退款' },
					{ value: '商家缺货/打烊，联系我取消', text: '商家缺货/打烊，联系我取消' },
					{ value: '订单信息有误', text: '订单信息有误' },
					{ value: '发货速度不满意', text: '发货速度不满意' },
					{ value: '其它', text: '其它' }
				],
			}
		},
		onLoad(option) {
			const { arr } = option
			if(arr){
				this.infoData = JSON.parse(arr)
			}
			this.getMon()
		},
		
		
		methods: {
			getMon(){
				afterAmount({ orderNo:this.infoData.orderNo }).then((res) => {
					if(res.code == 200){
						this.$set(this.param,'afterAmount',res.data)
					}
				});
			},
			
			saveAddr(){
				if(!this.param.afterReason){
				    uni.showToast({ title: `请选择退款原因`, icon: 'none' });
				    return; 
				}
				this.param.orderNo = this.infoData.orderNo;
				
				afterOrder(this.param).then((res) => {
					if(res.code == 200){
						uni.showToast({title: '提交成功', icon:'success'});
						setTimeout(() => {
							uni.navigateBack()
						}, 1000);
					}
				});
				
			},
			
			//打电话
			PhoneCall(phone){
				uni.makePhoneCall({
					phoneNumber: phone 
				});
			},
		
		}
	}
</script>

<style lang="scss" scoped>
	@import 'afterSales.scss';
</style>
