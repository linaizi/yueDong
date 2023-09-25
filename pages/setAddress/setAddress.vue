<template>
	<view class="allBg">
		<view class="sadBox">
			<view class="sad-main">
				<view class="m-item">
					<view class="item-lt">收货人</view>
					<view class="item-rt"><input type="text" v-model.trim="param.name" class="rt-input" placeholder="请输入姓名" maxlength="8"/></view>
				</view>
				<view class="m-item">
					<view class="item-lt">联系电话</view>
					<view class="item-rt"><input type="number" v-model.trim="param.phone" class="rt-input" placeholder="请输入手机号" maxlength="11"/></view>
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
			<view class="sad-btn" @click="saveAddr">保存地址</view>
		</view>
	</view>
</template>

<script>
	const chooseLocation = requirePlugin('chooseLocation');
	import { addressAdd } from '@/api/page/index.js'
	export default {
		data() {
			return {
				param:{
					type:1,
				},
				addr:'',
				houseNum:'',
			}
		},
		
		onShow () {
			const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
			console.log(location)
			if(location){
				this.addr = location.address;
				this.param.province = location.province;
				this.param.city = location.city;
				this.param.e = location.longitude;
				this.param.n = location.latitude;				
			}
		},
		
		methods: {
			goMap(){
				const key = 'LUDBZ-VKU3G-D4KQ6-QDLJQ-RMTDH-RRFYI'; //使用在腾讯位置服务申请的key
				const referer = '紫荆洗鞋'; //调用插件的app的名称
				
				uni.navigateTo({
					url: `plugin://chooseLocation/index?key=${key}&referer=${referer}`
				});		
			},
			
			saveAddr(){
				if(!this.param.name){
					uni.showToast({title: '姓名不能为空', icon:'none'});
					return;
				}
				if(!this.param.name){
					uni.showToast({title: '姓名不能为空', icon:'none'});
					return;
				}
				this.param.address = this.addr + this.houseNum;
				addressAdd(this.param).then((res) => {
					if(res.code == 200){
						uni.showToast({title: '添加成功', icon:'success'});
						setTimeout(() => {
							uni.navigateBack()
						}, 1000);
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'setAddress.scss'
</style>
