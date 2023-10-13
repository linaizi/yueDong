<template>
	<view class="" v-if="hbShow">
		<canvas class="can1" :style="{ width: canvasW + 'px', height: canvasH + 'px' }" canvas-id="myCanvas" id="myCanvas"></canvas>
		<view class="hbBoxBg" v-if="isShow">
				<view class="hbBox">
					<image src="../../static/img/share-close1.png" class="hb-close" @click="hbClose">	
					<image :src="poster" :show-menu-by-longpress="true" class="can-img" mode="widthFix">
		
					<view class="hb-btn">
						<view class="btn-pub btn-l" @click="preservationImg(0,poster)">保存到相册</view>
						<view class="btn-pub btn-r" @click="shareImg">立即分享</view>
					</view>
				</view>
			</view>
	</view>


</template>

<script>
	import { preservationImg } from '@/common/tool.js'
	export default {
		name:"hb-tc",
		props:{
			hbShow:{
				type:Boolean
			},
			hbData:{
				type:Object
			}
		},
		watch:{
			hbShow(n,o){
				if(n){
					console.log(n)
					this.$nextTick(()=>{
						this.drawPoster1()
					})
				}
			}
		},
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				poster:'',
				isShow:false,
				
				canvasW:0, // 画布宽
				canvasH:0, // 画布高
				SystemInfo:{}, // 设备信息
				goodsImg: {}, // 商品主图
			}
		},
	
		methods: {
			async drawPoster1() {
				let upx = getApp().globalData.pmB
				this.poster = '';
				
				// 获取设备信息，主要获取宽度，赋值给canvasW 也就是宽度：100%
				this.SystemInfo = await this.getSystemInfo();
				// 获取商品主图，二维码信息，APP端会返回图片的本地路径（H5端只能返回原路径）
				this.goodsImg = await this.getImageInfo(this.hbData.goodsImgs[0]);
				console.log('this.goodsImg',this.goodsImg)
				this.ewmImg = await this.getImageInfo(this.hbData.ewm);
				// console.log('this.ewmImg',this.ewmImg)
				this.canvasW = this.SystemInfo.windowWidth; // 画布宽度 = 屏幕宽度
				
				this.goodsImg.height = this.goodsImg.height > 800 ? 800 : this.goodsImg.height
				this.goodsImg.width = this.goodsImg.width > 800 ? 800 : this.goodsImg.width

				
				let height = this.goodsImg.height + 150 + 150 + 80;  // 画布实际高度 = 主图高度+价格区域高度 + 二维码高度 + 间隔
				this.canvasH = height * this.canvasW / this.goodsImg.width   // 画布高度 = 主图高度+价格区域高度 + 二维码高度 + 间隔
				
				let goodsH = this.goodsImg.height * this.canvasW / this.goodsImg.width  //商品图高度
				// console.log(this.canvasW, this.canvasH, goodsH)
					
				// 如果主图，二维码图片，设备信息都获取成功，开始绘制海报，这里需要用setTimeout延时绘制，否则可能会出现图片不显示。
				if(this.goodsImg.errMsg == 'getImageInfo:ok' && this.SystemInfo.errMsg == 'getSystemInfo:ok'){
					console.log('ok:海报绘制中')
					uni.showLoading({
						title: '海报生成中',
						mask:true,
					});
					
					let ctx = uni.createCanvasContext("myCanvas", this);
					
					ctx.clearRect(0, 0, this.canvasW, this.canvasH); 
					ctx.setFillStyle("#fff"); // 设置背景色
					ctx.fillRect(0, 0, this.canvasW, this.canvasH); 
					
					// 商品图
					ctx.drawImage(this.goodsImg.path, 0, 0, this.canvasW, goodsH); 
					
					// 到手价¥ 	 // ctx.font = "bold 22px Arial";
					ctx.setFillStyle("#F92E4F");
					ctx.setFontSize(20)
					ctx.fillText('到手价', 10, goodsH+30);
					ctx.fillText('¥', 10,  goodsH+70);
					
					//券后价 
					ctx.setFontSize(30)
					ctx.fillText(this.hbData.goodsNowPrice, 23, goodsH+70);		
					
					 //原价 
					let price = '¥'+this.hbData.goodsPrice
					let nowPrice = '¥'+this.hbData.goodsNowPrice
					let wsp3 = ctx.measureText(nowPrice).width + 15
					ctx.setFillStyle("#999999");
					ctx.setFontSize(21)
					ctx.fillText(price, wsp3, goodsH+70); 
					
					//设置横线
					let wsp2 = ctx.measureText(price).width + wsp3
					ctx.moveTo(wsp3, goodsH+62)
					ctx.lineTo(wsp2, goodsH+62)
					ctx.setStrokeStyle('#999999')
					ctx.stroke()
					
					// title标题
					ctx.setFillStyle("#000");
					// ctx.setFillStyle("#fff");
					ctx.setFontSize(22)
					this.drawText(ctx, this.hbData.goodsName, 10, goodsH+ 120, this.canvasW*0.5, 22);	// 调用行文本换行函数
				
					//二维码框  
					ctx.setFillStyle('#CECECE')  //设置边框颜色
					ctx.strokeRect(this.canvasW-120, goodsH+ 30, 110, 110)	//画一个矩形(非填充)
					// 二维码
					ctx.drawImage(this.ewmImg.path, this.canvasW-115, goodsH+35, 100, 100);
								 
					//长按识别购买
					ctx.setFillStyle("#666");
					ctx.setFontSize(12)
					let rp = this.canvasW - ctx.measureText('长按识别领券购买').width-15
					ctx.fillText('长按识别领券购买', rp, goodsH+35+120); 
					
					console.log('准备转canvas')
					setTimeout(()=>{
						wx.createSelectorQuery().in(this).select('#myCanvas').fields({
								size:true,
								node:true,
							},(r)=>{
								ctx.draw(false,()=>{
									setTimeout(()=>{
										uni.canvasToTempFilePath({
											canvasId:'myCanvas',
											success: (res) => {
												console.log('图片路径：',res)
												this.poster=res.tempFilePath
												uni.hideLoading();
												this.isShow = true;
											},
											fail: () => {
												console.log( "加载失败")
												uni.hideLoading();
											},
										},this)
									},500)
								})
								
						}).exec()
						
					},500)
				}else{
					console.log('err')
				}
			},
			// 获取图片信息
			getImageInfo(image) {
				image = image.split('?')[0];
				
				if(image.indexOf('.webp')!=-1){
					image = image.replace(/.webp/g,"")
				}
				return new Promise((req, rej) => {
					uni.getImageInfo({
						src: image,
						success: function(res) {
							req(res)
						},
					});
				})
			},
			
			// 获取设备信息
			getSystemInfo(){
				return new Promise((req, rej) => {
					uni.getSystemInfo({
					    success: function (res) {
					        req(res)
					    }
					});
				})
			},
			
			/**
				* canvas文本超出范围时，自动换行
			 * @param {*} ctx
			 * @param {*} text
			 * @param {*} x
			 * @param {*} y
			 * @param {*} maxWidth
			 * @param {*} lineHeight
			 */
			drawText (ctx, text, x, y, maxWidth, lineHeight) {  //ctx, str, 0, 670, 360, 48
				let lineWidth = 0
				let lastSubStrIndex = 0
				let zIndex = 0
				for (let i = 0; i < text.length; i++) {
					lineWidth += ctx.measureText(text[i]).width
					if (lineWidth > maxWidth) {
						if(zIndex == 0){
							ctx.fillText(text.substring(lastSubStrIndex, i), x+18, y)
						}else if(zIndex == 2){
							ctx.fillText(text.substring(lastSubStrIndex, i)+ "...", x, y)
							return;
						}else{
							ctx.fillText(text.substring(lastSubStrIndex, i), x, y)
						}
						zIndex++
						y += lineHeight
						lineWidth = 0
						lastSubStrIndex = i
					}
					if (i === text.length - 1) {
						ctx.fillText(text.substring(lastSubStrIndex, i + 1), x, y)
					}
				}
			},
			
			hbClose(){
				this.$emit('update:hbShow',false);
			},
			
			shareImg(){
				console.log(this.poster)
				/* uni.downloadFile({
					url: this.poster,//分享的图片的链接
					success: (res) => {
						console.log('shareImg',res)
						wx.showShareImageMenu({
							path: res.tempFilePath
						})
					}
				}) */
				
				wx.showShareImageMenu({
					path: this.poster
				})
			},
			
			preservationImg,
			
		}
	}
</script>

<style lang="scss" scoped>
	.can1{
		position: fixed;
		top:0;
		left: -5000upx;
		opacity: 0;
	}
	
	.hbBoxBg{
		background-color: rgba(0,0,0,.4);
		width: 100%;
		height: 100%;
		position: fixed;
		top:0;
		left:0;
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
		.hbBox{
			width: 660upx;
			padding: 30upx;
			box-sizing: border-box;
			background: #FFFFFF;
			border-radius: 18upx;
			position: relative;
			.can-img{
				width: 600upx;
				height: 862upx;
			}
			.hb-close{
				width: 48upx;
				height: 48upx;
				position: absolute;
				top:-10upx;
				right: -11upx;
			}
			
			.hb-btn{
				display: flex;
				justify-content: center;
				margin-top: 30upx;
				.btn-pub{
					width: 280upx;
					height: 80upx;
					text-align: center;
					line-height: 79upx;
					border-radius: 200upx;
					margin: 0 12upx;
					font-size: 32upx;
					color: #fff;
				}
				.btn-l{
					background: linear-gradient(to left, #FF1B38 0%, #FF5900 100%);
				}
				.btn-r{
					background: linear-gradient(to left, #FD5303 0%, #FF9134 100%);
				}
			}
		}
	}
	
</style>
