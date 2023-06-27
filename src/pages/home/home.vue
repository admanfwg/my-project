<template>
  <view class="content">
    <view class="tapBar">{{ nickname }}
      <!-- <image src="img"></image> -->
    </view>

    <view class="home" v-if="seen">
      <button class="createRoomBtn" @click=" isSearch = false,isCreateRoom = true">创建房间</button>
      <button class="searchRoomBtn" @click="isSearch = true, isCreateRoom = false">搜索房间</button>


      <view class="homeList" v-show="!isCreateRoom && !isSearch">
        <homeList :msg="token" :isGetRoomList="!isCreateRoom && !isSearch" > </homeList>
      </view>


    </view>
    <view v-if="isSearch" class="searchRoom">
      <uni-easyinput :styles="styles" type="number" v-model="room_id" placeholder="请输入房间号"></uni-easyinput>
      <view class="btnBox">
        <button class="joinRoom" @click="userIntoRoom">加入房间</button>
        <button class="cancel" @click="isSearch = false">取消</button>
      </view>

    </view>
    <createRoom @getType="getType" class="createRoom" :msg="token" v-if="isCreateRoom && seen"></createRoom>

    <view v-if="!seen">
      <room :msg1="this.obj" :msg2="token"></room>

    </view>
  </view>
</template>

<script>
import homeList from '@/components/homeList/homeList.vue';
import room from '@/components/room/room.vue'
import WebsocketTask from '@/static/socket/socket.js'
import store from '@/store/index.js';//需要引入store
import createRoom from '@/components/createRoom/createRoom.vue';
import { th } from '@dcloudio/vue-cli-plugin-uni/packages/postcss/tags';
export default {

  data() {
    return {
      styles: {
        color: '#fff',
        backgroundColor: '#323E52',


      },
      b: '1',
      text: true,
      id: '',
      img: '',
      nickname: '',
      isSearch: false,
      isBlackRoom: false,
      room_id: 0,
      seen: true,
      url: '',
      reconnectUrl: '',
      obj: {},
      isCreateRoom: false,
      type: 0,
      token: ''
    }
  },

  onLoad(option) {
    this.url = getApp().globalData.gameUrl
    this.isBlackRoom = option.isBlackRoom


  },
  beforeMount() {
    try {
      const value = uni.getStorageSync('token');
      if (value) {

        this.token = value

      }
    } catch (e) {
      // error
      console.log(e)
    }
    try {
      const value = uni.getStorageSync('nickname');
      if (value) {

        this.nickname = value

      }
    } catch (e) {
      // error
      console.log(e)
    }
    try {
      const value = uni.getStorageSync('userID');
      if (value) {

        this.id = value

      }
    } catch (e) {
      // error
      console.log(e)
    }
    // getImg()

    if (this.isBlackRoom) {

      this.isBlackRoom = false
      uni.request({
        url: this.url + '/v1/selectUserState',

        header: {
          'token': this.token
        },

        success: (res) => {

          if (res.data.data == 1) {
            let websocket = new WebsocketTask('ws://8.134.163.22:8083/v1/reconnect?token=' + this.token, 5000)
            store.commit("updateWebsocket", websocket)

            let data = { type: 16 }
            setTimeout(() => {
              websocket.send(JSON.stringify(data))


            }, 2000);
            this.seen = false


          }
        }
      })
    }



  },
  leave: function () {
    this.type = 4
    var data = { type: this.type }
    store.state.websocket.send(JSON.stringify(data))
    this.seen = true
  },
  methods: {
    // getImg:function(){
    //   uni.request({
    //     url: this.url + '/v1/downloadImage',
    //        header: {
    //       'token': this.token
    //     },
    //     data:{
    //       id:this.id
    //     },
    //     success: (res) => {
    //       console.log(res)
    //       this.img = res.data.file;

    //     }
    //   });
    // },
    
    getType: function (cancel) {
      this.isCreateRoom = cancel

    },
    async seenChange(msg) {

      this.seen = msg;

    },
    userIntoRoom: function () {
      let websocket = new WebsocketTask('ws://8.134.163.22:8083/v1/userIntoRoom?room_id=' + this.room_id + '&token=' + this.token, 5000)
      store.commit("updateWebsocket", websocket)

    },







  },

  watch: {

    "$store.state.isReceive": {

      handler: function (val, oldVal) {

        if (store.state.isReceive) {
          var msg = JSON.parse(decodeURIComponent(store.state.receiveMsg.data))
          if (msg.data.msgType == 4) {
            this.obj = msg;
            this.seen = false

            store.commit("updateIsReceive", false)
            store.commit("updateReceiveMsg", "")
          }



        }
      },
      deep: true
    },
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: 100vh;
  background-color: #202835;
  display: flex;
  flex-direction: column;
  color: white;
  font-weight: 700;

  .tapBar {
    height: 90rpx;
    line-height: 90rpx;
    margin-left: 20rpx;


  }

  .home {
    margin-top: 60rpx;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: 100%;

    button {



      box-shadow: 0rpx 6rpx 12rpx white;
      size: 40rpx;
      text-align: center;
      line-height: 150rpx;
      width: 246rpx;
      height: 150rpx;
      color: white;
      box-shadow: 0rpx 6rpx 12rpx white;
    }

    .createRoomBtn {
      margin-left: 80rpx;
      background: linear-gradient(to bottom, rgba(236, 128, 141, 100%), rgba(249, 205, 144, 100%));
    }

    .searchRoomBtn {
      margin-right: 80rpx;
      background: linear-gradient(to bottom, rgba(1, 167, 240, 100%), rgba(128, 211, 248, 100%));
    }

    .homeList {
      position: relative;
      right: -50%;
      transform: translateX(-50%);
      height: 75%;
      width: 80%;
      background-color: #323E52;
      border-radius: 20rpx;
    }
  }

  .searchRoom {


    position: relative;
    right: -50%;
    top: -30%;
    transform: translateX(-50%);

    width: 70%;
    background-color: #283142;
    border-radius: 20rpx;

    .btnBox {
      display: flex;
      flex-direction: row;

      button {



        box-shadow: 0rpx 6rpx 12rpx white;
        size: 40rpx;
        text-align: center;
        line-height: 150rpx;
        width: 200rpx;
        height: 150rpx;
        color: white;
        box-shadow: 0rpx 6rpx 12rpx white;
      }


      .joinRoom {
        margin-top: 80rpx;

        background: linear-gradient(to bottom, rgba(236, 128, 141, 100%), rgba(249, 205, 144, 100%));
      }

      .cancel {
        margin-top: 80rpx;

        background: linear-gradient(to bottom, rgba(1, 167, 240, 100%), rgba(128, 211, 248, 100%));
      }
    }
  }


  .createRoom {
    position: relative;
    right: -50%;
    top: -20%;
    transform: translateX(-50%);
    height: 60%;
    width: 80%;
    background-color: #283142;
    border-radius: 20rpx;
  }

  .leave {
    position: absolute;
    top: 22%;
    right: 15%;
    size: 40rpx;
    text-align: center;
    line-height: 150rpx;
    width: 246rpx;
    height: 150rpx;
    color: white;
    box-shadow: 0rpx 6rpx 12rpx white;
    background: linear-gradient(to bottom, rgba(1, 167, 240, 100%), rgba(128, 211, 248, 100%));
  }

}
</style>