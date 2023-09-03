import request from '../request.js'

//index.vue
export function getIndex(params) { // 首页信息
	return request({
		url: '/miniapp/index',
		method: 'GET',
		
		params
	})
}

export function getGoods(authorization,params) {		// 商品好货推荐榜单
	return request({
		url: '/miniapp/goods/v1/recommend',
		method: 'GET',
		headers: {
			authorization,
		},
		params
	})
}

export function getHots(authorization,params) { 		// 商品今日热销榜单
	return request({
		url: '/miniapp/goods/v1/today-top',
		method: 'GET',
		headers: {
			authorization,
		},
		params
	})
}

export function JzSearch(authorization,params) { 		// 商品精确搜索
	return request({
		url: '/miniapp/goods/v1/accurate-search',
		method: 'GET',
		headers: {
			authorization,
		},
		params
	})
}

export function indexTransfer(authorization,data) { 		// 金刚区活动转链
	return request({
		url: '/miniapp/activity/transfer',
		method: 'POST',
		headers: {
		    authorization,
		},
		data
	})
}


export function miniCmdTransfer(authorization,data) { 		// 口令转换  首页弹窗-保留原文案
	return request({
		url: '/miniapp/v2/cmd/transfer',
		method: 'POST',
		headers: {
		    authorization,
		},
		data
	})
}



//login
export function WxLogin(data) { 		// 微信登录
	return request({
		url: '/miniapp/check_third_auth',
		method: 'POST',
		data
	})
}

export function getOpenId(data) { 		// 获取用户open_id
	return request({
		url: '/miniapp/code_to_session',
		method: 'POST',
		data
	})
}

export function mobileLog(data) { 		// 授权手机号后调用接口
	return request({
		url: '/miniapp/check_bind_mobile',
		method: 'POST',
		data
	})
}

export function logBind(data) { 		// 登录并绑定
	return request({
		url: '/miniapp/comfirm_bind_mobile',
		method: 'POST',
		data
	})
}

export function getPhone(data) { 		// 获取用户绑定的手机号
	return request({
		url: '/miniapp/get_wx_phone',
		method: 'POST',
		data
	})
}


//searchGoods.vue
export function PTsearch(authorization,data) { 		// 商品普通搜索
	return request({
		url: '/miniapp/goods/v1/ordinary-search',
		method: 'POST',
		headers: {
		  authorization,
		},
		data
	})
}


//productDetails.vue
export function getDetail(authorization,params) { 		// 商品详情
	return request({
		url: '/miniapp/goods/v1/detail',
		method: 'GET',
		headers: {
		  authorization,
		},
		params
	})
}

export function getDetailNotLog(params) { 		// 商品详情
	return request({
		url: '/miniapp/goods/v1/detail/not-login',
		method: 'GET',
		params
	})
}

export function getJdDetails(authorization,params) { 		// 获取京东商品详情图片接口
	return request({
		url: '/miniapp/goods/v1/get_jd_details',
		method: 'GET',
		headers: {
		  authorization,
		},
		params
	})
}

export function pddTransfer(authorization,data) { 		// 拼多多商品转链
	return request({
		url: '/miniapp/pdd/transfer',
		method: 'POST',
		headers: {
		  authorization,
		},
		data
	})
}

export function jdTransfer(authorization,data) { 		// 京东商品转链
	return request({
		url: '/miniapp/jd/transfer',
		method: 'POST',
		headers: {
		  authorization,
		},
		data
	})
}

export function tbTransfer(authorization,params) { 		// 淘宝商品转链
	return request({
		url: '/miniapp/tb/transfer',
		method: 'GET',
		headers: {
		  authorization,
		},
		params
	})
}

export function dyTransfer(authorization,data) { 		// 抖音商品转链
	return request({
		url: '/miniapp/dy/transfer',
		method: 'POST',
		headers: {
		  authorization,
		},
		data
	})
}

export function wphTransfer(authorization,data) { 		// 唯品会商品转链
	return request({
		url: '/miniapp/vip/transfer',
		method: 'POST',
		headers: {
		  authorization,
		},
		data
	})
}

//myOrder.vue
export function getOrderList(authorization,params) { 		// 订单列表
	return request({
		url: '/miniapp/order/list',
		method: 'GET',
		headers: {
		  authorization,
		},
		params
	})
}


//mine.vue
export function getPreview(authorization,params) { 		// 查询我的收益
	return request({
		url: '/miniapp/income/preview',
		method: 'GET',
		headers: {
		  authorization,
		},
		params
	})
}

export function getPersonalData(authorization,params) { 		// 我的个人信息查询
	return request({
		url: '/miniapp/get_personal_data',
		method: 'GET',
		headers: {
			authorization,
		},
		params
	})
}

export function updatePersonalData(authorization,data) { 		// 我的个人信息更新
	return request({
		url: '/miniapp/update_personal_data',
		method: 'POST',
		headers: {
		  authorization,
		},
		data
	})
}



//bindPhone.vue
export function checkPhone(data) { 		// 检测手机号是否可以注册
	return request({
		url: '/miniapp/send_vcode_after_bind',
		method: 'POST',
		data
	})
}

export function sendVcode(data) { 		// 发送验证码
	return request({
		url: '/miniapp/send_vcode',
		method: 'POST',
		data
	})
}

export function checkVcode(data) { 		// 检查验证码并登录
	return request({
		url: '/miniapp/check_vcode',
		method: 'POST',
		data
	})
}



// browseRecords.vue
export function getUserFoot(authorization,params) { 		// 浏览记录
	return request({
		url: '/miniapp/goods/v1/user-foot',
		method: 'GET',
		headers: {
		    authorization,
		},
		params
	})
}

export function getMallClassify(params){  //获取商城分类
    return request({
        url:'/miniapp/v1/mallClassify',
        method: 'GET',
        params
    })
}

/* export function getGoodsList(authorization,params){  //商品列表
    return request({
        url:'/miniapp/goods/v1/goods/list',
        method: 'GET',
				headers: {
				    authorization,					
				},
        params
    })
} */

export function getGoodsList(authorization,data){  //商品列表
    return request({
        url:'/miniapp/goods/v1/interactive/goods/list',
        method: 'POST',
				headers: {
				    authorization,
				},
        data
    })
}

export function favoritesAdd(authorization,params){  //添加收藏夹
    return request({
        url:'/miniapp/v1/favorites/add',
        method: 'GET',
				headers: {
				    authorization,
				},
        params
    })
}

export function favoritesDel(authorization,params){  //删除收藏夹
    return request({
        url:'/miniapp/v1/favorites/del',
        method: 'GET',
				headers: {
				    authorization,
				},
        params
    })
}

export function favoritesPage(authorization,params){  //收藏夹列表
    return request({
        url:'/miniapp/v1/favorites/page',
        method: 'GET',
				headers: {
				    authorization,
				},
        params
    })
}

export function batchDelFavoritesParams(authorization,data){  //批量删除收藏夹
    return request({
        url:'/miniapp/v1/favorites/del/batch',
        method: 'POST',
				headers: {
				    authorization,
						'Content-Type':'application/json'  
				},
        data
    })
}

export function baoKuanList(authorization,params){  //爆款列表
    return request({
        url:'/miniapp/v1/recommend/product/page',
        method: 'GET',
				headers: {
						authorization,
				},
        params
    })
}

export function teamSearch(authorization,data){  //好友列表 
    return request({
        url:'/miniapp/team/search',
        method: 'POST',
				headers: {
				    authorization,
						'Content-Type':'application/json' 
				},
        data
    })
}


export function getIfFollow(authorization,params){  //是否关注公众号
    return request({
        url:'/miniapp/get_if_follow_data',
        method: 'GET',
				headers: {
				    authorization,
				},
        params
    })
}


export function getWechatEwm(authorization,data){  //获取小程序商品二维码
    return request({
        url:'/miniapp/goods/v1/wechat_micro_program_code',
        method: 'POST',
				headers: {
						authorization,
				},
				responseType:'arraybuffer',
        data
    })
}

export function getWechatParam(params){  // 通过key获取小程序码信息
    return request({
        url:'/miniapp/goods/v1/get/wechat_micro_program_code/param',
        method: 'GET',
        params
    })
}


//风控状态：
export function fkBanner(params){  //banner图
    return request({
        url:'/miniapp/goods/v1/castration/jd/banner',
        method: 'GET',
        params
    })
}


export function indexSmp(params){  //首页数据
    return request({
        url:'/miniapp/index/smp',
        method: 'GET',
        params
    })
}


export function fkCategory(authorization,params){  // 获取分类
    return request({
        url:'/miniapp/goods/v1/castration/jd/self-support/category',
        method: 'GET',
				headers: {
						authorization,
				},
        params
    })
}


export function fkList(authorization,params){  // 获取商品列表
    return request({
        url:'/miniapp/goods/v1/castration/jd/list',
        method: 'GET',
				headers: {
						authorization,
				},
        params
    })
}






