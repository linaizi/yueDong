<template>
	<view class="allBg">
		<view class="topBox">
			<view class="tab-t">
				<!-- <view :class="['t-item','t-item1']" @click="tabClick(2)">
					<image :src="FILE_BASE_URL + '/2dcf36c4-bdad-4c47-851b-c545b2c17684.png'" v-if="tabNum==2" class="t-img1"></image>
					到店服务
				</view> -->
				<view :class="['t-item','t-item1']" @click="tabClick(1)">
					<image :src="FILE_BASE_URL + '/05564c5d-5f46-4901-91ae-bb664f4ba272.png'" v-if="tabNum==1" class="t-img1"></image>
					上门取送
				</view>
				
				<!-- <view :class="['t-item',{'t-item-lt':tabNum==2}]" @click="tabClick(2)"><image :src="FILE_BASE_URL + '/2dcf36c4-bdad-4c47-851b-c545b2c17684.png'" v-if="tabNum==2" class="t-img1"></image>到店服务</view>
				<view :class="['t-item',{'t-item-rt':tabNum==1}]" @click="tabClick(1)"><image :src="FILE_BASE_URL + '/05564c5d-5f46-4901-91ae-bb664f4ba272.png'" v-if="tabNum==1" class="t-img2"></image>上门取送</view>
			 -->
			</view>
			<view class="tab-form" v-if="tabNum==2">
				<uni-forms :model="formData" border class="aa">
					<uni-forms-item label="姓名" name="name">
						<input type="text" v-model="formData.name" placeholder="请输入姓名" maxlength="10" class="tab-ipt" />
					</uni-forms-item>
					<uni-forms-item label="电话" name="phone">
						<input type="number" v-model="formData.phone" placeholder="请输入电话" maxlength="11" class="tab-ipt"/>
					</uni-forms-item>
				</uni-forms>
			</view>
			<view class="tab-form" v-else>
				<view class="form-adr" v-if="hasAddr">
					<view class="adr-lt" @click="goMyaddr">
						<view class="lt-t">{{userAddr.name||''}} <span>{{userAddr.phone||''}}</span><p v-if="false">配送范围内</p></view>
						<view class="lt-b overflow2">{{userAddr.address||''}} {{userAddr.houseNumber||''}}</view>
					</view>
					<uni-icons type="forward" size="40rpx" color="#666" style="margin-top: -38upx;"></uni-icons>
				</view>
				<view class="form-noadr" v-else @click="goMyaddr">
					<span>+</span>请添加同城配送地址
				</view>
			</view>
		</view>
		
		<!-- 商品信息 -->
		<view class="buyBox">
			<view class="title">跃动球鞋洗护</view>
			
			<view class="dsd-adr" v-if="addrList.length>0" @click="goDSD(1)">
				<view class="adr-t">
					<view class="t-l">
						<uni-icons type="paperplane" size="36rpx" color="#999"></uni-icons>
						{{addrList[0].shopName}}
						<uni-icons type="right" size="32rpx" color="#999"></uni-icons>
					</view>
					<view class="t-r"><uni-icons type="location" size="36rpx" color="#CDCDCD"></uni-icons>距您{{addrList[0].distance}}km</view>
				</view>
				<view class="adr-b">{{addrList[0].address}} {{addrList[0].houseNumber || ''}}</view>
			</view>
			<view class="dsdBox-no" v-else>当前位置附近暂无代收点 <p v-if="tabNum==2" @click="goDSD(0)">选择代收点</p></view>
		
			<view class="buy-time" @click="setTimeClick" v-if="tabNum==1">
				<p class="time-lt">预约上门取鞋时间</p>
				<view class="time-red">{{yyTime}}<uni-icons type="right" size="32rpx" color="#999"></uni-icons></view>
			</view>
			<!-- <view class="dsdBox-no" >请添加联系人 <p>添加配送地址</p></view> -->
			
			<view class="ordre-item buy-item" v-for="it in goodsData" :key="it.id">
				<image :src="it.goodsPic" class="main-lt"></image>
				<view class="item-mid">
					<p class="mid-p overflow1">{{it.goodsName}}</p>
					<p>规格：默认</p>
					<p>x{{it.goodsNum}}</p>
				</view>
				<view class="main-rt">￥{{it.goodsNowPrice}}</view>
			</view>
			
			<view class="buy-time" @click="yhqClick">
				<p class="time-lt"><span>惠</span>优惠券</p>
				<view class="time-rt">
					<template v-if="couCheck==-1">
						<span class="rt-red" v-if="availableNum>0">{{availableNum}}张可用</span>
						<span class="time-gray" v-else>暂无可用优惠券</span>
					</template>
					<template v-else>
						<view class="time-red">-￥{{zero(couMon)}}</view>
					</template>
					
					<uni-icons type="right" size="32rpx" color="#999"></uni-icons>
				</view>
			</view>
			
			<view class="buy-time" v-if="tabNum==1">
				<p class="time-lt">运费</p>
				<view class="time-red">￥{{FtAmount}}</view>
			</view>
			
			<view class="buy-all"> <p class="all-g">共1件</p> <p>共计：</p> <p class="all-r">￥{{totalMoney}}</p> </view>
		</view>
		
		<!-- 表单 -->
		<view class="buyBox">
			<view class="title">操作</view>
			<view class="formbBd">
				<p>备注：</p>
				<input type="text" placeholder="请输入备注" v-model="remark"  class="bd-ipt" />
			</view>
			<view class="formbBd">
				<p><span>*</span>图片上传：</p>
				<view class="formbBd-img">
					<uni-file-picker 
						limit="9" 
						v-model="imageValue" 
						@select="select"  
						@progress="progress" 
						@success="success"
						@fail="fail" 
						@delete="deletea">
					</uni-file-picker>
				</view>
			</view>
		</view>
		
		<view style="height: 130upx;"></view>
		
		<view class="buy-foot">
			<view class="foot-lt">合计:￥<span>{{totalMoney}}</span></view>
			<view class="foot-rt" @click="subOrder">提交订单</view>
		</view>
		
		<hTimeAlert 
			title="预约上门取鞋时间" 
			:isShow="timeShow" 
			rangeDay="5" 
			rangeStartTime="9:00:00"
			rangeEndTime="19:00:00"
			:rangeType="true"
			:intervalTime="300"
			@closeAlert="handelClose">
		</hTimeAlert>
		
		<!-- 优惠券弹窗 -->
		<uni-popup ref="yhqPopup" type="bottom" background-color="#fff">
			<view class="yhq-pp">
				<view class="yhq-title"><span class="b">优惠券</span><uni-icons type="closeempty" size="52rpx" color="#666" @click="closeYhq"></uni-icons></view>
				<view class="yhq-tab">
					<view :class="['tab-item',{'tab-item-act':couponParam.type==1}]" @click="tabCoupon(1)">可用优惠券({{availableNum}})</view>
					<view :class="['tab-item',{'tab-item-act':couponParam.type==2}]" @click="tabCoupon(2)">不可用优惠券({{notAvailableNum}})</view>
				</view>
				<view class="yhq-maim">
					<view class="yhq-item" v-for="(cu,ind) in couList" :key="ind" @click="couClick(cu,ind)">
						<view :class="['item-top',{'item-top-no':couponParam.type==2}]">
							<view class="top-l"><span>￥</span>{{zero(cu.couponDto.amount)}}</view>
							<view class="top-m"><p>{{cu.couponDto.type == 1 ? '新人专享' : '满减福利'}}{{cu.couponDto.amount}}元</p><p>满{{cu.couponDto.conditionAmount}}元可用</p></view>
							<view class="top-r" v-if="couponParam.type==1">
								<view :class="['circle',{'circle-red':cu.check}]"></view>
							</view>
						</view>
						<view class="item-foot">
							<p class="foot-p">有效期至：<span class="p-span">{{cu.expireTime.split(' ')[0]}}</span></p>
							<p class="foot-p">适用商品：所有商品</p>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import { debounce } from "@/common/throttle.js";
	import hTimeAlert from "@/components/h-time-alert/h-time-alert.vue";
	import { pointList,addressList,couponListTwo,getFreightAmount,orderAdd } from '@/api/page/index.js'
	export default {
		components: {
			hTimeAlert
		},
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mid: uni.getStorageSync('mid'),
				formData:{},
				goodsData:{},
				lotn:{},	//当前定位
				tabNum:1,
				userAddr:{},	//用户地址
				addrList:[],	//页面显示的代收点
				addrList1:[],	//到店服务获取到的代收点数据
				addrList2:[],	//上门服务获取到的代收点数据
				couponParam:{
					amount:null,
					pageNo:1,
					pageSize:10,
					type:1
				},
				couList:[], //优惠券列表
				couList1:[], //优惠券列表
				couList2:[], //优惠券列表
				couCheck:-1,
				availableNum:0,
				notAvailableNum:0,
				couMon:0,
				couponId:null,
				hasAddr:true,
				yyTime:'请选择时间',
				yyTimeOld:'',
				timeShow:false,
				yhqAct:0,
				FtAmount:0, //运费
							
				remark:'',
				imageValue:[],
				isTJ:false,
			}
		},
		onLoad(option) {
			this.goodsData = JSON.parse(option.goodsData);
			
			const goodsNum = this.goodsData.reduce((acc, item) => {
			  this.couponParam.amount += item.goodsNowPrice * item.goodsNum;
			  return acc + item.goodsNum;
			}, 0);
			this.getAddr();	//获取用户地址
			this.getCoupon(2)	//获取用户不可用优惠券
			this.getCoupon(1)	//获取用户优惠券
			this.getYunFei(goodsNum) //获取商品运费
			
			if(uni.getStorageSync('userAddr')){
				this.formData = JSON.parse(uni.getStorageSync('userAddr'))
			}
		},
		computed: {
			totalMoney() {
				if(Object.keys(this.goodsData).length == 0) return 0;
				let tot = this.goodsData.reduce((total, item) => total + item.goodsNowPrice * item.goodsNum, 0) - this.couMon
				return this.tabNum == 2 ? tot.toFixed(2) : (tot + this.FtAmount).toFixed(2)
			}
		},
		onShow() {
			var _that = this;
			uni.$once('isAddr',function(data){
				_that.userAddr = JSON.parse(data)
				_that.hasAddr = true;
				_that.lotn = {
					n: _that.userAddr.n,
					e: _that.userAddr.e
				}
				_that.isHd = false;
				_that.getList()
			})
			uni.$once('isSto',function(data){
				_that.addrList.unshift(JSON.parse(data))
				console.log("isStodata:",JSON.parse(data))
				console.log(_that.addrList)
			})
		},
		
		methods: {
			subOrder: debounce(function(){		
				if(this.addrList.length == 0){
					uni.showToast({title:"附近暂无代收点,请重新选择地址",icon:'none'})
					return;
				}
				
				if(this.yyTimeOld == ''&&this.tabNum==1){
					uni.showToast({title:"预约上门时间不能为空",icon:'none'})
					return;
				}
				if(this.imageValue.length==0){
					uni.showToast({title:"'图片上传'不能为空",icon:'none'})
					return;
				}
				
				let param = {
					type: this.tabNum,
					goodsTotalAmount: (this.totalMoney-0) + this.couMon,
					goodsInfo: JSON.stringify(this.goodsData),
					couponId: this.couponId,
					freightAmount:0,
					payAmount: this.totalMoney,
					remark: this.remark,
					pics: this.imageValue.map(item => item.url).join(','),
					collectionId: this.addrList[0].cid
				};
				 
				if(this.tabNum == 2){
					if(!this.formData.name){
						uni.showToast({title:"姓名不能为空",icon:'none'})
						return;
					}
					if(!this.formData.phone){
						uni.showToast({title:"手机号不能为空",icon:'none'})
						return;
					}
					param.name = this.formData.name
					param.phone = this.formData.phone
					
					uni.setStorageSync('userAddr',JSON.stringify(this.formData))
				}else{
					param.reservationTime = this.yyTimeOld
					param.freightAmount = this.FtAmount
					if(this.hasAddr){
						param.name = this.userAddr.name
						param.phone = this.userAddr.phone
						param.address = this.userAddr.address
						param.houseNumber = this.userAddr.houseNumber
						param.addressId = this.userAddr.id
						param.province = this.userAddr.province
						param.city = this.userAddr.city
						param.district = this.userAddr.district
						param.e = this.userAddr.e
						param.n = this.userAddr.n
						param.goodsTotalAmount -= this.FtAmount;
					}else{
						uni.showToast({title:"地址不能为空",icon:'none'})
						return;
					}
				}
				
				param.goodsTotalAmount = (param.goodsTotalAmount-0).toFixed(2)
				
				if(this.isTJ) return;
				uni.showLoading({
					title: '加载中'
				});
				this.isTJ = true;
				
				orderAdd(param).then((res) => {
					if(res.code == 200){
						this.wxPay(res.data)
						this.isTJ = false;
					}else{
						this.isTJ = false;
						uni.hideLoading()
					}
				}).catch((err)=>{
					this.isTJ = false;
					uni.hideLoading()
				})
			},1000),
			
			wxPay(data){
				let _that = this;
				uni.requestPayment({
				    provider: 'wxpay',
					timeStamp: data.timeStamp,
					nonceStr: data.nonceStr,
					package: data.packAge,
					signType: data.signType,
					paySign: data.paySign,
					success: function (res) {
						console.log('支付成功:' + JSON.stringify(res));
						uni.redirectTo({
							url: '/pages/buyOk/buyOk?totalMoney=' + _that.totalMoney
						});
					},
					fail: function (err) {
						console.log('支付失败:' + JSON.stringify(err));
						uni.redirectTo({
							url: '/pages/myOrder/myOrder' 
						});
					}
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
						// _that.lotn = {
						// 	n: 22.726897,
						// 	e: 113.83283
						// }
						_that.lotn = {
							n: response.latitude,
							e: response.longitude
						}
						_that.getList()
					},
					fail() {}
				})
			},
			
			getAddr(){
				addressList({ addressType:1 }).then((res) => {
					if(res.code == 200){
						this.userAddr = res.data[0];
						if(res.data.length>0){
							this.hasAddr = true;
							this.lotn = {
								n: this.userAddr.n,
								e: this.userAddr.e
							}
							this.getList()
						}else{
							console.log(1111)
							this.hasAddr = false;
							this.addrList2 = [];
							this.addrList = [];
							this.getLocation() //获取当前位置
						}
					}
				});
			},
			
			// 获取优惠券列表
			getCoupon(i){
				this.couponParam.type = i;
				couponListTwo(this.couponParam).then((res) => {
					if(res.code == 200){
						this.availableNum = res.data.availableNum;
						this.notAvailableNum = res.data.notAvailableNum;
						if(i==1){
							res.data.data.forEach((item) => {
								this.$set(item,'check',false)
							});
							this.couList = res.data.data;
							this.couList1 = res.data.data;
						}else{
							this.couList2 = res.data.data;
						}
					}
				});
			},
			
			//获取附近代收点列表
			getList(){
				console.log('lotn:',this.lotn)
				pointList(this.lotn).then((res) => {
					if(res.code == 200){
						console.log('addrList:',res.data)
						this.addrList = res.data
						if(this.tabNum==2) this.addrList1 = res.data
						else this.addrList2 = res.data
					}
				});
			},
			
			//获取商品运费
			getYunFei(goodsNum){
				getFreightAmount({ goodsNum }).then((res) => {
					if(res.code == 200){
						this.FtAmount = res.data-0;
					}
				});
			},
			
			tabClick(n){
				this.tabNum = n;
				if(n==1){
					if(this.userAddr === undefined || Object.keys(this.userAddr).length === 0){
						this.addrList = []
					}else if(this.addrList2.length>0){
						this.addrList = this.addrList2
					}else{
						this.lotn = {
							n: this.userAddr.n,
							e: this.userAddr.e
						}
						this.getList()
					}
				}else{
					this.addrList = this.addrList1
				}
			},
			
			goMyaddr(){
				uni.navigateTo({
					url: '/pages/myAddress/myAddress?source=1'
				})
			},
				
			//跳转到门店列表页面			
			goDSD(n){
				let str = ''
				if(n==0||(n==1&&this.tabNum == 2)){
					str = '&e=' + this.lotn.e + '&n=' + this.lotn.n
				}else{
					str = '&e=' + this.userAddr.e + '&n=' + this.userAddr.n
				}
				uni.navigateTo({
					url: '/pages/storeList/storeList?source=1'  + str
				});
			},
						
			setTimeClick(){ this.timeShow = true; },
			
			//时间选择 关闭事件
			handelClose(data){  
				this.timeShow = false; 
				if(!data) return;
				console.log(data)
				this.yyTimeOld = data.dateRange;
				
				const [datePart, timePart] = data.dateRange.split(' ');
				const date = new Date(datePart);
				// 获取日期的月、日和星期
				const month = (date.getMonth() + 1).toString(); // 添加 +1 并转换为字符串
				const day = date.getDate().toString()+'日'; // 转换为字符串
				
				let days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
				let weekday = date.getDay();
				const dayOfWeek = days[weekday]; 
			
				const today = new Date();		// 获取今天的日期
				today.setHours(0, 0, 0, 0); // 将时间部分设置为零，只比较日期部分
				
				const tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);  // 获取明天的日期
				tomorrow.setHours(0, 0, 0, 0);
				
				let prefix = '';	// 根据日期比较确定前缀
				if (date.getTime() === today.getTime()) {
				  prefix = '今天';
				} else if (date.getTime() === tomorrow.getTime()) {
				  prefix = '明天';
				}
				if(prefix){
					this.yyTime = `${prefix}(${dayOfWeek}) ${timePart}`;
				}else{
					this.yyTime = `${month}月${day}(${dayOfWeek}) ${timePart}`;
				}
			},
			
			//优惠券
			yhqClick(){
				this.$refs.yhqPopup.open()
			},
			closeYhq(){
				this.$refs.yhqPopup.close()
			},
			//优惠券tab事件
			tabCoupon(n){
				this.couponParam.type = n;
				if(n==1){
					this.couList = this.couList1;
				}else{
					this.couList = this.couList2;
				}
			},
			//选择优惠券事件
			couClick(obj,ind){
				if(this.couponParam.type == 2) return;
				
				this.couList1.forEach((item,n) => {
					if(n==ind){
						item.check = !item.check;
					}else{
						item.check = false;
					}
				});
				
				if(this.couList1[ind].check){
					this.couCheck = ind;
					this.couMon = obj.couponDto.amount-0;
					this.couponId = obj.couponId;
				}else{
					this.couCheck = -1;
					this.couMon = 0.00;
					this.couponId = undefined;
				}
				this.$refs.yhqPopup.close()
			},
			//金额补零
			zero(num){
				return num.toFixed(2);
			},
			
			// 获取上传状态
			select(e){
				e.tempFilePaths.forEach((item)=>{
					const imgUrl = item
					uni.uploadFile({
						url: this.$BASE_URLS.FILE_upload_URL+'/elantra/img/file-upload', 
						filePath: imgUrl,
						name: 'file',
						header:{"Content-Type": "multipart/form-data"},
						success: (res) => {
							this.imageValue.push({
								url:JSON.parse(res.data).data,
							})
						}
					});
				})	
			},
			// 图片删除
			deletea(e){
				const num = this.imageValue.findIndex(v => v.url === e.tempFilePath);
				this.imageValue.splice(num, 1);
			},		
			
		}
	}
</script>

<style lang="scss" scoped>
	@import 'buy.scss'
</style>
