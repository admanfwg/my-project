<template>
  <view class="content">
    <view  v-if="countDown == 0">即将开始计时</view>
    <view class="time" v-if="countDown != 0">
      <view>现在是{{ showText }}</view>
      <view>{{ countDown }}</view>
    </view>


    <view  v-for="item in rival" :key="item.id">
      <view>
        <view>头像</view>
        <!-- 根据userid调接口获取用户信息再渲染 -->
        <view>{{ item.score }}</view>
      </view>
      <view class="rival">
        <view v-for="card in item.baseCards" :key="card.id">
          <view>{{ card.Number }}</view>
        </view>
        <view v-for="card in item.specialCards" :key="card.id">
            <view v-if="card.Type == 1">A</view>
            <view v-if="card.Type == 2">D</view>
            <view v-if="card.Type == 4">U</view>
            <view v-if="card.Type == 8">C</view>
        </view>
      </view>
    </view>

    <view class="cardPool">
      <view v-for="item in obj.randCard" :key="item.id">
        <button v-if="item.type == 0" @click="getCard(item.baseCardCardInfo.CardID)">{{ item.baseCardCardInfo.Number
        }}普通卡</button>
        <!-- 这里要清空卡池 1024是抢牌开始 2048是功能牌开始 256是结束积分 512是回到房间-->
        <button v-if="item.type == 1" @click="getCard(item.specialCardInfo.CardID)">{{ item.specialCardInfo.Type
        }}特殊卡</button>
      </view>
    </view>
    <view class="myself">
      <view>
        <view>头像</view>
        <view>{{ myself.score }}</view>
      </view>
      <view>
        <view class="card" v-for="card in myself.baseCards" :key="card.id">
          <view>{{ card.Number }}</view>
        </view>

        <cardPackage class="cardPackage" v-if="seen" :msg1="myself" :msg2="obj"></cardPackage>
      </view>
    </view>
    <Rank v-if="isShowRank" :msg1="rank" :msg2="token"></Rank>
  </view>
</template>

<script>

import store from '@/store/index.js';//需要引入store
import Rank from '../../components/Rank/Rank.vue'
import cardPackage from '../../components/cardPackage/cardPackage.vue';
import { th, time } from '@dcloudio/vue-cli-plugin-uni/packages/postcss/tags';

export default {

  data() {
    return {
      token: '',
      rank: {},
      isShowRank: false,
     countDown: 0,
      seen: false,
      type: 0,
      obj: {},
      username: 0,
      rival: {},
      myself: {},
      getCardData: {
        getCardID: 0
      },

    }
  },
  created() {
    this.url = getApp().globalData.gameUrl
    let that = this
    uni.getStorage({
      key: 'token',
      success: function (res) {
        that.token = res.data

      }
    })
    uni.getStorage({
      key: 'userID',
      success: function (res) {
        that.username = res.data

      }
    })
  },


  methods: {
     countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown = this.countDown- 1
          this.countDownTimer()
        }, 1000)
      }
    },


    getCard: function (res) {

      this.type = 256
      this.getCardData.getCardID = res

      console.log(res)
      var data = {
        type: this.type,
        getCardData: this.getCardData
      }
      store.state.websocket.send(JSON.stringify(data))
    },

  },
  watch: {

    "$store.state.receiveCount": {

      handler: function (val, oldVal) {

        if (store.state.isReceive && store.state.receiveCount > 0) {
          var msg = JSON.parse(decodeURIComponent(store.state.receiveMsg.data))
          if (msg.data.msgType == 32) {
            let rival = []
            let myself = {}
            for (var i = 0; i < msg.data.users.length; i++) {
              if (msg.data.users[i].userID != this.username) {
                rival.push(msg.data.users[i])

              }
              else
                myself = msg.data.users[i]

            }
            this.rival = rival


            this.myself = myself

            this.rival = rival
            this.myself = myself
            if (this.obj != null) {
              if (this.obj.randCard != null)
                this.obj.randCard.splice(0, this.obj.randCard.length)
            }
            this.obj = msg.data;
            console.log('33', rival)
            console.log('333', msg)
            store.commit("updateIsReceive", false)
            store.commit("updateReceiveCount", 0)
            store.commit("updateReceiveMsg", "")
          }
          else if (msg.data.msgType == 256) {
            this.rank = msg.data.rank
            this.isShowRank = true
          }

          else if (msg.data.msgType == 1024) {
            this.countDown = 0
            this.countDown = msg.data.duration / 1000000000

            this.showText = "现在是抽卡阶段"
            this.countDownTimer()

          }
          else if (msg.data.msgType == 2048) {
            this.countDown = 0
            this.countDown = msg.data.duration / 1000000000
            this.showText = "现在是特殊卡阶段"
            this.countDownTimer()
          }




        }
      },
      deep: true
    },
    
  },
  onLoad() {
    // console.log(this.obj);
  }
}
</script>

<style  lang="scss" scoped> 
.content{
    background-color: #202835;
  height: 100vh;
    display: flex;
  flex-direction: column;
    color: white;
  font-weight: 700;
  .rival:nth-child(1):nth-child(n){
    width: 100rpx;
    height: 140rpx;
    background-color: #fff;
    color: #000;
    font-size: 44rpx;
  }
  .cardPool{
    position: relative;
    top: 40%;
    margin-left: 5%;
    width: 90%;
    height: 40%;
    background-color: #323E52;
    border-radius: 20rpx;
         display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    .cardPool:nth-child(1){
 
        display: inline-block;
    }
    button{
      display: inline-block;
         width: 100rpx;
         margin: 50rpx;
    height: 140rpx;
    background-color: #fff;
    color: #000;
    font-size: 44rpx;
    }
  }
  .myself{
    position: relative;
    top: 40%;
    .card{
            width: 100rpx;
         margin: 50rpx;
    height: 140rpx;
    background-color: #fff;
    color: #000;
    font-size: 44rpx;
    
    }
    .cardPackage{
      width: 100rpx;
         margin: 50rpx;
    height: 140rpx;
    }
  }

}
</style>