<template>
	<view class="allBg">
		<view class="maddrBox">
			<div class="searchNo" v-if="list.length == 0">
				<img src="https://file.aikbao.com/20230525172214852" alt="" />
				<p>附近数据~</p>
			</div>
			
			<template v-else>
				<view class="maddr-item" v-for="item in list" :key="item.id">
					<view class="top">
						<view class="top-l">收货人：{{item.name}}</view>
						<view class="top-r">{{item.phone}}</view>
					</view>
					<view class="mid">收货地址: {{item.address}} {{item.houseNumber}}</view>
					<view class="foot">
						<view :class="['foot-l',{'foot-l-red':item.ifDefault}]" @click="setMr(item)">
							<view class="circle mr10"><image src="../../static/img/maddr1.png" mode="widthFix" v-if="item.ifDefault" class="w100"></image></view>
							{{item.ifDefault?"已设为默认":"设为默认"}}
						</view>
						<view class="foot-r">
							<view class="r-item" @click="editClick(item)"><uni-icons type="compose" size="40rpx" color="#999"></uni-icons>编辑</view>
							<view class="r-item" @click="delClick(item.id)"><uni-icons type="trash" size="40rpx" color="#999"></uni-icons>删除</view>
						</view>
					</view>
				</view>
			</template>
			
			<view class="maddr-foot">
				<view class="maddr-btn" @click="goSetaddr"><uni-icons type="plus-filled" size="44rpx" color="#fff"></uni-icons><view class="btn-txt">手动添加</view></view>
			</view>
		</view>
		
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="center" 
				cancelText="取消" 
				confirmText="确定" 
				title="温馨提示" 
				content="确定删除当前地址?" 
				@confirm="dialogConfirm"
				@close="dialogClose">
			</uni-popup-dialog>
		</uni-popup>
		
	</view>
</template>

<script>
	import { addressList,editDefault,addressDel } from '@/api/page/index.js'
	export default {
		data() {
			return {				
				list:[],
				id:'',
			}
		},
		onShow() {
			this.getAddr()	
		},
		methods: {
			getAddr(){
				addressList({ addressType:1 }).then((res) => {
					if(res.code == 200){
						this.list = res.data
					}
				});
			},
			
			editClick(item){
				uni.navigateTo({
				   url: '/pages/setAddress/setAddress?item=' + JSON.stringify(item)
				})
			},
			
			delClick(id){
				this.$refs.alertDialog.open();
				this.id = id;
			},
			dialogConfirm() {
				addressDel({ id:this.id }).then((res) => {
					if(res.code == 200){
						this.getAddr()
					}
				});
			},
		
			dialogClose() {
				this.id = '';
			},
						
			setMr(obj){
				let param = {
					id: obj.id,
					type: obj.ifDefault ? 2 : 1
				}
				editDefault(param).then((res) => {
					if(res.code == 200){
						this.getAddr()
					}
				});
			},
			goSetaddr(){
				uni.navigateTo({
				   url: '/pages/setAddress/setAddress',
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'myAddress.scss'
</style>
