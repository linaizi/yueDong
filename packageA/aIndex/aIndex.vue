<template>
	<view class="allBg">
			<view class="adBox">
					<view class="ad-ban">
						<view class="ban-item" v-for="(i,index) in menuArr" :key="index">
							<image :src="i.img" class="item-img"></image>
							<p class="item-p">{{i.name}}</p>
						</view>
					</view>
					
					<view class="adWhite">
						<view class="title">经营状况</view>
						<view class="timeTab">
							<view v-for="(item,ind) in timeArr" :key="ind" :class="['tab',{'tab-act':current == ind}]">
								{{item.name}}
							</view>
						</view>
						<view class="numBox">
							<view class="b-item"><p class="b-n">8</p>支付订单数</view>
							<view class="b-item"><p class="b-n">148.9</p>支付订单数</view>
							<view class="b-item"><p class="b-n">8</p>支付订单数</view>
							<view class="b-item"><p class="b-n">8</p>支付订单数</view>
						</view>
					</view>
			</view>
			
			
			<Pgtab :tabid="1"></Pgtab>
	</view>
</template>

<script>
	import Pgtab from "@/components/pgtab/pgtab.vue"
	export default {
		components: {
			Pgtab
		},
		data() {
			return {
				menuArr: [
					{name:"提现审核", img:"../../static/img/menu1.png"},
					{name:"评论管理", img:"../../static/img/menu2.png"},
					{name:"用户管理", img:"../../static/img/menu3.png"},
					{name:"优惠券管理", img:"../../static/img/menu4.png"},
				],
				timeArr: [
					{name:'今日', id:1},
					{name:'昨天', id:2},
					{name:'7日', id:3},
					{name:'30日', id:4},
				],
				current: 0
			}
		},
		onReady() {
		
		},
		methods: {
			onClickItem(e) {
			  if (this.current != e.currentIndex) {
				this.current = e.currentIndex;
			  }
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'aIndex.scss'
</style>
