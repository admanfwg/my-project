// 页面路径：store/index.js 
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);//vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
  state: {//存放状态
    "isReceive": false,
    "receiveCount": 0,
    "receiveMsg": "",
    "websocket": {},
  },
  mutations: {
    updateWebsocket(state, ws) {
      state.websocket = ws
    },
    updateIsReceive(state, val) {
      state.isReceive = val
    },
    updateReceiveCount(state, val) {
      state.receiveCount = val
    },
    updateReceiveMsg(state, val) {
      state.receiveMsg = val
    },
  }
})
export default store
