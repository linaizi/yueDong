<template>
	<view class="allBg">
		<view class="stl-btn" @click="authVerification">手动定位</view>
		<p class="stl-p" v-if="addr">{{addr}}</p>
		
		<view class="mt20">
			<!-- 数据为空显示状态 -->
			<view class="noGood" v-if='list.length==0'>
				<image :src="FILE_BASE_URL + '/3ee934e5-e364-4dad-9417-88a4776bfd87.png'" mode="widthFix" class="noGood-img"></image>
				<p>附近暂无门店~</p>
			</view>
			
			<template v-else>
				<view class="stl-item" v-for="item in list" :key="item.id" >
					<image :src="item.pic" mode="" class="item-img" @click="retData(item)"></image>
					<view class="item-mid" @click="retData(item)">
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
	import { pointList } from '@/api/page/index.js'
	import { authVerification } from '@/common/tool.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				isAddr:false,
				lotn:{},
				addr:'',
				list:[],
				source:null,
			}
		},
		onLoad(option) {
			console.log(option)
			if(option.source){
				this.source = option.source;
			}
			if(option.e){
				this.lotn = {
					e: option.e,
					n: option.n
				}
				this.getList()
			}else{
				this.getLocation()
			}
			
		},
		onShow () {
			uni.getStorage({
				key: 'currentLocation',
				success: (res) => {
				  console.log(res.data)
				  if(res.data.errMsg == "chooseLocation:ok"){
					   this.addr = res.data.address;
					   this.lotn = {
					   	n: res.data.latitude,
					   	e: res.data.longitude
					   }
					   this.getList()
					   setTimeout(()=>{
						   uni.removeStorageSync('currentLocation')
					   },1000)
				  }
				},
			})
			
		},
		
		methods: {
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
			authVerification,
			
			//获取附近代收点列表
			getList(){
				pointList(this.lotn).then((res) => {
					if(res.code == 200){
						this.list = res.data
					}
				});
			},
			
			//把当前站点数据返回给buy.vue页面
			retData(obj){
				if(this.source==1) {
					uni.$emit('isSto', JSON.stringify(obj))
					uni.navigateBack({
						delta: 1
					})
				}
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
