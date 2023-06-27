import store from '@/store/index.js';//需要引入store

// 创建 websocket.js文件
export default class WebsocketTask {
  constructor(url, time) {
    this.url = url
    this.data = ''
    this.type = 0
    this.isOpenSocket = false
    // 心跳检测
    this.timeout = time
    this.heartbeat = null

    try {
      return this.connectSocketInit()
    } catch (e) {
      this.isOpenSocket = false
      this.reconnect();
    }
  }

  init() {
    let funcs = {}
    funcs["1"] = () => {
      that.obj = JSON.parse(decodeURIComponent(res.data));
      that.seen = false
    }
    funcs["2"] = () => {

    }
    funcs["3"] = () => { }
    return funcs
  }

  connectSocketInit() {
    this.socketTask = uni.connectSocket({
      url: this.url,
      method: 'GET',
      success: (res) => {
        console.log("连接成功", res)
      },
      fail: (res) => {
        console.log("连接失败11", res)
      }
    })

    this.socketTask.onOpen((res) => {
      console.log('WebSocket连接已打开！', res);
      clearTimeout(this.heartbeat);
      this.isOpenSocket = true
      this.start();
      this.socketTask.onMessage((res) => {
        store.commit("updateIsReceive", true)
        store.commit("updateReceiveCount", store.state.receiveCount + 1)
        store.commit("updateReceiveMsg", res)
        console.log("收到消息：", res.data);


      })
    })



  }

  //发送消息
  send(data) {
    this.socketTask.send({
      data: data,
      success: (res) => {
        console.log("发送成功", res)
      },
      fail: (res) => {
        console.log("发送失败", res)
      }
    })
  }
  //开启心跳检测
  start() {
    this.heartbeat = setTimeout(() => {
      this.type = 1
      this.data = { type: this.type }
      this.send(JSON.stringify(this.data));
    }, this.timeout)
  }
  // 重新连接
  reconnect() {
    clearInterval(this.heartbeat)
    if (!this.isOpenSocket) {
      setTimeout(() => {
        this.connectSocketInit();
      }, 3000)
    }
  }



}