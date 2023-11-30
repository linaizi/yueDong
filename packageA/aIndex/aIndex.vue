<template>
	<view class="allBg">
		<view class="adBox">
			<view class="ad-ban">
				<view class="ban-item" v-for="i in menuArr" :key="i.id" @click="menuClick(i.id)">
					<image :src="i.img" class="item-img"></image>
					<p class="item-p">{{i.name}}</p>
				</view>
			</view>
			
			<view class="adWhite">
				<uni-collapse>
					<uni-collapse-item title-border="none" :border="false" title="经营状况" :open="true">
						<view class="content">
							<view class="timeTab">
								<view v-for="item in timeArr" :key="item.id" :class="['tab',{'tab-act':current == item.id}]" @click="onClickItem(item.id)">
									{{item.name}}
								</view>
							</view>
							<view class="numBox">
								<view class="b-item"><p class="b-n">{{infoData.orderNum||0}}</p>支付订单数</view>
								<view class="b-item"><p class="b-n">{{infoData.payAmount||0}}</p>支付总额(元)</view>
								<view class="b-item"><p class="b-n">{{infoData.closeOrderNum||0}}</p>退款订单数</view>
								<view class="b-item"><p class="b-n">{{infoData.closeAmount||0}}</p>退款总额(元)</view>
								<view class="b-item"><p class="b-n">{{infoData.regUserNum||0}}</p>新注册用户数</view>
								<view class="b-item"><p class="b-n">{{infoData.visitUvNewNum||0}}</p>访问新用户数</view>
								<view class="b-item"><p class="b-n">{{infoData.visitUvNum||0}}</p>访问人数</view>
								<view class="b-item"><p class="b-n">{{infoData.visitPvNum||0}}</p>总访问量</view>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
			<view class="adWhite">
				<uni-collapse>
					<uni-collapse-item title-border="none" :border="false" title="站点销售情况">
						<view class="content">
							<view class="zdTab">
								<view class="zd-item">
									<view class="item-txt">站点:</view>
									<view class="item-rt">
										<uni-data-select
											placeholder="请选择站点" 
											v-model="zdParam.cid" 
											:localdata="cateData">
										</uni-data-select>
									</view>
								</view>
								<view class="zd-item">
									<view class="item-txt">日期:</view>
									<view class="item-rt">
										<uni-data-select
											placeholder="请选择日期" 
											v-model="zdParam.type" 
											@change="cateChange"
											:localdata="timeData">
										</uni-data-select>
									</view>
								</view>
								<view class="zd-item" v-if="zdParam.type==5">
									<view class="item-txt">自定义:</view>
									<Datetime-Picker v-model="zdyTime" type="daterange" rangeSeparator="至" />
								</view>
								<view class="zd-item">
									<view class="item-btn" @click="subClick"> 查 询 </view>
								</view>
							</view>
							<view class="numBox">
								<view class="b-item"><p class="b-n">{{zdData.orderNum||0}}</p>支付订单数</view>
								<view class="b-item"><p class="b-n">{{zdData.orderPayAmount||0}}</p>支付总额(元)</view>
								<view class="b-item"><p class="b-n">{{zdData.afterNum||0}}</p>退款订单数</view>
								<view class="b-item"><p class="b-n">{{zdData.afterPayAmount||0}}</p>退款总额(元)</view>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
			
		</view>
			
		<Pgtab :tabid="1"></Pgtab>
	</view>
</template>

<script>
	import Pgtab from "../components/pgtab/pgtab.vue"
	import { operateReport, AuserList, collectionReport } from '@/api/page/manage.js'
	import DatetimePicker from "@/packageA/uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.vue"
	
	export default {
		components: {
			DatetimePicker,
			Pgtab
		},
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				mid: uni.getStorageSync('mid'),
				menuArr: [
					{name:"提现审核", id:1,	img:this.$BASE_URLS.FILE_BASE_URL+"/438c369d-80a9-41ce-a2d8-6b43b04780eb.png"},
					{name:"评论管理", id:2,	img:this.$BASE_URLS.FILE_BASE_URL+"/14862a4b-1145-4f76-8265-d9492207f9a8.png"},
					{name:"用户管理", id: 3,	img:this.$BASE_URLS.FILE_BASE_URL+"/cc6c1f69-e610-42de-b359-25cad1b889a4.png"},
					{name:"优惠券管理", id:4,  img:this.$BASE_URLS.FILE_BASE_URL+"/233bda21-5ade-4c7a-ad7c-11c88dbb695d.png"},
				],
				timeArr: [
					{name:'今日', id:1},
					{name:'昨天', id:2},
					{name:'7日', id:3},
					{name:'30日', id:4},
				],
				current: 1,
				infoData:{},
				zdParam:{},
				cateData:[],
				timeData:[
					{
						text: '今日',
						value: 1,
						
					},
					{
						text: '昨日',
						value: 2,
						
					},
					{
						text: '7日',
						value: 3,
						
					},
					{
						text: '本月',
						value: 4,
					},
					{
						text: '自定义时间',
						value: 5,
					},
				],
				zdyTime: [],
				zdData: {}
			}
		},
		onReady() {
			this.initData()
		},
		methods: {
			initData(){
				operateReport({ type:this.current }).then((res) => {
					if(res.code == 200){
						this.infoData = res.data;						
					}
				});
				
				let param = {
					pageNo: 1,
					pageSize: 50,
					level: 3
				}
				AuserList(param).then((res) => {
					if (res.code === 200) {
						this.cateData = res.data.map(option => {
							return {
								value: option.uid,
								text: option.userAddress&&option.userAddress.shopName ? option.userAddress.shopName : option.nickName,
							};
						});
					}
				})
			},
			
			menuClick(id){
				let url=''
				switch(id) {
					case 1:
						url='/packageA/tiXian/tiXian'
						break;
					case 2:
						url='/packageA/aPingLun/aPingLun'
						break;
					case 3:
						url='/packageA/userMan/userMan'
						break;
					case 4:
						url='/packageA/aCouponMan/aCouponMan'
						break;
				} 
				
				uni.navigateTo({
				    url
				});
			},
			
			onClickItem(cur) {
			  if (this.current != cur) {
				this.current = cur;
				this.initData()
			  }
			},	
					
			cateChange(){
				this.zdyTime = []
			},
			
			subClick(){
				if(!this.zdParam.cid){
					uni.showToast({ title: '请选择站点', icon:'none' });
					return;
				}
				if(!this.zdParam.type){
					uni.showToast({ title: '请选择日期', icon:'none' });
					return;
				}
				if(this.zdParam.type==5&&this.zdyTime.length==0){
					uni.showToast({ title: '请选择时间', icon:'none' });
					return;
				}
				
				if(this.zdParam.type==5){
					[this.zdParam.beginTime, this.zdParam.endTime] = this.zdyTime
				}
				
				collectionReport(this.zdParam).then((res) => {
					if (res.code === 200) {
						this.zdData = res.data;
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import 'aIndex.scss'
</style>
