<template>
  <view class="content">


    <uni-forms class="firstLogin" v-if="!token.length" >
      <uni-forms-item iconColor="#fff" label="账号"  >
        <uni-easyinput v-model="username"  placeholder="请输入账号" />
      </uni-forms-item>
      <uni-forms-item label="密码" >
        <uni-easyinput type="password" v-model="password" placeholder="请输入密码" />
      </uni-forms-item>
      <button class="loginBtn" @click="login">登录</button>
    </uni-forms>
    <view class="login" v-else>
      以 {{ nickname }} 身份登录
      <button class="loginBtn" @click="navigateToHome">登录</button>
    </view>
  </view>
</template>

<script>

export default {

  data() {
    return {

      token: '',
      url: '',
      username: '',
      password: '',
      nickname: ''
    }
  },
  created() {

    this.url = getApp().globalData.serverUrl

    let that = this
    uni.getStorage({
      key: 'token',
      success: function (res) {
        that.token = res.data

      }
    })

    uni.getStorage({
      key: 'nickname',
      success: function (res) {
        that.nickname = res.data

      }
    })

  },
  methods: {
    navigateToHome: function () {
      uni.navigateTo({
        url: '../home/home'
      });
    },
    login: function () {
      uni.request({
        url: this.url + '/v1/login',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',//自定义请求头信息

        },
        data: {
          username: this.username,
          password: this.password
        },
        success: (res) => {
          console.log(res.data);

        }
      });
    }
  }
}
</script>

<style  lang="scss" scoped>
.content {
  color: #fff;
  width: 80%;
  height: 100%;


  .firstLogin{

  }
  .login{
  font-weight: 700;
    background-color: #323E52;
  }
  .loginBtn{
    color:#fff;
    margin-top: 40rpx;
    margin-bottom: 40rpx;
    width: 80%;
    background: linear-gradient(to left, rgba(128,211,248,100%), rgba(0,157,255,100%));
  }
}
</style>