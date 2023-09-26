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
						<view :class="['rt-dz','overflow2',{'rt-gray':!param.address}]">{{param.address?param.address:'点击此处进行定位'}}</view>
						<uni-icons type="right" size="30rpx" color="#E5E5E5"></uni-icons>
					</view>
				</view>
				<view class="m-item">
					<view class="item-lt">门牌号</view>
					<view class="item-rt"><input type="number" v-model.trim="param.houseNumber" class="rt-input" placeholder="请输入具体门牌号以便配送" /></view>
				</view>
			</view>
			<view class="sad-btn" @click="saveAddr">保存地址</view>
		</view>
	</view>
</template>

<script>
	const chooseLocation = requirePlugin('chooseLocation');
	import { addressAdd,addressEdit } from '@/api/page/index.js'
	export default {
		data() {
			return {
				param:{
					type:1,
					address:'',
					houseNumber:''
				},
				
			}
		},
		onLoad(option) {
			const { item } = option
			if(item){
				let arr = JSON.parse(item);
				this.param = { type:1, ...arr }
			}
		},
		onShow () {
			const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
			console.log(location)
			if(location){
				this.param.address = location.address;
				this.param.province = location.province;
				this.param.city = location.city;
				this.param.district = location.district;
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
				// 创建一个字段和字段名称的映射
				const fields = [
				  { key: 'name', name: '姓名' },
				  { key: 'phone', name: '手机' },
				  { key: 'address', name: '定位地址' },
				  { key: 'houseNumber', name: '门牌号' },
				];
				// 遍历字段并验证它们
				for (const field of fields) {
				  if (!this.param[field.key]) {
				    uni.showToast({ title: `${field.name}不能为空`, icon: 'none' });
				    return; // 如果有任何字段验证失败，直接返回
				  }
				}
				
				if(this.param.id){
					addressEdit(this.param).then((res) => {
						if(res.code == 200){
							uni.showToast({title: '修改成功', icon:'success'});
							setTimeout(() => {
								uni.navigateBack()
							}, 1000);
						}
					});
				}else{
					addressAdd(this.param).then((res) => {
						if(res.code == 200){
							uni.showToast({title: '添加成功', icon:'success'});
							setTimeout(() => {
								uni.navigateBack()
							}, 1000);
						}
					});
				}
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'setAddress.scss'
</style>
