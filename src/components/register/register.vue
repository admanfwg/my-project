<template>
  <view class="registerBox">
    <view class="register">
      <view class="selectNickname">
        <view class="name">{{ nickname }}</view>
        <button @click="getNickname"><uni-icons color="white" class="icon" type="refreshempty" size="30"></uni-icons></button>
      </view>
      <view class="selectUsername">
          <view class="name">{{ username }}</view>
          <button @click="getUsername"><uni-icons color="white" class="icon" type="refreshempty" size="30"></uni-icons></button>
      </view>
      <button class="registerBtn" @click="register">注册</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      nickname: '',
      username: '',
      url: '',


    }
  },
  created() {
    this.url = getApp().globalData.serverUrl
    this.getNickname()
    this.getUsername()
  },
  methods: {
    intoGame: function () {
      uni.navigateTo({
        url: '../home/home'
      });
    },
    //向服务器发送get请求获取一个用户名
    getUsername: function () {
      uni.request({
        url: this.url + '/v1/getUsername',
        success: (res) => {
          console.log(res)
          this.username = res.data.username;
        }
      });
    },
     getNickname: function () {
      uni.request({
        url: this.url + '/v1/getNickname',
        success: (res) => {
                console.log(res)
          this.nickname = res.data.nickname;
        }
      });
    },
    //向服务器发送携带用户名和性别参数的post请求，服务器返回toekn和账号username，存储到分别存储到本地和全局变量 
    register: function () {
      uni.request({
        url: this.url + '/v1/register',
        method: 'POST',
        data: {

          nickname: this.nickname,
          gender: true,
          username:this.username,
          password:'123456'
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
        },
        success: (res) => {
          console.log(res.data);

          this.username = res.data.data.username;


          uni.setStorage({
            key: 'token',
            data: res.data.token,
            success: function () {

            }
          });
          uni.setStorage({
            key: 'nickname',
            data: res.data.data.nickname,
            success: function () {

            }
          });
          uni.setStorage({
            key: 'userID',
            data: res.data.data.id,
            success: function () {

            }
          });
          this.intoGame()
        }
      });
    }


  }
}
</script>

<style   lang="scss" scoped>
.registerBox {
  color: #fff;
  width: 80%;
  height: 100%;
 button{
     color:#fff;
 font-weight: 700;
    margin-bottom: 40rpx;
    width: 80%;
    background: linear-gradient(to left, rgba(128,211,248,100%), rgba(0,157,255,100%));
  }
  .register {
    display: flex;
    flex-direction: column;
   justify-content: center;

    .selectNickname,.selectUsername{
      width: 100%;
      display: flex;
      flex-direction: row;
  justify-content: space-between;
  font-weight: 700;
view{
  width: 80%;
}
      button{
        font-size: 10rpx;
        width: 20%;
        height: 50rpx;
        		background-color: #323E52;
           background: #323E52;  
        .icon{
          
          font-weight: 700;
position: relative;
top: -50rpx;
left: -20rpx;
        }
      }
      
    }
 
  }
  .hadRegister{
      font-weight: 700;
 view{
   margin-bottom: 30rpx;
 }
  }
}
</style>