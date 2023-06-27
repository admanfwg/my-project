<template>
  <view class="content">
    <view v-for="user in msg1" :key="user.id">
      {{ user.UserID }}-{{ user.Score }}
    </view>
    <button @click="backRome">返回房间</button>
  </view>
</template>

<script>
export default {
  props: {
    msg1: Array,
     msg2: String,

  },
  data(){
    return{
         url: '',
         token: '',
    }
  },
    created() {
    this.url = getApp().globalData.gameUrl
    this.token= this.msg2

  },
  methods: {
    backRome: function ()  {
      uni.request({
        url: this.url + '/v1/selectUserState',

        header: {
          'token': this.token
        },

        success: (res) => {
          console.log(res.data.data);
          if (res.data.data) {

            setTimeout(() => {
              uni.redirectTo({
                url: '../../pages/home/home?isBlackRoom=true',
                complete(res) {
                  console.log("回到大厅", res)
                }
              },

              );
            }, 2000);
          }
        }
      })
    }
  }
}
</script>

<style  lang="scss" scoped>
.content{
  background-color: #fff;
  width: 80%;
  height: 50%;
  color: #000;
  button{
    width: 50%;
  }
}
</style>