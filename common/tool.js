
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

//返回订单状态
export function rtStatus(id){
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
		  12:'售后中' ,
		  13:'退款拒绝' ,
		  14:'退款成功' ,
		  15:'退款失败' ,
		  16:'已关闭'
	};
	
	return statusDict[id]
}

//判断小程序有没有定位权限
export function JudgeAuthorize(){
	return new Promise((req, rej) => {
		uni.authorize({
			scope:'scope.userLocation',
			success(scope){
				if(scope.errMsg==="authorize:ok") {
					req(true)
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
									req(true)
								}
							});
						} else if (res.cancel) {
							console.log('用户不授权');
						}
					}
				});
				
			}
		})
					
	})
}

//校验手机号
export function isValidPhoneNumber(phoneNumber){
	const phoneNumberPattern = /^1[3456789]\d{9}$/;
	return phoneNumberPattern.test(phoneNumber);
}



//判断用户是否有定位授权
export function authVerification () {
  uni.getSetting({
	success: (res) => {
		if (res.authSetting['scope.userLocation']) { /* 用户授权成功时走这里 */
			GetLocation()
		} else if (res.authSetting['scope.userLocation'] === undefined) { /* 用户未授权时走这里 */
			handleOpenSetting()
		} else { /* 用户拒绝了授权后走这里 */
			handleOpenSetting()
		}
	},
  })
}
//获取当前的地理位置
function GetLocation(){
	uni.getLocation({
		type: 'gcj02',
		geocode: true,
		success(response) {
			console.log('getLocation:', response)
			handerChooseLocation(response.latitude,response.longitude)
		},
		fail() {
			handerChooseLocation()
		}
	})
}
// 使用uni.chooseLocation()打开地图选择位置
function handerChooseLocation (latitude, longitude) {
	uni.chooseLocation({
		latitude: latitude || '',
		longitude: longitude || '', 
		success: (res) => {
			uni.setStorageSync('currentLocation', res)
		},
		fail: function (err) {
			console.log('取消按钮', err)
		}
	})
}
function handleOpenSetting () {
	wx.openSetting({			/* 打开定位设置 */
		success: (res) => {
			if (res.authSetting["scope.userLocation"]) {
				handerChooseLocation()
			}
		}
	})
}


import QQMapWX from "@/common/qqmap-wx-jssdk.min.js";
export function mapsdk (location){
	const qqmapsdk = new QQMapWX({
		// key: 'PBZBZ-74CE3-7ND3P-3OVWM-HDZIT-QRF23'  //别人的key
		key: 'LUDBZ-VKU3G-D4KQ6-QDLJQ-RMTDH-RRFYI'  //自己的key
	});
	qqmapsdk.reverseGeocoder({
		location,
		get_poi:1,
		poi_options:'policy=2;radius=3000;page_size=20;page_index=1',
		success: function(res) {
			console.log(111222,res)
			return res.result;
		},
	});
}


//时间选择 关闭事件
export function handleTime(data){  
	console.log(data)
	if (data.includes("周")) {
		return data;
	}	
	
	const [datePart, timePart] = data.split(' ');
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
	let yyTime = "";
	if(prefix){
		yyTime = `${prefix}(${dayOfWeek}) ${timePart}`;
	}else{
		yyTime = `${month}月${day}(${dayOfWeek}) ${timePart}`;
	}
	return yyTime;
}