<template>
	<view class="allBg">
		<view class="asBox">
			<view class="ordre-item" v-for="(i,ind) in JSON.parse(infoData.goodsInfo)" :key="ind">
				<image :src="i.goodsPic" class="main-lt"></image>
				<view class="item-mid">
					<p class="mid-p overflow1">{{i.goodsName}}</p>
					<p>规格：默认</p>
					<p>x{{i.goodsNum}}</p>
				</view>
				<view class="main-rt">￥{{i.goodsNowPrice}}</view>
			</view>
			
			<view class="as-price">
				<p class="as-p">商品总价: <span>￥{{infoData.goodsTotalAmount}}</span></p>
				<p class="as-p">
					合计: ￥{{infoData.payAmount}}
					<span class="p-span" v-if="infoData.freightAmount">(含运费￥{{infoData.freightAmount}})</span>
				</p>
			</view>
		</view>
		
		<view class="asdBox">
			<view class="asd-item">订单号：{{infoData.orderNo}}</view>
			<view class="asd-item">退款原因：{{infoData.afterReason}}</view>
			<view class="asd-item">退款金额：<span class="asd-red">￥{{infoData.afterAmount}}</span></view>
			<view class="asd-item">退款备注：{{infoData.afterRemark}}</view>
			<view class="asd-item">{{infoData.status==14?'商家':'商家拒绝理由：'}}{{infoData.afterRefuseReason}}</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				infoData:{},
			}
		},
		onLoad(option) {
			const { arr } = option
			if(arr){
				this.infoData = JSON.parse(arr)
			}
			console.log(this.infoData)
		},
		
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	@import 'afterSalesDetails.scss';
</style>
