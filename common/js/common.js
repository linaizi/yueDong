
import {
	Base64
} from './base64.js'




function haveTimer(faultDate, completeTime) { //传值为时间戳
	var stime = new Date().getTime();
	var etime = new Date().getTime();
	if (faultDate) {
		var stime = faultDate;
	}
	if (completeTime) {
		var etime = completeTime;
	}
	var restSec = etime - stime; //两个时间戳相差的毫秒数
	let day = parseInt(restSec / (60 * 60 * 24 * 1000))
	let hour = parseInt(restSec / (60 * 60 * 1000) % 24)
	let minu = parseInt(restSec / (60 * 1000) % 60)
	let sec = parseInt(restSec / 1000 % 60)
	let timeObj = {
		day: day,
		hour: hour,
		minu: minu,
		sec: sec
	}
	return timeObj
}

// 时间戳转日期格式 2020.06.22
// time为10位数的时间戳 symbol是年月日连接符号,isTrue是判断返回的时间格式是否是"2020年6月22日"
function toDate(time, symbol, isTrue, isTime) {
	let date = new Date(time * 1000)
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	if (month < 10) {
		month = "0" + month
	}
	let day = date.getDate()
	if (day < 10) {
		day = "0" + day
	}
	let h = date.getHours()
	if (h < 10) {
		h = "0" + h
	}
	let m = date.getMinutes()
	if (m < 10) {
		m = '0' + m
	}
	let s = date.getSeconds()
	if (s < 10) {
		s = '0' + s
	}
	if (isTrue) {
		return year + '年' + month + '月' + day + '日'
	} else if (isTime) {
		return year + symbol + month + symbol + day + " " + h + ":" + m
	} else {
		return year + symbol + month + symbol + day
	}
}

function DateDifference(faultDate, completeTime) { //传值为2019-11-22格式
	var stime = new Date().getTime();
	var etime = new Date().getTime();
	if (faultDate) {
		var stime = new Date(faultDate).getTime();
	}
	if (completeTime) {
		var etime = new Date(completeTime).getTime();
	}
	var restSec = etime - stime; //两个时间戳相差的毫秒数
	let day = parseInt(restSec / (60 * 60 * 24 * 1000))
	let hour = parseInt(restSec / (60 * 60 * 1000) % 24)
	let minu = parseInt(restSec / (60 * 1000) % 60)
	let sec = parseInt(restSec / 1000 % 60)
	let timeObj = {
		day: day,
		hour: hour,
		minu: minu,
		sec: sec
	}
	return timeObj
}

function setTabBarBadge(num) {
	if (num != 0) {
		uni.setTabBarBadge({
			index: 2,
			text: String(num)
		})
	} else {
		uni.removeTabBarBadge({
			index: 2
		})
	}
}

function getAllMonth() {
	let monthArr = []
	for (var i = 1; i < 13; i++) {
		if (i < 10) {
			monthArr.push({
				"label": "0" + i
			})
		} else {
			monthArr.push({
				"label": i
			})
		}
	}
	let yearArr = []
	for (let year = 2020; year < 2050; year++) {
		yearArr.push({
			"label": year,
			"children": monthArr
		})
	}
	return yearArr
}

function compareVersion(v1, v2) { //比较版本号
	v1 = v1.split('.')
	v2 = v2.split('.')
	const len = Math.max(v1.length, v2.length)

	while (v1.length < len) {
		v1.push('0')
	}
	while (v2.length < len) {
		v2.push('0')
	}

	for (let i = 0; i < len; i++) {
		const num1 = parseInt(v1[i])
		const num2 = parseInt(v2[i])

		if (num1 > num2) {
			return 1
		} else if (num1 < num2) {
			return -1
		}
	}

	return 0
}

function repeat(songs) {
	let result = {};
	let finalResult = [];
	for (let i = 0; i < songs.length; i++) {
		result[songs[i].imageUrl] = songs[i];
	}
	for (item in result) {
		finalResult.push(result[item]);
	}
	return finalResult;
}

// 替换表情
const replaceEmoji = text => {
	if (typeof text == 'string') {
		return text.replace(
			/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig,
			"?")
		// return text.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "?")
	}
	// return text
}
//去空格
const trimStr = str => {
	return str.replace(/(^\s*)|(\s\r\n*$)/g, "");
}

/**
 * base64 加密、解密
 * parameter 参数
 * type true加密 false解密
 */
const baseCrypto = (parameter, type = true) => {
	if (type) {
		return Base64.encode(JSON.stringify(parameter))
	} else {
		return Base64.decode(parameter)
	}
}

/**
 * 时间格式转时间戳
 * date格式为日期格式
 * 例如：2019-08-14 11:57
 */
const timeStamp = (date) => {
	const time1 = date.replace(/-/g, '/')
	const time2 = new Date(time1)

	return Date.parse(time2)
}
const parseTime = (time, cFormat) => {
	if (!time) return
	if (arguments.length === 0) {
		return null
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value]
		}
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}



const checkPhone = (data) => {
	const TEL_REGEXP = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
	return TEL_REGEXP.test(data)
}

// 电话号码隐藏中间4位数
const hideNum = (phone) => {
	let tel = phone + ''
	return tel.substr(0, 3) + '****' + tel.substr(7, 4)
}

const isNumber = (checkVal) => {
	var reg = /^-?[1-9][0-9]?.?[0-9]*$/;
	return reg.test(checkVal);
}

// 保存图片到相册
function saveImageToPhotosAlbum(image) {
	uni.showActionSheet({
		itemList: ["保存图片到本地"],
		success: (res) => {
			uni.authorize({
				scope: 'scope.writePhotosAlbum',
				success: () => {
					uni.showToast({
						title: '图片保存中...',
						icon: 'none'
					})
					
					// 1 保存
					if (res.tapIndex == 0) {
						uni.showLoading({
							title: "图片保存中..."
						})
					
						// 2 下载
						uni.downloadFile({
							url: image,
							success: (result) => {
								var tempFilePath = result.tempFilePath;
					
								// 3 存到本地
								uni.saveImageToPhotosAlbum({
									filePath: tempFilePath,
									success: () => {
										uni.showToast({
											title: "保存成功",
											duration: 2000
										})
									},
									fail: () => {
										// 4 不管成功失败都关闭提示信息！！！
										console.log("saveImageToPhotosAlbum 失败");
										uni.hideLoading();
									}
								})
							},
							fail: () => {
								console.log("downloadFile 失败");
							}
						})
					}
				},
				fail: err => {
					wx.showModal({
						title: '',
						content: '申请保存图片到你的相册',
						cancelText: '取消',
						confirmText: '确定',
						success(res) {
							if (res.confirm) {
								wx.openSetting({
									success(res) {
										console.log(res.authSetting)
									}
								})
							}
						}
					})
				}
			})
		},
		fail: () => {
			console.log("showActionSheet 失败");
		}
	})
}

// 统一处理base64图片
function base64src(base64data) {
	console.log('进入处理base64图片')
	// base64图片返回临时本地文件
	const fsm = wx.getFileSystemManager();
	const FILE_BASE_NAME = 'tmp_base64_' + Math.random();
	return new Promise((resolve, reject) => {
		const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
		if (!format) {
			console.log(new Error('ERROR_BASE64SRC_PARSE'))
		}
		const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
		const buffer = wx.base64ToArrayBuffer(bodyData);
		fsm.writeFile({
			filePath,
			data: buffer,
			encoding: 'binary',
			success: () => {
				console.log(filePath)
				resolve(filePath);
			},
			fail: () => {
				reject(new Error('ERROR_BASE64SRC_WRITE'));
			}
		})
	})
}

module.exports = {
	DateDifference,
	haveTimer,
	setTabBarBadge,
	getAllMonth,
	compareVersion,
	repeat,
	replaceEmoji,
	trimStr,
	baseCrypto,
	timeStamp,
	parseTime,
	checkPhone,
	isNumber,
	toDate,
	isNumber,
	saveImageToPhotosAlbum,
	hideNum,
	base64src
}
