<template>
	<view class="allBg">
		<view class="maddrBox">
			<div class="searchNo" v-if="list.length == 0">
				<img src="https://file.aikbao.com/20230525172214852" alt="" />
				<p>附近数据~</p>
			</div>
			
			<template v-else>
				<view class="maddr-item" v-for="(i,ind) in 1" :key="ind">
					<view class="top">
						<view class="top-l">收货人：林</view>
						<view class="top-r">13411112222</view>
					</view>
					<view class="mid">收货地址: 广东省广州市天河区五山路483号华南农业大学 201</view>
					<view class="foot">
						<view :class="['foot-l',{'foot-l-red':isSet}]" @click="setMr">
							<view class="circle mr10"><image src="../../static/img/maddr1.png" mode="widthFix" v-if="isSet" class="w100"></image></view>
							{{isSet?"已设为默认":"设为默认"}}
						</view>
						<view class="foot-r">
							<view class="r-item"><uni-icons type="compose" size="40rpx" color="#999"></uni-icons>编辑</view>
							<view class="r-item"><uni-icons type="trash" size="40rpx" color="#999"></uni-icons>删除</view>
						</view>
					</view>
				</view>
			</template>
			
			<view class="maddr-foot">
				<view class="maddr-btn" @click="goSetaddr"><uni-icons type="plus-filled" size="44rpx" color="#fff"></uni-icons><view class="btn-txt">手动添加</view></view>
			</view>
		
		</view>
	</view>
</template>

<script>
	import { addressList } from '@/api/page/index.js'
	export default {
		data() {
			return {
				isSet:false,
				list:[]
			}
		},
		onShow() {
			this.getAddr()	
		},
		methods: {
			getAddr(){
				addressList({ addressType:1 }).then((res) => {
					if(res.code == 200){
						this.list = res.data
					}
				});
			},
			
			setMr(){
				this.isSet = !this.isSet;
			},
			goSetaddr(){
				uni.navigateTo({
				   url: '/pages/setAddress/setAddress',
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'myAddress.scss'
</style>
