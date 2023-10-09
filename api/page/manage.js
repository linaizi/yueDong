import request from '../request.js'

export function operateReport(params) { 	// 经营状况
	return request({
		url: '/elantra/admin/operate/report',
		method: 'GET',
		params
	})
}



export function goodsList(params) { 	// 商品列表
	return request({
		url: '/elantra/admin/goods/list',
		method: 'GET',
		params
	})
}

export function goodsDel(data) { // 商品删除
	return request({
		url: '/elantra/admin/goods/del',
		method: 'POST',
		data
	})
}

export function goodsAdd(data) { // 商品新增
	return request({
		url: '/elantra/admin/goods/add',
		method: 'POST',
		data
	})
}

export function goodsEdit(data) { // 商品修改
	return request({
		url: '/elantra/admin/goods/edit',
		method: 'POST',
		data
	})
}

export function editGoodsStatus(params) { 	// 修改商品状态
	return request({
		url: '/elantra/admin/goods/edit/goods_status',
		method: 'GET',
		params
	})
}




export function commentPage(params) { 	// 评论列表
	return request({
		url: '/elantra/admin/comment/page',
		method: 'GET',
		params
	})
}

export function commentDel(params) { 	// 删除评论
	return request({
		url: '/elantra/admin/comment/del',
		method: 'GET',
		params
	})
}

export function commentEditTop(params) { 	// 置顶
	return request({
		url: '/elantra/admin/comment/edit/top',
		method: 'GET',
		params
	})
}

export function commentReply(params) { 	// 回复评论
	return request({
		url: '/elantra/admin/comment/reply',
		method: 'GET',
		params
	})
}



export function AorderPage(data) { // 查看订单列表
	return request({
		url: '/elantra/admin/order/page',
		method: 'POST',
		data
	})
}

export function AorderInfo(params) { 	// 查看订单详情
	return request({
		url: '/elantra/admin/order/info',
		method: 'GET',
		params
	})
}

export function AorderEdit(data) { // 修改订单状态
	return request({
		url: '/elantra/admin/order/edit',
		method: 'POST',
		data
	})
}




export function AuserList(data) { // 用户列表
	return request({
		url: '/elantra/admin/user/list',
		method: 'POST',
		data
	})
}

export function AeditLevel(data) { // 更改用户等级
	return request({
		url: '/elantra/admin/user/edit/level',
		method: 'POST',
		data
	})
}

export function AuserBlock(data) { // 拉黑用户
	return request({
		url: '/elantra/admin/user/block',
		method: 'POST',
		data
	})
}




export function AsettingList(data) { // 配置列表
	return request({
		url: '/elantra/admin/setting/list',
		method: 'POST',
		data
	})
}

export function AsettingEdit(data) { // 修改配置
	return request({
		url: '/elantra/admin/setting/edit',
		method: 'POST',
		data
	})
}



export function AwithdrawPage(params) { 	// 申请提现列表
	return request({
		url: '/elantra/admin/withdraw/page',
		method: 'GET',
		params
	})
}



export function AcouponList(params) { 	// 优惠券列表
	return request({
		url: '/elantra/admin/coupon/list',
		method: 'GET',
		params
	})
}
