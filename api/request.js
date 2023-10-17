import axios from 'axios'
import Qs from 'qs'

//配置api接口地址
// var url = "http://10.100.1.29:7777"  
var url = "https://www.yuedongxixie.com"  

const $axios = axios.create({
	baseURL : url,
	timeout: 30000
})

$axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

//请求拦截，在每个请求发出去之前，针对每个域名做不同的配置
$axios.interceptors.request.use(
	config => {
		//post请求data转Qs
		// uni.showLoading({
		// 	title: '加载中...',
		// 	mask:true,
		// });
		config.headers['mid'] = uni.getStorageSync('mid');
		if (config.method.toLowerCase() === 'post' || config.method.toLowerCase() === 'put') {
			config.data = Qs.stringify(config.data);
		}
		return config
	}, 
	error => {
	    Promise.reject(error)
	}
)

// 响应拦截器
$axios.interceptors.response.use(
	res => {
		// uni.hideLoading();
		if (res.status == 200) {
			if(res.data['code'] && ![200,5001,5002].includes(res.data.code)){
				uni.showToast({ title: res.data.message||res.data.msg, icon:'none' })
			}
			if(res.data['code'] && res.data.code==500 && res.data.msg == "该用户无权限"){
				uni.switchTab({
				    url: '/pages/index/index'
				});
			}
		}
		
		if (!res.data) {
			return Promise.reject(res)
		}
		
    return res.data	    
	},
	error => {
		// console.dir(error);
		let message = error.message
			
		if (error.errMsg === 'ECONNABORTED' || message === 'Network Error') {
		    message = '未打开WiFi或蜂窝网络'
		}else{
			message = '连接异常，请稍后重试'
		}
		
		uni.showToast({ title: message, icon:'none' })
		
		return Promise.reject(error)
	}  
	
)

// 在main.js中放入这段自定义适配器的代码，就可以实现uniapp的app和小程序开发中能使用axios进行跨域网络请求，并支持携带cookie
axios.defaults.adapter = function(config) { 
    return new Promise((resolve, reject) => {
        var settle = require('axios/lib/core/settle')
        var buildURL = require('axios/lib/helpers/buildURL')
        uni.request({
            method: config.method.toUpperCase(),
            url: config.baseURL + buildURL(config.url, config.params, config.paramsSerializer),
            header: config.headers,
            data: config.data,
            dataType: config.dataType,
            responseType: config.responseType,
            sslVerify: config.sslVerify,
            complete: function complete(response) {
                response = {
                    data: response.data,
                    status: response.statusCode,
                    errMsg: response.errMsg,
                    header: response.header,
                    config: config
                }

                settle(resolve, reject, response)
            }
        })
    })
}

export default $axios

