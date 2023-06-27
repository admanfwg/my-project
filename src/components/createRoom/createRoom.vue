<template>
  <view class="content">
      <view class="selectBox">
        房间名
        <uni-easyinput :styles="styles" :inputBorder="false" placeholder="房间名" type="text" @input="inputName"></uni-easyinput>
      </view>
    <view class="selectBox">
      房间号
      <uni-easyinput :styles="styles" :inputBorder="false" placeholder="房间号" type="number" @input="inputNumber"></uni-easyinput>
    </view>
    <view class="selectBox">
      人数
      <uni-data-select class="select" v-model="number" :localdata="maxUserNumber" @change="numberChange" :clear="false">
      </uni-data-select>
    </view>
    <view class="selectBox">
      回合数
      <uni-data-select class="select" v-model="count" :localdata="gameCount" @change="countChange" :clear="false">
      </uni-data-select>
    </view>
    <view class="controlBtn">
       <button class="ensure" @click="createRoom">确定</button>
      <button class="cancel" @click="cancel">取消</button>
    </view>
   
  </view>
</template>

<script>
import store from '@/store/index.js';//需要引入store
import WebsocketTask from '@/static/socket/socket.js'
export default {
  props: {
    msg: String,

  },
  data() {
    return {
      styles: {
        color: '#fff',
        backgroundColor: '#323E52',


      },
      roomName:'',
      isCancel: false,
      token: '',
      url: '',
      room_id: 0,
      number: 0,
      count: 0,
      maxUserNumber: [
        { value: 1, text: "1" },
        { value: 2, text: "2" },
        { value: 3, text: "3" },
        { value: 4, text: "4" },
      ],
      gameCount: [
        { value: 1, text: "1" },
        { value: 5, text: "5" },
        { value: 10, text: "10" },
        { value: 15, text: "15" },
        { value: 20, text: "20" },
      ],
    };
  },
  created() {
    this.url = getApp().globalData.gameUrl
    this.token = this.msg

  },
  methods: {
    cancel: function () {
      this.$emit('getType', this.isCancel)
  
    },
    numberChange(e) {

      this.number = e
    },
    countChange(e) {

      this.count = e
    },
    inputNumber(e) {
      console.log(e)
      this.room_id = e
      console.log(this.room_id)
    },
        inputName(e) {
      console.log(e)
      this.roomName = e
      console.log(this.roomName)
    },
    createRoom: function () {
      this.room_id=parseInt(this.room_id)
      if ((this.room_id != 0) && (this.number != 0) && (this.count != 0) && (this.roomName != null)) {
        uni.request({
          url: this.url + '/v1/createRoom',
          method: 'POST',
          header: {
            'token': this.token,
            'content-type': "application/x-www-form-urlencoded"
          },
          
          data: {
            room_id: this.room_id,
            max_user_number: this.number,
            game_count: this.count,
            room_name:this.roomName
          },
          success: (res) => {
            console.log(res.data);
            if (!res.data.err)
              this.userIntoRoom()
            else console.log(res.data.err)
          },

        });
      }

    },
    userIntoRoom: function () {
      let websocket = new WebsocketTask('ws://8.134.163.22:8083/v1/userIntoRoom?room_id=' + this.room_id + '&token=' + this.token, 5000)
      store.commit("updateWebsocket", websocket)

    },
  },

}
</script>

<style  lang="scss" scoped>
.content {
  background-color: #283142;

  .selectBox {
    margin: 20rpx 5%;
    width: 90%;
  }
  .controlBtn{
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

  .ensure {
    position: relative;
    left: -5%;
    top: 1%;
    margin-left: 80rpx;
    background: linear-gradient(to bottom, rgba(236, 128, 141, 100%), rgba(249, 205, 144, 100%));
  }

  .cancel {
    position: relative;
    right: -5%;
    top: 1%;
    margin-right: 80rpx;
    background: linear-gradient(to bottom, rgba(1, 167, 240, 100%), rgba(128, 211, 248, 100%));
  }
  }


  .select {
    background-color: #323E52;
    color: #000;
  }
}</style>