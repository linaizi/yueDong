<template>
	<view class="allBg">
		<view :style="{ height: iStatusBarHeight + 'px'}"></view>
		
		<image src="../../static/img/back.png" class="back" @click="back_"></image>
		
		<!-- <商品轮播图 -->
		<view class="uni-padding-wrap" :style="{ height: zuiGao }">
			<swiper class="pdswiper" autoplay="true" interval="3000" circular="true" @change='swiperChange' >
				<block v-for="(item,index) in infoData.goodsImgs" :key="index">
					<swiper-item>
						<view class="swiperBox">
							<image :src="item" :data-src="item" class="bannerImg" mode="widthFix" @click="getImgIndex(index)"></image>
						</view>
					</swiper-item>
				</block>
			</swiper>
			<view class="swiperMsg" v-if="isShowMsg">
				<view class="numbox">{{swiperIndex+1}}/{{infoData.goodsImgs.length}}</view>
			</image>
			</view>
		</view>
		
		<view class="pdBox">
			<view class="pd-price">￥<span class="big">{{infoData.goodsNowPrice}}</span>/双 <span class="gray">￥{{infoData.goodsPrice}}/双</span></view>
			<view class="pd-title">{{infoData.goodsName}}</view>
			<view class="pd-sale">
				<view class="sale-v1">已售{{infoData.saleas}}件</view>
				<view class="sale-v1">库存{{infoData.stockNum}}件</view>
			</view>
		</view>
		
		<view class="pdBox" v-if="infoData.commentNum>0">
			<view class="pd-title">商品评价({{infoData.commentNum}}) <span @click="toPj">查看全部 ></span></view>
			<view class="pjItem" v-for="(pi,pid) in infoData.comments" :key="pid">
				<view class="item-top">
					<image :src="pi.avatar" class="top-img"></image>
					<p class="top-p">{{pi.nickName}}</p>
					<p>{{pi.createTime}}</p>
				</view>
				<view class="item-txt">{{pi.content}}</view>
				<view class="image-grid" v-if="pi.pic.length>0">
				  <image v-for="(i,ind) in pi.pic" :key="ind" :src="i" mode="widthFix" class="image"></image>
				</view>
				<view class="item-gray">规格：默认</view>
			</view>
		</view>
		
		<view class="pictureBox">
			<view class="titleBox flex">
				<view class="title">商品详情</view>
				<view class="rightBox flex" @click="isShowPic()">
					<view>{{isShowImgBox?'收起':'展开'}}</view>
					<image class="upBtn" :class="isShowImgBox ? 'upBtn-active' : ''"src="../../static/img/upIcon.png"></image>
				</view>
			</view>
			<view class="pictureList" v-show="isShowImgBox">
				<image v-for="(item,index) in infoData.goodsInfoImgs" :key="index" :src="item" mode="widthFix" class="picture">
				</image>
			</view>
		</view>
		
		<view class="btnBox">
			<view class="btn-lbox" @click="goHomePage()">
				<image src="../../static/img/homeIcon.png" class="btnIcon"></image>
				<view>首页</view>
			</view>
			<view class="btn-lbox" @click="scClick()" v-if="hasSC">
				<image :src="scImg" class="btnIcon"></image>
				<view>{{scTxt}}</view>
			</view>
			<view class="leftBtnBox bottomBtnBox" @click.stop="openCar">加入购物车</view>
			<view class="bottomBtnBox" @click="openCar">立即购买</view>
		</view>
		
		<view class="pd-tc">
			<view class="tc-item" @click="goCart">
				<image src="../../static/img/pd-cart.png" class="w100" mode="widthFix"></image>
				<span>{{infoData.shoppingNum}}</span>
			</view>
			<view class="tc-item" @click="sharePP">
				<image src="../../static/img/pd-share.png" class="w100" mode="widthFix"></image>
			</view>
			<view class="tc-item" @click="scrollToTop" v-if="flag">
				<image src="../../static/img/pd-top.png" class="w100" mode="widthFix"></image>
			</view>
		</view>
		
		<uni-popup ref="popup" background-color="#fff">
			<view class="share-pp">
				<view class="pp-item"><button type="default" open-type="share" class="share-btn"></button>分享给好友</view>
				<view class="pp-item" @click="hbClick">生成海报</view>
				<view class="pp-item pp-qx" @click="closePP">取消</view>
			</view>
		</uni-popup>
		
		<Ppcar :ppCarData="infoData" ref="child" @updClick="handleUpd"></Ppcar>
		<Pplog ref="logchild" :mid.sync="mid"  @getData='getUserData'></Pplog>
		 <!-- 海报弹窗 -->
		 <hbTc :hbShow.sync="hbShow" :hbData="hbData"></hbTc>
		 
	</view>
</template>

<script>
	import { priceHander,preservationImg } from '@/common/tool.js'
	import { goodsInfo, shoppingAdd, getWechatEwm } from '@/api/page/index.js'
	import Ppcar from "@/components/ppcar/ppcar.vue"
	import Pplog from "@/components/pplog/pplog.vue"
	import hbTc from "@/components/hbTc/hbTc.vue"; 
	export default {
		components: {
			Ppcar,
			Pplog,
			hbTc,
		},
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mid: uni.getStorageSync('mid'),
				goodsId:'',
				iStatusBarHeight: 0,
				infoData:{
					goodsImgs:[]
				},
				
				swiperIndex:0,
				isShowMsg:true,
				
				isShowImgBox:false,
				hasSC:false,//false代表没有收藏，改成true就可以增加收藏
				scTxt:'收藏',
				scImg:'../../static/img/sc1.png',
				flag: false,
				
				hbShow:false,
				hbData:{},
				zuiGao:'414px', //计算获取轮播图的最高高度
			}
		},
		onLoad(option) {
			const {platform,statusBarHeight} = uni.getSystemInfoSync()
			this.iStatusBarHeight = statusBarHeight
		
			this.goodsId = option.goodsId;
			this.getGoodInfo(option.goodsId)
		},
		
		methods: {
			priceHander,
			preservationImg,
			
			getGoodInfo(goodsId){
				goodsInfo({goodsId}).then((res) => {
					if(res.code == 200){
						this.infoData = res.data;
						if(res.data.goodsPic) this.infoData.goodsImgs.unshift(res.data.goodsPic)
						this.lunBoHandle(this.infoData.goodsImgs)	
					}
				})
			},
			
			//轮播图处理 根据轮播图定义高度
			async lunBoHandle(data){
				let sjW = 0;
				const query = uni.createSelectorQuery().in(this).select('.uni-padding-wrap');
				query.boundingClientRect((res) => {
					sjW = res.width
					
					let zuiH = 0;
					const getImageInfoPromises = data.map((item) => {
						return new Promise((resolve) => {
							uni.getImageInfo({
								src: item,
								success: function (image) {
									let sw_height = image.height * sjW / image.width;
									if (zuiH < sw_height) zuiH = sw_height;
									resolve();
								}
							});
						});
					});
				
					Promise.all(getImageInfoPromises).then(() => {
						if(zuiH<=414) this.zuiGao = zuiH + 'px';
					});
				}).exec();
			},
			
			openCar(i){
				this.$refs.child.$refs.popup.open()
			},
			handleUpd(){ this.getGoodInfo(this.goodsId) },
			logClick(){
				this.$refs.child.$refs.popup.close()
				this.$refs.logchild.$refs.logPopup.open()
			},
			//pplog组件回调
			getUserData(wcode){
				if(wcode==200) {
					this.$refs.logchild.$refs.logPopup.close();
					uni.showToast({title: '登录成功', icon:'success'});
				}
				this.getGoodInfo(this.goodsId)
			},
			
			back_(){
				uni.navigateBack({
					delta:1
				});
			},
			
			swiperChange(e) {
				this.swiperIndex = e.target.current
			},
			
			isShowPic() { //展开收起图片
				this.isShowImgBox = !this.isShowImgBox
			},
			
			// 跳到主页  
			goHomePage() {
				uni.reLaunch({
					url: '/pages/index/index'
				});
			},
			toPj(){
				uni.navigateTo({
				    url: '/pages/allEvaluations/allEvaluations?goodsId=' + this.infoData.id
				});
			},
			goCart(){
				if(this.mid) { 
					uni.switchTab({
					    url: '/pages/myCart/myCart'
					});
				}else{
					uni.showToast({ title: '请先登录', icon:'none' })
				}
			},
			
			//图片预览
			getImgIndex(index) { 
				let imgs = this.infoData.goodsImgs.map(item => {
					return item
				})
				uni.previewImage({
					urls: imgs,
					current: index
				})
			},
			
			// 打开分享弹窗
			sharePP(){
				this.$refs.popup.open('bottom')
			},
			closePP(){ this.$refs.popup.close() },
			hbClick(){
				this.$refs.popup.close();
				
				uni.showLoading({
					title: '加载中'
				});
				
				let param = {
					goodsId: this.goodsId,
					page:'pages/productDetails/productDetails',			//先传空，上线后删除
				}
				getWechatEwm(param).then((res) => {
					if(res.code == 200){
						this.hbShow = true;
						this.hbData = this.infoData
						this.$set(this.hbData,'ewm', res.data) 
					}
				})
				
			},
			
			// 打开海报弹窗
			closeHb(){ this.$refs.hbPopup.close() },
			
			scrollToTop() { //回到顶部
				uni.pageScrollTo({
					duration: 10, // 毫秒
					scrollTop: 0 // 位置
				});
			},
			
			scClick(){
				this.isSc = !this.isSc;
				if(this.isSc){
					this.scTxt = "已收藏"
					this.scImg = '../../static/img/sc.png'
				}else{
					this.scTxt = "收藏"
					this.scImg = '../../static/img/sc1.png'
				}
			},
			
			// 分享给好友
			onShareAppMessage(options) {
				this.$refs.popup.close()
				
				let url = '/pages/productDetails/productDetails?goodsId=' + this.goodsId 
			
				var _that = this;
				var shareObj = {
					title: _that.infoData.goodsName,
					path: url
				}
				// 来自页面内的按钮的转发
				if (options.from == 'button') {}
				// 返回shareObj
				return shareObj;
			},
		},
		
		//下拉刷新
		onPullDownRefresh() {
			this.getGoodInfo(this.goodsId)
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		
		onPageScroll(e) { //当距离大于200时显示回到顶部按钮
			if (e.scrollTop > 200) {
				this.flag = true
			} else {
				this.flag = false
			}
		},
		
	}
</script>

<style lang="scss" scoped>
	@import 'productDetails.scss'
</style>
