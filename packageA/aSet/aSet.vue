<template>
	<view class="allBg">
		<image :src="FILE_BASE_URL + '/d884200d-c3dc-4864-afc3-d7d476c9099b.jpg'" mode="bottom" class="aSet-img"></image>
		<view class="aset-top">
			<view class="top-tx">
				<image src="https://file.aikbao.com/20230619140350568" class="tx-img"></image>
			</view>
			<view class="top-txt">跃动洗涤</view>
		</view>
		
		<view class="aset-main" v-if="list.length>0">
			<view class="mian-item" v-for="(item,index) in list" :key="index">
				<uni-icons type="wallet-filled" color="#DAAD70" size="42rpx" v-if="index==0"></uni-icons>
				<uni-icons type="spinner-cycle" color="#576AFC" size="44rpx" v-else-if="index==1"></uni-icons>
				<uni-icons type="wallet" color="#FBC027" size="44rpx" v-else-if="index==2"></uni-icons>
				<uni-icons type="settings-filled" color="#FC9D63" size="44rpx" v-else></uni-icons>
				<view class="item-rt" @click="setClick(index)">
					<view class="rt-l">{{item.remark}}</view>
					<view class="rt-r">{{item.value}}
					 <span v-if="index==0">天</span> 
					 <span v-else-if="index==1">分钟</span> 
					 <span v-else-if="index==2">元</span> 
					 <span v-else>%</span> 
					 <uni-icons color="#999" type="right" size="28rpx"></uni-icons></view>
				</view>
			</view>
		</view>
		
		<uni-popup ref="setPopup" type="center">
			 <view class="setPpBox" v-if="list.length>0">
				 <view class="set-title">{{list[setNum].remark}}</view>
				 <view class="set-tm">
					 <view class="tm-ipt"><input type="text" v-model="iptVal" class="set-ipt"></view>
					 <span v-if="setNum==0">天</span>
					 <span v-else-if="setNum==1">分钟</span> 
					 <span v-else-if="setNum==2">元</span> 
					 <span v-else>%</span>
				 </view>
				 
				 <view class="pp-btn">
					 <view class="btn1" @click="djClose">取消</view>
					 <view class="btn1 blue" @click="djYes">确认</view>
				 </view>
			 </view>
		 </uni-popup>
		
		<Pgtab :tabid="4"></Pgtab>
	</view>
</template>

<script>
	import { AsettingList,AsettingEdit } from '@/api/page/manage.js'
	import Pgtab from "../components/pgtab/pgtab.vue"
	export default {
		components: {
			Pgtab
		},
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				list:[],
				setNum:0,
				iptVal:0
			}
		},
		onReady() {
			this.initData()
		},
		methods: {
			initData(){
				AsettingList().then((res) => {
					if(res.code == 200){
						this.list = res.data;
					}
				})
			},
			
			setClick(index){
				this.setNum = index;
				if(index==3){
					const a = JSON.parse(this.list[index].value);
					this.iptVal = a.join(',')
				}else{
					this.iptVal = this.list[index].value;
				}
				
				this.$refs.setPopup.open();
			},
			djClose(){
				this.$refs.setPopup.close();
			},
			djYes(){
				uni.showModal({
					title:"温馨提示",
					content:"是否确定修改?",
					confirmText:"确定",
					success: (res)=> {
						if (res.confirm) {
							let param = {
								name: this.list[this.setNum].name,
								value: this.iptVal
							}
							if(this.setNum==3)
							 param.value = '[' + param.value + ']'
							
							AsettingEdit(param).then((res) => {
								if(res.code == 200){
									uni.showToast({title:"修改成功",icon:'success'})
									this.initData(); 
									this.$refs.setPopup.close();
								}
							})
						} else if (res.cancel) {}
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'aSet.scss'
</style>
