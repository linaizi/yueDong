<template>
	<view class="allBg">
		<view class="adBox">
			<view class="adWhite">
				<uni-collapse>
					<uni-collapse-item title-border="none" :border="false" title="经营状况" :open="true">
						<view class="content">
							<view class="zdTab">
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
			<view class="adWhite">
				<uni-collapse>
					<uni-collapse-item title-border="none" :border="false" title="极速处理" :open="true">
						<view class="content">
							<view class="numBox">
								<view class="b-item" @click="goOrder"><p class="b-n">{{numData.undistributedNum||0}}</p>未分配数量</view>
								<view class="b-item" @click="goOrder"><p class="b-n">{{numData.notPickedUpNum||0}}</p>未取货数量</view>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
			
		</view>
			
	</view>
</template>

<script>
	import { DSreport,DShandle } from '@/api/page/index.js'
	import DatetimePicker from "@/pagesR/uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.vue"
	
	export default {
		components: {
			DatetimePicker,
		},
		data() {
			return {
				FILE_BASE_URL: this.$BASE_URLS.FILE_BASE_URL,
				zdParam:{
					type:1
				},
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
				zdData: {},
				numData: {},
			}
		},
		onReady() {
			this.subClick()
			this.getNum()
		},
		methods: {
			cateChange(){
				this.zdyTime = []
			},
			
			subClick(){
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
				
				DSreport(this.zdParam).then((res) => {
					if (res.code === 200) {
						this.zdData = res.data;
					}
				})
			},
			
			goOrder(){
				uni.navigateTo({
				    url:'/pagesR/roleOrder/roleOrder'
				});
			},
			
			getNum(){
				DShandle().then((res) => {
					if (res.code === 200) {
						this.numData = res.data;
					}
				})
			}
		},
		
		//下拉刷新
		onPullDownRefresh() {
			this.subClick()
			this.getNum()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		
	}
</script>

<style lang="scss" scoped>
	@import 'siteIndex.scss'
</style>
