<template>
  <view class="zBox">
    <slot></slot>
  </view>
</template>

<!-- <template>
  <div>
    <Tabbar>
      <template v-slot:default>
        <view>这里放入父组件中的内容 121211</view>
      </template>
    </Tabbar>
  </div>
</template> -->


<script>
	
	export default {
		components: {
			
		},
		data() {
			return {
				
			}
		},
		onReady() {
		
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	@import 'pages/index/index.scss'
</style>
