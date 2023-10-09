<template>
	<view class="allBg">
		<view class="rod-mume">
			<view v-for="i in mumeArr" :key="i.id" :class="['mume-item',{'mume-item-act':i.id==type}]" @click="mumeClick(i.id)">
				<span>{{i.name}}</span>
			</view>
		</view>
		
		<view class="acm-main">
			<view class="main-item" v-for="(item,index) in list" :key="index">
				<view class="item-p">券面额: {{item.amount}}元</view>
				<view class="item-p">使用条件: 满{{item.conditionAmount}}元可用</view>
				<view class="item-p">使用条件: 满{{item.conditionAmount}}元可用</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import { AcouponList } from '@/api/page/manage.js'
	export default {
		data() {
			return {
				type:1,
				mumeArr:[
					{name:'新人券', id:1 },
					{name:'满减券', id:2 },
				],
				list:[]
			}
		},
		onLoad(option) {
			this.initData()
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import 'aCouponMan.scss'
</style>
