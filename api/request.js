import axios from 'axios'
import Qs from 'qs'

//配置api接口地址
// var url = 'http://47.119.112.12'
// var url = "https://testapi.aikbao.com"
var url = "https://newapi.aikbao.com"  //正式环境

const $axios = axios.create({
	baseURL : url,
	timeout: 30000
})

$axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'

//请求拦截，在每个请求发出去之前，针对每个域名做不同的配置
$axios.interceptors.request.use(
	config => {
		//post请求data转Qs
		config.headers['Mini-Agent'] = uni.getStorageSync('miniAgent')
		if (config.method.toLowerCase() === 'post' || config.method.toLowerCase() === 'put') {
			if(config.url.indexOf('favorites/del/batch')!=-1 || config.url.indexOf('team/search')!=-1){
					config.data = JSON.parse(config.data)
			}else{
					config.data = Qs.stringify(config.data);
			}
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
		if (res.status == 200) {
			if(res.data['code'] && res.data.code != 200 && res.data.code != -10004){
				uni.showToast({ title: res.data.message, icon:'none' })
			}else if(res.data['meta'] && res.data.meta.code != 200 && res.data.meta.code != 49999 && res.data.meta.code != -1004 && res.data.meta.code != -10004 && res.data.meta.code != 49998){
				uni.showToast({ title: res.data.meta.msg, icon:'none' })
				return Promise.reject(res)
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
		let code = error.response.status
		
		let isGoLog = false;
			
		if (error.errMsg === 'ECONNABORTED' || message === 'Network Error') {
		    message = '未打开WiFi或蜂窝网络'
		}else{
			message = '连接异常，请稍后重试'
		}
		
		if(code === 401 ){
			console.log('token已过期,请重新登录')
			// message = 'token已过期,请重新登录'
			isGoLog = true;
		}
		
		if(isGoLog){
			setTimeout(res=>{
				uni.navigateTo({
				    url: '/pages/login/authorize'
				});
			},1000)
		}else{
			uni.showToast({ title: message, icon:'none' })
		}
		
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

