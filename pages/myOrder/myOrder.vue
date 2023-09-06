<template>
	<view class="allBg">
		<view class="order-top">
			<view v-for="(item,index) in listArr" :key="index" class="topItem" @click="topClick(index)">
				<span :class="{'topItem-act':index==topNum}">{{item.title}}</span>
			</view>
		</view>
		
		<view class="pdlist-Box flex" style="margin-top: 0;">
			<scroll-view class="top-left" scroll-x="true" scroll-with-animation :scroll-left="scrollLeft">
				<span class="top-left-span" v-for="(item,index) in listArr" :key="index" :class="{'p-active' :listId == index}" @click="listClick(index)">{{item.title}}</span>
			</scroll-view>
		</view>
		
	</view>
</template>

<script>
	
	export default {
		components: {
			
		},
		data() {
			return {
				listArr:[
					{title:"全部", catid:1},
					{title:"待付款", catid:2},
					{title:"已付款", catid:3},
					{title:"准备清洗", catid:4},
					{title:"正在清洗", catid:5},
					{title:"清洗完成", catid:6},
					{title:"已完成", catid:7},
				],
				topNum:0,
				
				showCard: [], //组件显示
				drawCard: [], //组件渲染
				activeIndex: 0, //当前显示的卡片索引,默认第一张显示
				contentScrollW: 0, // 导航区宽度
				listId: 0, // 当前选中
				scrollLeft: 0, // 横向滚动条位置
			}
		},
		onReady() {
			this.getScrollW()
		},
		methods: {
			topClick(i){
				this.topNum = i;
			},
			
			// 获取标题区域宽度，和每个子元素节点的宽度以及元素距离左边栏的距离
			getScrollW() {
			  const query = uni.createSelectorQuery().in(this);
			 
			  query.select('.top-left').boundingClientRect(data => {
					 // 拿到 scroll-view 组件宽度
					 this.contentScrollW = data.width
			  }).exec();
				
			  query.selectAll('.top-left-span').boundingClientRect(data => {
					 let dataLen = data.length;
					 for (let i = 0; i < dataLen; i++) {
							 //  scroll-view 子元素组件距离左边栏的距离
							 this.listArr[i].left = data[i].left;
							 //  scroll-view 子元素组件宽度
							 this.listArr[i].width = data[i].width
					 }
			  }).exec()
			},
			
			listClick(i){
				if (i === this.activeIndex) {
					return //重复点击不生效
				}
				// 将上一张卡片隐藏
				this.$set(this.showCard,this.activeIndex,false)
				// 切换下一张卡片显示
				this.$set(this.drawCard,i,true)
				this.$set(this.showCard,i,true)
				// 更新索引
				this.activeIndex = i
				
				this.listId = i;
				
				let resultSpot = this.listArr[i].left + this.listArr[i].width / 2 - this.contentScrollW / 2 //最终要停留的点
				this.scrollLeft = resultSpot;
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	@import 'myOrder.scss'
</style>
