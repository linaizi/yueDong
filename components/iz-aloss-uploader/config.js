var config = {
  //aliyun OSS config
  uploadImageUrl: 'https://www.yuedongxixie.com/elantra/img/file-upload',//阿里云上传域名
  AccessKeySecret: '***',//Secret，登录oss控制台查看
  OSSAccessKeyId: '***',//KeyId，登录oss控制台查看
  timeout: 100000,
  maxSize: 8 * 1024 * 1024 //上传文件的大小限制,8mb
};
module.exports = config
