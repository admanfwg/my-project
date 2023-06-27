<template>
	<view class="content">
		<view class="icon"><image src="../../static/logo.png" mode="center"></image></view>
		<view class="loginBox">
			<view class="changeBox">
				<view class="loginButton" @click="seen = false"   v-bind:class="[{ seenClass: !seen }, notSeenClass]">登录</view>
				<view @click="seen = true" class="registerButton"  v-bind:class="[{ seenClass: seen }, notSeenClass]">注册</view>

			</view>

			<register class="register" v-if="seen"></register>
			<login class="login" v-if="!seen"></login>
		</view>


	</view>
</template>

<script>
import login from '@/components/login/login.vue'
import register from '@/components/register/register.vue'
export default {

	data() {
		return {
			seen: false,
	
		}
	},
	onLoad() {
		 
	},
	
	methods: {

	}
}
</script>

<style lang="scss" scoped>
.content {

	height: 100vh;
	background-color: #202835;
image{
	width: 100%;
}
	.loginBox {
		border: 0rpx solid #000;
		border-radius: 20rpx;
		margin: 0 -40%;
		position: absolute;
		right: 50%;
		bottom: 300rpx;
		width: 80%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		background-color: #323E52;

		.changeBox {
			flex: 1;
		border: 2rpx solid #009DFF;
			width: 50%;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			margin-left: 30rpx;
			margin-bottom: 60rpx;
			margin-top: 24rpx;
			border-radius: 30rpx;
			view {
				text-align: center;
				font-size: 28rpx;
				font-weight: 700;
				line-height: 68rpx;
		
				color: #fff;
				width: 100%;
				height: 68rpx;
			
			}
			.loginButton {
				border-top-left-radius: 30rpx;
				border-bottom-left-radius: 30rpx;
			}
				.registerButton {
				border-top-right-radius: 30rpx;
				border-bottom-right-radius: 30rpx;
			}

			.seenClass {
				
 background: linear-gradient(to left, rgba(128,211,248,100%), rgba(0,157,255,100%));
			}
			.notSeenClass {
				
					background-color: #323E52;
			}
		
		}
		.login {
			margin-top: 40rpx;
			margin-left: 10%;
			flex: 3;
			
		}
		.register {
				margin-top: 40rpx;
			margin-left: 10%;
			flex: 3;
		}


	}



}</style>
