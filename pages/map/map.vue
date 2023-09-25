<template>
	<view class="">
		<view class="ditu">
			<map style="width:100%;height:100%;" :latitude="latitude" :longitude="longitude" :scale="scale"
				enable-poi @markertap="toMap()">
			</map>
		</view>
	</view>
</template>

<script>
	import QQMapWX from "@/common/qqmap-wx-jssdk.min.js";
	export default {
		data() {
			return {
				latitude: 39.542, //纬度
				longitude: 116.2529, //经度
				scale: 14, //地图缩放程度
			}
		},
		onLoad() {
			this.Mixin_GetLocation() //获取当前定位
		},
		methods: {
			// 获取定位信息
			 Mixin_GetLocation(){
					const that = this
					return new Promise((resolve, reject) => {
						this.JudgeAuthorize(() => {
							uni.getLocation({
								type: 'gcj02',
								geocode: true,
								success(response) {
									console.log(response)
									
									let location = {
										longitude: response.longitude,
										latitude: response.latitude,
										province: "",
										city: "",
										area: "",
										street: "",
										address: "",
									};
									
									const qqmapsdk = new QQMapWX({
										key: 'PBZBZ-74CE3-7ND3P-3OVWM-HDZIT-QRF23'  //别人的key
										// key: 'LUDBZ-VKU3G-D4KQ6-QDLJQ-RMTDH-RRFYI'  //自己的key
									});
									console.log(qqmapsdk)
									qqmapsdk.reverseGeocoder({
										location,
										get_poi:1,
										poi_options:'policy=2;radius=3000;page_size=20;page_index=1',
									  success: function(res) {
											// that.setData({
											// 		 addressList: res.result.pois
											// })
											console.log(res)
											let info = res.result;
											location.province = info.address_component.province;
											location.city = info.address_component.city;
											location.area = info.address_component.district;
											location.street = info.address_component.street;
											location.address = info.address;
											console.log('location',location);
									  },
									});
								},
								fail() {
									reject()
								}
							})
					 })
				 })
			 },
			
			// 判断小程序和 APP 有没有定位权限
			async JudgeAuthorize(callback){
					const that = this
					uni.authorize({
						scope:'scope.userLocation',
						success(scope){
							if(scope.errMsg==="authorize:ok") {
								callback && callback()
							}
						},
						fail(error) {
							console.log("微信小程序获取位置信息失败:",error)
							uni.showModal({
								title:"提示",
								content:"为保证功能正常使用，请开启定位权限",
								confirmText:"去开启",
								confirmColor:'#426BEB',
								success: function(res) {
									if (res.confirm) {
										uni.openSetting({
											success(res) {
												console.log('授权成功'); 
												that.JudgeAuthorize(callback)
											}
										});
									} else if (res.cancel) {
										console.log('用户不授权');
									}
								}
							});
							
						}
					})
			},		
			
			onMarkerTap() {// 点击定位标记时，弹出定位信息
				uni.showToast({ title: this.locationStr });
			},
			
			onMarkerTouchMove(e) {
				// 拖拽标记时，记录下最新的位置信息，并更新数据
				const location = e.currentTarget.dataset;
				this.location = {
					longitude: location.longitude,
					latitude: location.latitude,
				};
				this.updateLocationStr();
			},
			onUpdated() {
				// 初始化地图时获取当前定位信息，并更新数据
				uni.createMapContext(this.mapId).getLocation({
					type: 'gcj02',
					success: (res) => {
						this.location = {
							longitude: res.longitude,
							latitude: res.latitude,
						};
						this.updateLocationStr();
					},
				});
			},
			updateLocationStr() {
				// 将位置信息对象转化为字符串描述
				const { longitude, latitude } = this.location;
				this.locationStr = `当前位置: (${longitude.toFixed(2)}, ${latitude.toFixed(2)})`;
			},		
					
			
		},
	
	}
</script>
<style scoped>
	.ditu {
		width: 100vw;
		height: 565rpx;
	}
</style>
