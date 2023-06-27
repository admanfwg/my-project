<template>
  <view>
    <view v-for="card in msg1.specialCards" :key="card.id">
      <button @click="selectSpecialCard(card)">{{ card.Type }}</button>
    </view>
    <view v-show="seen1">
      <view v-for="numberCard in numberCards" :key="numberCard.id">
        <button @click="selectNumber(numberCard)">{{ numberCard }}</button>
      </view>
    </view>
    <view v-show="seen2">
      <view v-for="user in msg2.users" :key="user.id">
        <button @click="selectUser(user)">选人{{ user.userID }}</button>
      </view>
    </view>
    <view v-show="seen3">
      <view v-for="card in targetUser.baseCards" :key="card.id">
        <button @click="selectChangedCard(card.cardID)">选seen3{{ card.Number }}</button>
      </view>
    </view>
    <view v-show="seen4">
      <view v-for="card in targetUser.baseCards" :key="card.id">
        <button @click="selectYourNumber(card.cardID)">选seen4{{ card.Number }}</button>
      </view>
    </view>
  </view>
</template>

<script>
import store from '@/store/index.js';//需要引入store
import { object } from '@dcloudio/vue-cli-plugin-uni/packages/postcss/tags';
export default {
  props: {
    msg1: Object,
    msg2: Object
  },
  data() {

    return {
      cardID: 0,
      type: 0,
      numberCards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      seen1: false,
      seen2: false,
      seen3: false,
      seen4:false,
      targetUser: {},

      useSpecialData: {
        specialCardID: 0,
        addCardID: { needNumber: 0 },
        updateCardData: {
          targetUserID: 0,
          cardID: 0,
          updateNumber: 0
        },
        deleteCardData: {
          targetUserID: 0,
          cardID: 0
        },
        changeCardData: {
          cardID: 0,
          targetUserID: 0,
          targetCard: 0
        }
      }
    }
  },
 
  methods: {
    selectSpecialCard: function (msg) {
      if (msg.Type == 1) {
        this.seen1 = true

      }
      else {
        this.seen2 = true
      }

      this.useSpecialData.specialCardID = msg.CardID
      console.log(msg)
      this.type = msg.Type
    },
  
    selectNumber: function (msg) {
      this.seen1=false
      if (this.type == 1) {
        
        this.useSpecialData.addCardID.needNumber = msg
        console.log("增加")
     
      }
      var data = { type:512,
        useSpecialData: this.useSpecialData }
  
      store.state.websocket.send(JSON.stringify(data))
      
    },
    selectYourNumber: function (msg) {
      if (this.type == 8) {

        this.useSpecialData.changeCardData.cardID = msg
        console.log("交换")
        var data = {
          type: 512,
          useSpecialData: this.useSpecialData
        }

        store.state.websocket.send(JSON.stringify(data))
        console.log("交换")

      }
    },
    selectUser: function (msg) {
      this.seen2 = false
      // let targetUser = msg.data.users.filter(function (item) {
      //   return item.userID == msg.username
      // })
      this.targetUser = msg
   
       console.log(this.targetUser)
      if (this.type == 2) {
        this.seen3 = true
          console.log("de")
        this.useSpecialData.deleteCardData.targetUserID = msg.userID
      }
      if (this.type == 4) {
        this.seen3 = true
          console.log("up")
        this.useSpecialData.updateCardData.targetUserID = msg.userID
      }

      if (this.type == 8) {
        this.seen4 = true
          console.log("ch")
        this.useSpecialData.changeCardData.targetUserID = msg.userID
      }
      console.log("选人成功")
    },
    selectChangedCard: function (msg) {
         this.seen3 = false
      if (this.type == 2) {
  
        this.useSpecialData.deleteCardData.cardID = msg
        console.log("删除")
              var data = {
          type: 512,
          useSpecialData: this.useSpecialData
        }

        store.state.websocket.send(JSON.stringify(data))
        console.log("删除")
      }
      if (this.type == 4) {

        this.useSpecialData.updateCardData.cardID = msg
        console.log("更新")
              var data = {
          type: 512,
          useSpecialData: this.useSpecialData
        }

        store.state.websocket.send(JSON.stringify(data))
        console.log("更新")

      }
      if(this.type==8){
        this.useSpecialData.changeCardData.targetCard = msg.cardID
     
        this.targetUser = this.msg1
        this.seen4 = true
      }

      console.log(this.useSpecialData)
    }

  }
}
</script>

<style></style>