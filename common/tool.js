
//价钱处理
export function priceHander(price,type) {
		if (type === 1) {
			return Math.floor(price).toString();
		} else if (type === 2) {
				const decimalPart = price - Math.floor(price);
				return decimalPart == 0 ? '' : decimalPart.toFixed(1).slice(1);
		} 
}

//跳转小程序
export function ToMini(wxMini) {
	uni.navigateToMiniProgram({
		appId: wxMini.appId,
		path: wxMini.pagePath,
		success(res) {
			console.log(res);
		},
		fail: err => {
			console.log(err);
		}
	})
}

			
//下载图片
import { debounce } from "@/common/throttle.js"; //引入防抖节流函数
export function preservationImg(n,img) {
	uni.authorize({
		scope: 'scope.writePhotosAlbum',
		/* scope.writePhotosAlbum 类型是保存到相册 */
		success() {
			/* 已授权进入 */
			if(n){
				imgArrApi(img); /* 保存图片到相册方法方法 */
			}else{
				imgApi(img)
			}
		},
		complete(res) {
			/* 判断如果没有授权就打开设置选项让用户重新授权 */
			uni.getSetting({
				success(res) {
					if (!res.authSetting['scope.writePhotosAlbum']) {
						openInstall(); /* 打开设置的方法 */
					}
				}
			});
		}
	});
}

function imgArrApi(images) { //批量保存图片到系统相册。
	uni.showLoading({
		title: '下载中'
	});
	
	/* 获取图片的信息 */
	images.forEach((res,index)=>{
		uni.getImageInfo({
			src: res,
			success: function(image) {
				/* 保存图片到手机相册 */
				uni.saveImageToPhotosAlbum({
					filePath: image.path,
					success: function() {
						if(index == images.length-1){
							uni.hideLoading();
							uni.showToast({ title: '图片已保存到相册', icon:'none' })
						}
					},
					fail(res) {
						console.log('图片arr保存失败：',res);
						uni.showToast({
							title: '图片保存失败'
						});
						uni.hideLoading();
					}
				});
			}
		});
	})
}

function imgApi(image) { //保存单张图片到系统相册。
		uni.getImageInfo({
			src: image,
			success: function(image) {
				/* 保存图片到手机相册 */
				uni.saveImageToPhotosAlbum({
					filePath: image.path,
					success: function() {
						uni.showToast({ title: '图片已保存到相册', icon:'none' })
					},
					fail(res) {
						console.log('图片保存失败：',res);
						uni.showToast({
							title: '图片保存失败'
						});
					}
				});
			}
		});
}

function openInstall() {
	uni.showModal({
		content: '没有授权保存图片到相册,点击确定去允许授权',
		success: function(res) {
			if (res.confirm) {
				uni.openSetting({
					/* 打开设置的API*/
					success(res) {
						console.log(res.authSetting);
					}
				});
			} else if (res.cancel) {
				uni.showModal({
					cancelText: '取消',
					confirmText: '重新授权',
					content: '你点击了取消，将无法进行保存操作',
					success: function(res) {
						if (res.confirm) {
							uni.openSetting({
								success(res) {
									console.log(res.authSetting); /* 授权成功 */
								}
							});
						} else if (res.cancel) {
							console.log('用户不授权');
						}
					}
				});
			}
		}
	});
}