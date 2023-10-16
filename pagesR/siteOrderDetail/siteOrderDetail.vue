<template>
	<view class="allBg">
		<view class="odBg">
			<view class="od-zt">
				<uni-icons type="spinner-cycle" size="48rpx" color="#fff" v-if="infoData.status==11" ></uni-icons>
				<uni-icons type="info" size="48rpx" color="#fff" v-else></uni-icons>
				<span class="ml10">{{rtStatus(infoData.status)}}</span>
			</view>
					
			<view class="od-main">
				<view class="odBox">
					<view class="od-adr">
						<uni-icons type="location" size="56rpx" color="#333333" @click="daoHang(infoData)"></uni-icons>
						<view class="adr-rt">
							<view class="rt-name flex">
							{{infoData.name}} <span>{{infoData.phone}}</span>
							 <view class="name-tell" @click="PhoneCall(infoData.phone)">
							 	<uni-icons type="phone" size="30rpx" color="#446DFD"></uni-icons>联系用户
							 </view>
						</view>
							<p @click="daoHang(infoData)">{{infoData.address}} {{infoData.houseNumber}}</p>
						</view>
					</view>
					<view class="od-title">
						<view class="title-lt">发货方式</view>
						<view class="title-rt">{{infoData.type == 1 ? "上门取送" : "到店服务"}}</view>
					</view>
					<view class="od-title" v-if="infoData.type == 1">
						<view class="title-lt">预约上门取鞋时间</view>
						<view class="title-rt">{{infoData.reservationTime}}</view>
					</view>
					<view class="od-title" v-if="infoData.type == 1&&infoData.status>=2" @click="openQsSel(infoData.status==2)">
						<view class="title-lt">分配取货骑手</view>
						<view class="title-rt">
							{{qsSelect}}
							<uni-icons type="forward" size="32rpx" color="#666" v-if="infoData.status == 2"></uni-icons>
						</view>
					</view>
					<view class="od-title" v-if="infoData.type == 1&&infoData.status>=7" @click="openQsSel(infoData.status==7)">
						<view class="title-lt">分配送货骑手</view>
						<view class="title-rt">
							{{qsSelect}}
							<uni-icons type="forward" size="32rpx" color="#666" v-if="infoData.status == 7"></uni-icons>
						</view>
					</view>
				</view>
				
				<view class="odBox">
					<view class="od-title">
						<view class="title-lt">订单信息</view>
					</view>
					<view class="od-info">
						<p class="info-p">订单编号：{{infoData.orderNo}} <span @click.stop="copy(infoData.orderNo)">复制</span></p>
						<p>下单时间：{{infoData.createTime}}</p>
						<p>支付方式：{{infoData.status==1 ? "未付款" : "微信支付"}}</p>
						<view class="od-qt" style="padding-bottom: 0;">
							<view class="qtBox" v-if="infoData.remark">
								<view class="qtBox-tt">用户备注：</view>
								<view class="qtBox-txt">{{infoData.remark}}</view>
							</view>
							<view class="qtBox">
								<view class="qtBox-tt">用户上传的图片：</view>
								<view class="image-grid">
								  <image v-for="(i,ind) in infoData.pics" :key="ind" :src="i" mode="widthFix" class="image" @click="getImgIndex(infoData.pics,ind)"></image>
								</view>
							</view>
						</view>
						<template v-if="infoData.status>3">
							<view class="od-qt" style="padding-bottom: 0;" v-for="(oot,ooind) in infoData.orderOperates" :key="ooind">
								<view class="qtBox" v-if="oot.remarks">
									<view class="qtBox-tt">{{oot.type==1 ?'取货' : '送货'}}骑手备注：</view>
									<view class="qtBox-txt">{{oot.remarks}}</view>
								</view>
								<view class="qtBox">
									<view class="qtBox-tt">{{oot.type==1 ?'取货' : '送货'}}骑手上传的图片：</view>
									<view class="image-grid">
									  <image v-for="(i,ind) in oot.pic" :key="ind" :src="i" mode="widthFix" class="image" @click="getImgIndex(oot.pic,ind)"></image>
									</view>
								</view>
							</view>
						</template>
						
					</view>
				</view>
				
				<view class="odBox" v-if="infoData.goodsInfo">
					<view class="od-title">
						<view class="title-lt">商品信息</view>
					</view>
					<view class="ordre-item" v-for="(i,ind) in JSON.parse(infoData.goodsInfo)" :key="ind">
						<image :src="i.goodsPic" class="main-lt"></image>
						<view class="item-mid">
							<p class="mid-p overflow1">{{i.goodsName}}</p>
							<p>规格：默认</p>
							<p>x{{i.goodsNum}}</p>
						</view>
						<view class="main-rt">￥{{i.goodsNowPrice}}</view>
					</view>
					
					<view class="od-price">
						<p>商品总价<span>￥{{infoData.goodsTotalAmount}}</span></p>
						<p>运费  <span>￥{{infoData.freightAmount}}</span></p>
					</view>
					
					<view class="od-allPrice"><span>合计：</span>￥{{infoData.payAmount}}</view>
				</view>
				
				<template v-if="infoData.status==4||infoData.status==6">
					<view class="odBox">
						<view class="od-title">
							<view class="title-lt">操作</view>
						</view>
						<view class="od-qt">
							<view class="qtBox">
								<view class="qtBox-tt">备注：</view>
								<view class="qtBox-txt"><input type="text" v-model="param.remarks" placeholder="请输入备注" class="txt-ipt" /></view>
							</view>
							<view class="qtBox">
								<view class="qtBox-tt"><span class="tt-red">*</span>图片上传：</view>
								<uni-file-picker
									limit="9" 
									v-model="imageValue" 
									@select="select"  
									@delete="deletea">
								</uni-file-picker>
							</view>
						</view>
					</view>
					<view class="od-btn" @click="subClick">提 交</view>
				</template>
				
			</view>
			
		</view>
		
		<!-- 骑手列表弹窗 -->
		<uni-popup ref="qsPopup" type="bottom">
			<view class="qs-pp flexBox">
				<view class="qs-title">
					骑手列表
					<uni-icons type="closeempty" size="46rpx" color="#666" @click="closeQS"></uni-icons>
				</view>
				<scroll-view scroll-y="true" lower-threshold="150" @scrolltolower="scrollLower" class="boxScroll">
					<view class="stman">
						<view class="item" v-for="(i,ind) in list" :key="ind" @click="qsClick(i,ind)">
							<image  :src="retHandle(i.userAddress,'pic',i.user.avatar)" class="img"></image>
							<view class="item-mid">
								<view class="name">{{i.user.nickName}}<span v-if="i.userAddress&&i.userAddress.name">({{i.userAddress.name}})</span></view>
								<view class="item-p">手机号: {{retHandle(i.userAddress,'phone',i.user.phone)}}</view>
								<view class="item-p">订单数: {{i.orderNum}}</view>
								<view class="item-p">总收入: ￥{{i.userWalletDto.balance+i.userWalletDto.withdrawAmount}}</view>
							</view>
							<view class="item-rt"  @click="setRemoveQs(i,2)">
								<view :class="['circle',{'circle-red':i.check}]"></view>
							</view>
						</view>
					</view>
					
					<view v-show="isLoadMore" class="more_loading">
							<uni-load-more :status="loadStatus" :contentText="contentText"></uni-load-more>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import { DSorderInfo,DSorderEdit,riderPage,DSallocationRider } from '@/api/page/index.js'
	export default {
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				imgArr:[],
				param:{
					orderId:0,
					orderNo:0,
				},
				infoData:{},
				imageValue:[],
				
				qsSelect:'请选择骑手',
				isCheckQS:false,
				
				listQuery:{
					pageNo:1,
					pageSize:10,
				},
				list:[],
				//scroll-view
				contentText:{
					contentdown: "上拉显示更多",
					contentrefresh: "加载中...",
					contentnomore: "已全部加载"
				},
				loadStatus:'loading',  //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
				isLoadMore:false,  //是否加载中
			}
		},
		onLoad(option) {
			this.param.orderId = option.orderId;
			this.param.orderNo = option.orderNo;
			this.getInfo();
			this.initData();
		},
		
		methods: {
			getInfo(){
				uni.showLoading()
				DSorderInfo(this.param).then((res) => {
					if(res.code == 200){
						if(res.data.status>=3)
						this.qsSelect =  `${res.data.ruser.name || ''}`
						this.infoData = res.data;
					}
					uni.hideLoading()
				})
			},
			
			initData(){
				riderPage(this.listQuery).then((res) => {
					if(res.code == 200){
						if(this.listQuery.pageNo<=res.data.totalPages){
							res.data.data.forEach((item) => {
								this.$set(item,'check',false)
							});
							this.list.push(...res.data.data);
								
							if(this.listQuery.pageNo==res.data.totalPages){ 
								this.isLoadMore=true                                             
								this.loadStatus='nomore'
							}else{
								this.isLoadMore=false
								this.loadStatus='loading'
							}
						}else{
							if(this.listQuery.pageNo == 1){
								this.isLoadMore=false;
							}else{
								this.isLoadMore=true
								this.loadStatus='nomore'
							}
						}
						
					}
				}).catch(e=>{
					this.isLoadMore=false
				})
			},
			
			retHandle(userAddress,name,userName){
				if(userAddress){
					return userAddress[name] || userName;
				}
				return userName
			},
			openQsSel(n){
				if(this.list.length==0){
					uni.showToast({title: '暂无骑手,请先添加！', icon:'none'});
					return;
				}
				if(!this.isCheckQS&&n) this.$refs.qsPopup.open()
			},
			closeQS(){
				this.$refs.qsPopup.close()
			},
			//弹窗-骑手点击事件
			qsClick(obj,ind){
				let _that = this;
				uni.showModal({
					title:'温馨提示',
					cancelText: '取消',
					confirmText: '确定',
					content: `确定当前订单分配给:${obj.user.nickName}(${obj.userAddress.name})`,
					success: function(res) {
						if (res.confirm) {
							obj.check = true;
							_that.isCheckQS = true;
							_that.qsSelect = `${obj.user.nickName}(${obj.user.name})`
							_that.$refs.qsPopup.close();
							
							let param = {
								orderId: _that.infoData.orderId,
								orderNo: _that.infoData.orderNo,
								rid: obj.user.id,
								type:  _that.infoData.status == 2 ? 1 : 2
							}
							DSallocationRider(param).then((res) => {
								if(res.code == 200){
									this.infoData = res.data;
								}
							})
						} else if (res.cancel) {
							_that.$refs.qsPopup.close();
						}
					}
				})
				
			},
			
			rtStatus(id){
				const statusDict = {
				      1: '待付款',
				      2: '已付款',
				      3: '骑手未取货',
				      4: '骑手已取货',
				      5: '厂家未取货',
				      6: '厂家已取货',
				      7: '代收点已收货',
				      8: '送货骑手未取货',
				      9: '送货骑手已取货',
				      10: '骑手已送达',
				      11: '已完成',
				};
				
				return statusDict[id]
			},
			
			//打电话
			PhoneCall(phone){
				uni.makePhoneCall({
					phoneNumber: phone 
				});
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
			
			subClick(){
				if(this.imageValue.length==0){
					uni.showToast({title: '图片上传不能为空', icon:'none'});
					return;
				}
				const statusMapping = {
					4: 1,
					6: 2,
				};
				this.param.status = statusMapping[this.infoData.status];
				this.param.pics = this.imageValue.map(item => item.url).join(',');
				
				DSorderEdit(this.param).then((res) => {
					if(res.code == 200){
						uni.showToast({title: '提交成功', icon:'success'});
						setTimeout(()=>{
							uni.$emit('ERoleOdDetail');
							uni.navigateBack({
								delta: 1
							})
						},1000)
					}
				})
			},
			
			copy(value){
				uni.setClipboardData({
					data: value,
					success: function(res) {
						uni.getClipboardData({
							success: function(res) {
								uni.showToast({
									title: '已复制到剪贴板'
								});
							}
						});
					}
				});
			},
			
			//导航
			daoHang(i){
				uni.openLocation({
					latitude: i.n,
					longitude: i.e,
					name: i.shopName || '',//终点名称
					address: i.address,//终点详细地址
					success: function (res) {
						console.log('success',res);
					}
				});
			},
			
			getImgIndex(obj,index) { //图片预览
				//准备一个装图片路径的  数组imgs
				let imgs = obj.map(item => {
					//只返回图片路径
					return item
				})
				// console.log(imgs);
				//调用预览图片的方法
				uni.previewImage({
					urls: imgs,
					current: index
				})
			},
			
			scrollLower(){
				if(!this.isLoadMore){  //此处判断，上锁，防止重复请求
					this.isLoadMore=true
					this.listQuery.pageNo++
					this.initData()
				}
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	@import 'siteOrderDetail.scss'
</style>
