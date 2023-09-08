<template>
	<view class="allBg">
		<view :style="{ height: iStatusBarHeight + 'px'}"></view>
		<!-- <商品轮播图 -->
		<view class="uni-padding-wrap">
			<image src="../../static/img/back.png" class="back"></image>
			
			<swiper class="swiper" autoplay="true" interval="3000" circular="true" @change='swiperChange'>
				<block v-for="(item,index) in swpArr" :key="index">
					<swiper-item>
						<view class="swiperBox">
							<image :src="item" :data-src="item" class="bannerImg" @click="getImgIndex(index)"></image>
						</view>
					</swiper-item>
				</block>
			</swiper>
			<view class="swiperMsg" v-if="isShowMsg">
				<view class="numbox">{{swiperIndex+1}}/{{swpArr.length}}</view>
			</image>
			</view>
		</view>
		
		<view class="pdBox">
			<view class="pd-price">￥<span class="big">25.9</span> <span class="gray">￥39.6</span></view>
			<view class="pd-title">普通鞋类 (不含aj、椰子、绒面)普通鞋类 (不含aj、椰子、绒面)普通鞋类 (不含aj、椰子、绒面)</view>
			<view class="pd-sale">已售21件</view>
		</view>
		
		<view class="pdBox">
			<view class="pd-title">商品评价(2) <span>查看全部 ></span></view>
			<view class="pjItem">
				<view class="item-top">
					<image src="../../static/img/logo.jpg" class="top-img"></image>
					<p class="top-p">匿名用户</p>
					<p>2023-08-09</p>
				</view>
				<view class="item-txt">阿斯顿发送到发是发</view>
				<view class="image-grid" v-if="imgArr.length>0">
				  <image v-for="(i,ind) in imgArr" :key="ind" :src="i" mode="widthFix" class="image"></image>
				</view>
				<view class="item-gray">规格：默认</view>
			</view>
			<view class="pjItem">
				<view class="item-top">
					<image src="../../static/img/logo.jpg" class="top-img"></image>
					<p class="top-p">匿名用户</p>
					<p>2023-08-09</p>
				</view>
				<view class="item-txt">阿斯顿发送到发是发</view>
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
				<image v-for="(item,index) in imgArr" :key="index" :src="item" mode="widthFix" class="picture">
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
			<view class="leftBtnBox bottomBtnBox">加入购物车</view>
			<view class="bottomBtnBox">立即购买</view>
		</view>
		
		<view class="pd-tc">
			<view class="tc-item">
				<image src="../../static/img/pd-cart.png" class="w100" mode="widthFix"></image>
				<span>25</span>
			</view>
			<view class="tc-item" @click="sharePP">
				<image src="../../static/img/pd-share.png" class="w100" mode="widthFix"></image>
			</view>
			<view class="tc-item" @click="scrollToTop">
				<image src="../../static/img/pd-top.png" class="w100" mode="widthFix"></image>
			</view>
		</view>
		
		<uni-popup ref="popup" background-color="#fff">
			<view class="share-pp">
				<view class="pp-item"><button type="default" open-type="share" class="share-btn"></button>分享给好友</view>
				<view class="pp-item" @click="openHb">生成海报</view>
				<view class="pp-item pp-qx" @click="closePP">取消</view>
			</view>
		</uni-popup>
		
		<uni-popup ref="hbPopup" >
			<view class="hb-pp">
				<view class="hb-img"><image src="https://file.aikbao.com/2023070714050925" class="w100" mode="widthFix"></image></view>
				<uni-icons type="close" size="33" color="#fff" @click="closeHb" class="hbClose"></uni-icons>
				<view class="hbtxt" click="preservationImg(0,'https://file.aikbao.com/2023070714050925')">保存图片</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import Swiper from "@/components/swiper/swiper.vue"
	import Ppcar from "@/components/ppcar/ppcar.vue"
	import { priceHander,preservationImg } from '@/common/tool.js'
	export default {
		components: {
			Swiper,
			Ppcar
		},
		data() {
			return {
				iStatusBarHeight: 0,
				
				swiperIndex:0,
				isShowMsg:true,
				swpArr: [
					"../../static/img/good1.png",
					"../../static/img/swiper2.jpg",
					"../../static/img/swiper3.png",
				],
				
				imgArr:[
					"../../static/img/good1.png",
					"../../static/img/index1.png",
				],
				isShowImgBox:false,
				hasSC:false,//false代表没有收藏，改成true就可以增加收藏
				scTxt:'收藏',
				scImg:'../../static/img/sc1.png',
				flag: false,
			}
		},
		onLoad(option) {
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		},
		
		methods: {
			priceHander,
			preservationImg,
			
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
			
			//图片预览
			getImgIndex(index) { 
				console.log(index);
				let imgs = this.dataList.goods_gallery_urls.map(item => {
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
			openHb(){
				this.$refs.popup.close();
				this.$nextTick(()=>{
					this.$refs.hbPopup.open('center')
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
				
				this._newPar.nolog = true
				let UserInfo = JSON.parse(uni.getStorageSync('UserInfo'));
				this._newPar.uCode = UserInfo.inviteCode
				let url = '/pages/productDetails/productDetails?arr=' + JSON.stringify(this._newPar)
			
				var that = this;
				var shareObj = {
					title: that.dataList.title,
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
			// if(this.nolog){
			// 	this.initDataNoLog();
			// }else{
			// 	this.initData();
			// }
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
