<template>
	<view class="allBg">
		<view class="stl-btn" @click="goMap">手动定位</view>
		<p class="stl-p" v-if="addr">{{addr}}</p>
		
		<view class="mt20">
			<!-- 数据为空显示状态 -->
			<div class="searchNo" v-if="list.length == 0">
				<img src="https://file.aikbao.com/2022042214201361829?/width/348/height/234/2022042214201361829?/width/348/height/234" alt="" />
				<p>附近暂无门店~</p>
			</div>
			
			<template v-else>
				<view class="stl-item" v-for="item in list" :key="item.id" >
					<image :src="item.pic" mode="" class="item-img"></image>
					<view class="item-mid">
						<p class="mid-t">{{item.shopName}}</p>
						<p class="mid-p">电话: {{item.phone}}</p>
						<p class="mid-p">距离: {{item.distance}}km</p>
					</view>
					<view class="item-rt" @click="daoHang(item)">
						<uni-icons type="paperplane" size="56rpx" color="#4B97FE"></uni-icons>
						<p class="rt-p">一键导航</p>
					</view>
				</view>
			</template>
						
		</view>
		
	</view>
</template>

<script>
	const chooseLocation = requirePlugin('chooseLocation');
	import { pointList } from '@/api/page/index.js'
	export default {
		data() {
			return {
				isAddr:false,
				lotn:{},
				addr:'',
				list:[],
			}
		},
		onLoad(option) {
				this.getLocation()
		},
		onShow () {
			const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
			if(location){
				this.addr = location.address;
				this.lotn = {
					n: location.latitude,
					e: location.longitude
				}
				this.getList()
				// {
					// address: "广东省深圳市宝安区上星路西星悦豪庭一期对面"
					// city: "深圳市"
					// district: "宝安区"
					// latitude: 22.726897
					// longitude: 113.83283
					// name: "星际大厦"
					// province: "广东省"
				// }
			}
		
		},
		
		methods: {
			goMap(){
				const key = 'LUDBZ-VKU3G-D4KQ6-QDLJQ-RMTDH-RRFYI'; //使用在腾讯位置服务申请的key
				const referer = '紫荆洗鞋'; //调用插件的app的名称
				const location = JSON.stringify({
				  latitude: this.lotn.n,
				  longitude: this.lotn.e
				});
				// const category = '生活服务:生活服务场所';
				
				uni.navigateTo({
					url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}`
				});		
			},
			
			//获取当前位置
			getLocation(){
				var _that = this;
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success(response) {
						console.log(response)
						_that.lotn = {
							n: response.latitude,
							e: response.longitude
						}
						_that.getList()
					},
					fail() {
						
					}
				})
			},
			
			//获取附近代收点列表
			getList(){
				pointList(this.lotn).then((res) => {
					if(res.code == 200){
						this.list = res.data
					}
				});
			},
			
			daoHang(i){
				uni.openLocation({
					longitude: i.n,// 经度，范围为-180~180，负数表示西经
					latitude: i.e,// 纬度，范围为-90~90，负数表示南纬
					scale: 28, // 缩放比例
					name: i.shopName,//终点名称
					address: i.address,//终点详细地址
					success: function (res) {
						console.log('success:',res);
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'storeList.scss'
</style>
