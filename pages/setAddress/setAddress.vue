<template>
	<view class="allBg">
		<view class="sadBox">
			<view class="sad-main">
				<view class="m-item">
					<view class="item-lt">收货人</view>
					<view class="item-rt"><input type="text" v-model.trim="name" class="rt-input" placeholder="请输入姓名" maxlength="8"/></view>
				</view>
				<view class="m-item">
					<view class="item-lt">联系电话</view>
					<view class="item-rt"><input type="number" v-model.trim="phone" class="rt-input" placeholder="请输入手机号" maxlength="11"/></view>
				</view>
				<view class="m-item">
					<view class="item-lt">定位地址</view>
					<view class="item-rt" @click="goMap">
						<view :class="['rt-dz','overflow2',{'rt-gray':!addr}]">{{addr?addr:'点击此处进行定位'}}</view>
						<uni-icons type="right" size="30rpx" color="#E5E5E5"></uni-icons>
					</view>
				</view>
				<view class="m-item">
					<view class="item-lt">门牌号</view>
					<view class="item-rt"><input type="number" v-model.trim="houseNum" class="rt-input" placeholder="请输入具体门牌号以便配送" /></view>
				</view>
			</view>
			<view class="sad-btn">保存地址</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		components: {
			
		},
		data() {
			return {
				name:'',
				phone:'',
				addr:'',
				houseNum:'',
			}
		},
		onReady() {
		
		},
		methods: {
			goMap(){
				uni.navigateTo({
				   url: '/pages/map/map',
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import 'setAddress.scss'
</style>
