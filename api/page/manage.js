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


