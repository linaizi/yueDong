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
					<view class="item-rt" @click="authVerification">
						<view :class="['rt-dz','overflow2',{'rt-gray':!param.address}]">{{param.address?param.address:'点击此处进行定位'}}</view>
						<uni-icons type="right" size="30rpx" color="#E5E5E5"></uni-icons>
					</view>
				</view>
				<view class="m-item">
					<view class="item-lt">门牌号</view>
					<view class="item-rt"><input v-model.trim="param.houseNumber" class="rt-input" placeholder="请输入具体门牌号以便配送" /></view>
				</view>
			</view>
			<view class="sad-btn" @click="saveAddr">保存地址</view>
		</view>
	</view>
</template>

<script>
	// import QQMapWX from "@/common/qqmap-wx-jssdk.min.js";
	import { addressAdd,addressEdit } from '@/api/page/index.js'
	import { authVerification, mapsdk } from '@/common/tool.js'

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
			// let location = {
			//    e : 113.88308,
			//    n : 22.55329
			// }
			// this.aaa()
			// this.mapsdk(location)
			// return;
			uni.getStorage({
				key: 'currentLocation',
				success: (res) => {
				  console.log(11,res.data)
				  if(res.data.errMsg == "chooseLocation:ok"){
					   this.param.address = res.data.address;
					   this.param.e =  res.data.longitude;
					   this.param.n =  res.data.latitude;
					   // let location = {
						  //  e : res.data.longitude,
						  //  n : res.data.latitude
					   // }
					   // let a = this.mapsdk(location)
					   // console.log(a)
					   setTimeout(()=>{
							uni.removeStorageSync('currentLocation')
					   },1000)
				  }
				  // {
				  // 	address: "广东省深圳市宝安区创业一路"
				  // 	errMsg: "chooseLocation:ok"
				  // 	latitude: 22.55329
				  // 	longitude: 113.88308
				  // 	name: "宝安区创业一路(深圳市宝安区人民政府)"
				  // }
				}
			})
			
		},
		
		methods: {
			authVerification,
			mapsdk,
			
			// aaa (location){
			// 	const qqmapsdk = new QQMapWX({
			// 		// key: 'PBZBZ-74CE3-7ND3P-3OVWM-HDZIT-QRF23'  //别人的key
			// 		key: 'LUDBZ-VKU3G-D4KQ6-QDLJQ-RMTDH-RRFYI'  //自己的key
			// 	});
			// 	qqmapsdk.reverseGeocoder({
			// 		location,
			// 		get_poi:1,
			// 		poi_options:'policy=2;radius=3000;page_size=20;page_index=1',
			// 		success: function(res) {
			// 			console.log(res)
			// 		},
			// 	});
			// },
			
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
