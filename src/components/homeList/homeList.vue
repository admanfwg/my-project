<template>
  <view>
    <view class="roomBox" v-for="item in obj" :key="item.id">
      <view class="roomMsg">{{ item.roomID }} - {{ item.userNumber }}</view>
      <button class="joinBtn" @click="userIntoRoom(item.roomID)">加入</button>
    </view>
  </view>
</template>
<script>
import { METHODS } from 'http';
import store from '@/store/index.js';//需要引入store
import WebsocketTask from '@/static/socket/socket.js'
export default {
  props: {
    msg: String,
    isGetRoomList: Boolean,


  },
  data() {
    return {

      url: '',
      token: '',
      obj: {},
      timer: null
    }
  },
  computed: {
    a: function () {
      return this.isGetRoomList
    }
  },
  created() {

    this.url = getApp().globalData.gameUrl
    this.token = this.msg
    if (this.isGetRoomList && !this.timer) {

      this.timer = setInterval(() => {
        console.log(this.isGetRoomList)
        this.getRoomList()

      }, 10000)
    }



  },
  beforeDestroy() {


    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }


  },
  methods: {


    getRoomList: function () {
      uni.request({
        url: this.url + '/v1/getRoomList',

        header: {
          'token': this.token
        },
        success: (res) => {

          this.obj = res.data.data

        }
      });
    },

    userIntoRoom: function (msg) {
      let websocket = new WebsocketTask('ws://8.134.163.22:8083/v1/userIntoRoom?room_id=' + msg + '&token= ' + this.token, 5000)
      store.commit("updateWebsocket", websocket)


    },




  },
  // watch: {
  //   isGetRoomList: {

  //     handle: function (newVal, oldVal) {
  //       console.log(this.isGetRoomList)
  //       if (this.isGetRoomList && !this.timer) {

  //         this.timer = setInterval(() => {
  //           console.log(this.isGetRoomList)
  //           this.getRoomList()
  //           if (!this.isGetRoomList) {
  //             if (this.timer) {
  //               clearInterval(this.timer)
  //               this.timer = null
  //             }

  //           }
  //         }, 10000)

  //       }
  //     },
  //     deep: true
  //   }

  // }


}

</script>

<style lang="scss" scoped>
.roomBox {
  width: 90%;
  height: 15%;
  border-radius: 20rpx;
  display: flex;
  flex-direction: row;
  background-color: #202835;
  margin-top: 20rpx;
  transform: translateX(-50%);
  position: absolute;
  left: 50%;

  .roomMsg {
    color: #fff;
    font-weight: 700;
    width: 60%;

    padding: 20rpx;
  }

  .joinBtn {
    margin-top: 2.5%;
    width: 25%;
    height: 80%;
    background: linear-gradient(to bottom, rgba(1, 167, 240, 100%), rgba(128, 211, 248, 100%));
  }
}
</style>