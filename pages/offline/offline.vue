<template>
	<view class="offline">
		<view class="hero" :style="{ paddingTop: statusBarH + 24 + 'px' }">
			<view class="deco deco-a"></view>
			<view class="deco deco-b"></view>
			<view class="brand">跃动洗鞋</view>
			<view class="badge">小程序暂不使用</view>
			<text class="lead">感谢你一直以来的支持。线上点单已暂时关闭，添加客服微信即可继续预约洗鞋。</text>
		</view>

		<view class="card">
			<view class="card-kicker">现在这样下单</view>
			<view class="card-title">扫码添加跃动洗鞋客服</view>
			<text class="card-sub">长按二维码识别添加，或先保存再用微信扫一扫</text>
			<view class="qr-wrap" @click="previewQr">
				<image
					class="qr"
					src="/static/ewm.png"
					mode="widthFix"
					:show-menu-by-longpress="true"
					@click.stop="previewQr"
				></image>
			</view>
			<view class="save-btn" hover-class="save-btn-hover" hover-stay-time="120" @click="saveQr">
				保存二维码到相册
			</view>
		</view>

		<view class="steps">
			<view class="step" v-for="item in steps" :key="item.n">
				<view class="step-n">{{ item.n }}</view>
				<text class="step-t">{{ item.t }}</text>
			</view>
		</view>

		<text class="foot">洗护服务照常进行，换个入口继续为你服务</text>
	</view>
</template>

<script>
	import { preservationImg } from '@/common/tool.js'

	const QR_SRC = '/static/ewm.png'

	export default {
		data() {
			return {
				statusBarH: 20,
				steps: [
					{ n: '1', t: '长按识别' },
					{ n: '2', t: '添加客服' },
					{ n: '3', t: '发图下单' }
				]
			}
		},
		onLoad() {
			try {
				const sys = uni.getSystemInfoSync()
				this.statusBarH = sys.statusBarHeight || this.statusBarH
			} catch (e) {
				const app = getApp()
				if (app && app.globalData && app.globalData.statusBarH) {
					this.statusBarH = app.globalData.statusBarH
				}
			}
		},
		onShareAppMessage() {
			return {
				title: '跃动洗鞋 · 添加客服即可下单',
				path: '/pages/offline/offline'
			}
		},
		methods: {
			previewQr() {
				uni.previewImage({
					urls: [QR_SRC],
					current: QR_SRC
				})
			},
			saveQr() {
				preservationImg(0, QR_SRC)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import 'offline.scss';
</style>
