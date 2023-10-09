<template>
	<view class="allBg">
		<view class="adBox">
			<view class="ad-ban">
				<view class="ban-item" v-for="i in menuArr" :key="i.id" @click="menuClick(i.id)">
					<image :src="i.img" class="item-img"></image>
					<p class="item-p">{{i.name}}</p>
				</view>
			</view>
			
			<view class="adWhite">
				<view class="title">经营状况</view>
				<view class="timeTab">
					<view v-for="item in timeArr" :key="item.id" :class="['tab',{'tab-act':current == item.id}]" @click="onClickItem(item.id)">
						{{item.name}}
					</view>
				</view>
				<view class="numBox">
					<view class="b-item"><p class="b-n">{{infoData.orderNum||0}}</p>支付订单数</view>
					<view class="b-item"><p class="b-n">{{infoData.payAmount||0}}</p>支付金额(元)</view>
					<view class="b-item"><p class="b-n">{{infoData.closeOrderNum||0}}</p>退款订单数</view>
					<view class="b-item"><p class="b-n">{{infoData.closeAmount||0}}</p>退款金额(元)</view>
					<view class="b-item"><p class="b-n">{{infoData.regUserNum||0}}</p>新注册用户数</view>
					<view class="b-item"><p class="b-n">{{infoData.visitUvNewNum||0}}</p>访问新用户数</view>
					<view class="b-item"><p class="b-n">{{infoData.visitUvNum||0}}</p>访问人数</view>
					<view class="b-item"><p class="b-n">{{infoData.visitPvNum||0}}</p>总访问量</view>
				</view>
			</view>
		</view>
			
			
		<Pgtab :tabid="1"></Pgtab>
	</view>
</template>

<script>
	import Pgtab from "../components/pgtab/pgtab.vue"
	import { operateReport } from '@/api/page/manage.js'
	export default {
		components: {
			Pgtab
		},
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mid: uni.getStorageSync('mid'),
				menuArr: [
					{name:"提现审核", id:1,	img:this.$BASE_URLS.FILE_BASE_URL+"/438c369d-80a9-41ce-a2d8-6b43b04780eb.png"},
					{name:"评论管理", id:2,	img:this.$BASE_URLS.FILE_BASE_URL+"/14862a4b-1145-4f76-8265-d9492207f9a8.png"},
					{name:"用户管理", id: 3,	img:this.$BASE_URLS.FILE_BASE_URL+"/cc6c1f69-e610-42de-b359-25cad1b889a4.png"},
					{name:"优惠券管理", id:4,  img:this.$BASE_URLS.FILE_BASE_URL+"/233bda21-5ade-4c7a-ad7c-11c88dbb695d.png"},
				],
				timeArr: [
					{name:'今日', id:1},
					{name:'昨天', id:2},
					{name:'7日', id:3},
					{name:'30日', id:4},
				],
				current: 1,
				infoData:{}
			}
		},
		onReady() {
			this.initData()
		},
		methods: {
			initData(){
				operateReport({ type:this.current }).then((res) => {
					if(res.code == 200){
						this.infoData = res.data;
					}
				});
			},
			
			menuClick(id){
				let url=''
				switch(id) {
					case 1:
						url='/packageA/tiXian/tiXian'
						break;
					case 2:
						url='/packageA/aPingLun/aPingLun'
						break;
					case 3:
						url='/packageA/userMan/userMan'
						break;
				} 
				
				uni.navigateTo({
				    url
				});
			},
			
			onClickItem(cur) {
			  if (this.current != cur) {
				this.current = cur;
				this.initData()
			  }
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'aIndex.scss'
</style>
