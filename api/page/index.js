import request from '../request.js'

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


// storeList.vue
export function pointList(params) { 	// 代收点列表
	return request({
		url: '/elantra/user/address/collection-point/list',
		method: 'GET',
		params
	})
}


//myAddress.vue
export function addressList(params) { 	// 查询用户地址信息
	return request({
		url: '/elantra/user/address/list',
		method: 'GET',
		params
	})
}

export function addressAdd(data) { 	// 添加地址
	return request({
		url: '/elantra/user/address/add',
		method: 'POST',
		data
	})
}

export function addressEdit(data) { 	// 修改地址
	return request({
		url: '/elantra/user/address/edit',
		method: 'POST',
		data
	})
}

export function editDefault(params) { 	// 修改为默认
	return request({
		url: '/elantra/user/address/edit/default',
		method: 'GET',
		params
	})
}

export function addressDel(params) { 	// 删除地址
	return request({
		url: '/elantra/user/address/del',
		method: 'GET',
		params
	})
}

export function categoryList(params) { 	// 分类列表
	return request({
		url: '/elantra/category/list',
		method: 'GET',
		params
	})
}

export function couponList(params) { 	// 查询用户优惠券
	return request({
		url: '/elantra/user/coupon/list',
		method: 'GET',
		params
	})
}

export function couponListTwo(params) { 	// 结算查询用户优惠券
	return request({
		url: '/elantra/user/coupon/list/two',
		method: 'GET',
		params
	})
}

export function orderAdd(data) { 	// 点提交生成待付款订单
	return request({
		url: '/elantra/order/add',
		method: 'POST',
		data
	})
}

export function orderPage(params) { 	// 查看订单列表
	return request({
		url: '/elantra/order/page',
		method: 'GET',
		params
	})
}

export function orderInfo(params) { 	// 查看订单详情
	return request({
		url: '/elantra/order/info',
		method: 'GET',
		params
	})
}

//S:骑手
export function withdrawMoney(params) { 	// 发起提现
	return request({
		url: '/elantra/admin/rider/withdraw/money',
		method: 'GET',
		params
	})
}

export function walletPage(params) { 	// 钱包明细
	return request({
		url: '/elantra/admin/rider/wallet/page',
		method: 'GET',
		params
	})
}

export function RorderPage(params) { 	// 查看订单列表
	return request({
		url: '/elantra/admin/rider/order/page',
		method: 'GET',
		params
	})
}

export function withdrawPage(params) { 	// 提现记录
	return request({
		url: '/elantra/admin/rider/withdraw/page',
		method: 'GET',
		params
	})
}

export function orderEdit(data) { 	// 修改订单状态
	return request({
		url: '/elantra/admin/rider/order/edit',
		method: 'POST',
		data
	})
}
//E:骑手



//S:代收点
export function riderPage(data) { 	// 查看骑手列表
	return request({
		url: '/elantra/admin/collection/rider/page',
		method: 'POST',
		data
	})
}

export function editRider(params) { 	// 设置取消骑手
	return request({
		url: '/elantra/admin/collection/edit/rider',
		method: 'GET',
		params
	})
}

export function DSorderPage(params) { 	// 查看订单列表
	return request({
		url: '/elantra/admin/collection/order/page',
		method: 'GET',
		params
	})
}

export function DSorderInfo(params) { 	// 查看订单详情
	return request({
		url: '/elantra/admin/collection/order/info',
		method: 'GET',
		params
	})
}

export function DSorderEdit(data) { 	// 修改订单状态
	return request({
		url: '/elantra/admin/collection/order/edit',
		method: 'POST',
		data
	})
}

export function DSallocationRider(data) { 	// 订单分配骑手
	return request({
		url: '/elantra/admin/collection/allocation/rider',
		method: 'POST',
		data
	})
}

export function DSwithdrawMoney(params) { 	// 发起提现
	return request({
		url: '/elantra/admin/collection/withdraw/money',
		method: 'GET',
		params
	})
}

export function DSwalletPage(params) { 	// 钱包明细
	return request({
		url: '/elantra/admin/collection/wallet/page',
		method: 'GET',
		params
	})
}

export function DSwithdrawPage(params) { 	// 提现记录
	return request({
		url: '/elantra/admin/collection/withdraw/page',
		method: 'GET',
		params
	})
}


//S:厂里
export function GCorderPage(params) { 	// 查看订单列表
	return request({
		url: '/elantra/admin/factory/order/page',
		method: 'GET',
		params
	})
}

export function GCorderInfo(params) { 	// 查看订单详情
	return request({
		url: '/elantra/admin/factory/order/info',
		method: 'GET',
		params
	})
}

export function GCorderEdit(data) { 	// 修改订单状态
	return request({
		url: '/elantra/admin/factory/order/edit',
		method: 'POST',
		data
	})
}
//E:厂里