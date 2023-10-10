<template>
	<view class="allBg">
		<view class="rod-mume">
			<view v-for="i in mumeArr" :key="i.id" :class="['mume-item',{'mume-item-act':i.id==type}]" @click="mumeClick(i.id)">
				<span>{{i.name}}</span>
			</view>
		</view>
		
		<view class="acm-main">
			<view class="main-item" v-for="(item,index) in list" :key="index">
				<view class="item-lt">
					<view class="lt-top"><p class="top-mon">券面额:￥<span class="mon-b">{{item.amount}}</span> </p><p class="top-p">(满{{item.conditionAmount}}元可用)</p></view>
					<view class="md-p">优惠券领取时间：</view>
					<view class="md-p1">{{item.possessStartTime}} - {{item.possessEndTime}}</view>
					<view class="md-p">优惠券使用时间</view>
					<view class="md-p1">{{item.useStartTime}} - {{item.useEndTime}}</view>
				
				</view>
				<view class="item-rt" @click="delClick(item.id,index)">
					<uni-icons type="trash" size="36rpx" color="#fff"></uni-icons><p>删除</p>
				</view>
			</view>
		</view>
		
		<view class="acm-btn">
			<view class="btn" @click="toAddCou">新增优惠券</view>
		</view>
		
		
	</view>
</template>

<script>
	import { AcouponList,AcouponDel } from '@/api/page/manage.js'
	export default {
		data() {
			return {
				type:2,
				mumeArr:[
					{name:'满减券', id:2 },
					{name:'新人券', id:1 },
					
				],
				list:[]
			}
		},
		onLoad(option) {
			this.initData()
		},
		onShow() {
			var _that = this;
			uni.$once('addCou',function(data){
				_that.initData()
			})
		},
		methods: {
			mumeClick(n){
				if(n==this.type) return;
				this.type = n;
				this.initData();
			},
			
			initData(){
				AcouponList({ type: this.type }).then((res) => {
					if(res.code == 200){
						this.list = res.data;
					}
				})
			},
			
			delClick(id,index){
				uni.showModal({
					title:"温馨提示",
					content:"确定删除当前优惠券?",
					confirmText:"确定",
					success: (res)=> {
						if (res.confirm) {
							AcouponDel({ id }).then((res) => {
								if(res.code == 200){
									uni.showToast({ title: `删除成功`,icon:'success' });
									this.list.splice(index, 1);
								}
							})
						} else if (res.cancel) {}
					}
				});
				
			},
			
			toAddCou(){
				uni.navigateTo({
				    url: '/packageA/addCoupon/addCoupon' 
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'aCouponMan.scss'
</style>
