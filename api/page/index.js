import request from '../request.js'
// 先对登陆—>我的—>首页—>商品列表—>详情—>购物车—>地址—>下单 这样对咯

//login
export function WxLogin(data) { // 微信登录
	return request({
		url: '/elantra/user/wx_login',
		method: 'POST',
		data
	})
}

export function getPhone(data) { 		// 获取用户绑定的手机号
	return request({
		url: '/elantra/user/get_wx_phone',
		method: 'POST',
		data
	})
}

export function buildPhone(params) { 	// 绑定手机号
	return request({
		url: '/elantra/user/build/phone',
		method: 'GET',
		params
	})
}

export function myDetail(params) { 	// 用户详情
	return request({
		url: '/elantra/user/get/my-detail',
		method: 'GET',
		params
	})
}

export function userReg(data) { 		// 用户注册
	return request({
		url: '/elantra/user/reg',
		method: 'POST',
		data
	})
}

export function updUserInfo(data) { 		// 更新用户信息
	return request({
		url: '/elantra/user/update/user_info',
		method: 'POST',
		data
	})
}


//index.vue
export function goodsList(params) { 	// 商品列表
	return request({
		url: '/elantra/goods/list',
		method: 'GET',
		params
	})
}


//productDetails.vue
export function goodsInfo(params) { 	// 商品详情
	return request({
		url: '/elantra/goods/info',
		method: 'GET',
		params
	})
}

export function infoComments(params) { 	// 某商品下的所有评论
	return request({
		url: '/elantra/comment/list',
		method: 'GET',
		params
	})
}

export function commentNum(params) { 	// 某商品下的所有评论数量
	return request({
		url: '/elantra/comment/list—num',
		method: 'GET',
		params
	})
}

export function shoppingAdd(data) { 		// 添加购物车
	return request({
		url: '/elantra/shopping/add',
		method: 'POST',
		data
	})
}


export function shoppingPage(params) { 	// 购物车列表
	return request({
		url: '/elantra/shopping/page',
		method: 'GET',
		params
	})
}

export function shoppingDel(params) { 	// 删除购物车
	return request({
		url: '/elantra/shopping/del',
		method: 'GET',
		params
	})
}

export function shoppingEditNum(params) { 	// 修改数量
	return request({
		url: '/elantra/shopping/edit-num',
		method: 'GET',
		params
	})
}