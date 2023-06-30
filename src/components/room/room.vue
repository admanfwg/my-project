<template>
  <view class="content">


    <view class="uer" v-for="item in msg1.data.users" :key="item.id">

      <view class="useIcon">头像</view>
      <view class="userName">id{{ item.ID }}</view>
      <button v-if="seen && item.ID != msg1.data.roomOwner" @click="removeUser(item.ID)">踢人</button>
      <view class="static" v-if="!seen && readyState.isReady">已准备</view>
    </view>
    <view class="control">
      <view v-if="seen">
        <view>房主设置<button>设置</button></view>
        <view>房主开始<button class="start" @click="star">开始</button></view>
        
      </view>
      <view v-if="!seen" @click="ready"><button @click="ready">准备</button></view>
      <button class="leave" @click="leave">退出</button>
    </view>
  </view>
</template>

<script>
import { object, th } from '@dcloudio/vue-cli-plugin-uni/packages/postcss/tags';
import store from '@/store/index.js';//需要引入store



export default {
  props: {
    msg1: Object,
    msg2: String
  },
  data() {

    return {

      token: '',

      seen: false,
      type: 0,
      userID: 0,
      deleteData: {
        roomID: ''
      },
      updateData: {
        maxUserNumber: 0,
        gameCount: 0,
        owner: 0,
        kicker: 0
      },
      roomData: {
        roomID: ''
      },
      readyState: { isReady: false },
      beginGame: { roomID: '' }


      // 32


    }
  },
  created() {
    this.token = this.msg2
    let that = this
    uni.getStorage({
      key: 'userID',
      success: function (res) {
        that.userID = res.data

      }
    })

    console.log(this.msg1.data.roomOwner)
    if (this.msg1.data.roomOwner == this.userID) {

      this.seen = true
    }

  },

  methods: {
    star: function () {
      console.log("开始")
      this.type = 64
      var data = { type: this.type }
      store.state.websocket.send(JSON.stringify(data))
      uni.redirectTo({
        url: '../game/game',
        complete(res) {
          console.log("3", res)
        }
      },

      );
    },

    removeUser: function (id) {//未完成
      this.type = 8
      this.updateData.kicker = id
      var data = {
        type: this.type,
        updateData: this.readyState
      }
      store.state.websocket.send(JSON.stringify(data))

    }
  },
  ready: function () {
    this.readyState.isReady = true
    this.type = 32
    var data = {
      type: this.type,
      updateData: this.readyState
    }
    store.state.websocket.send(JSON.stringify(data))



  },
  watch: {

    "$store.state.isReceive": {

      handler: function (val, oldVal) {

        if (store.state.isReceive) {
          var msg = JSON.parse(decodeURIComponent(store.state.receiveMsg.data))

          if (msg.data.msgType == 4) {
            this.msg1 = msg;



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
.content{
display: flex;

.control {

  display: flex;
  flex-direction: row;
  button {
    margin: 40rpx 0;

    size: 40rpx;
    text-align: center;
    line-height: 150rpx;
    width: 246rpx;
    height: 150rpx;
    color: white;
    box-shadow: 0rpx 6rpx 12rpx white;
    
  }
  .start{
    position: relative;
    left: 5%;
    top: 1%;
    margin-left: 80rpx;
    background: linear-gradient(to bottom, rgba(236, 128, 141, 100%), rgba(249, 205, 144, 100%));
  }
  .leave{
      position: relative;
    right: -5%;
    top: 1%;
    margin-right: 80rpx;
    background: linear-gradient(to bottom, rgba(1, 167, 240, 100%), rgba(128, 211, 248, 100%));
  }

}
}
</style>