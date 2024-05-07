import request from '../../utils/request';
import api from '../../utils/urlApi';
import { getImageUrl } from '../../utils/request';
let app = getApp();
Page({

  limit: 10,
  offset: 1,
  states: true,
  data: {
    status: 0,
    list: [],
    search_nicht: ''
  },
  merchantId: '',
  isTolives:true,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    this.merchantId = userInfo.merchantId
    this.setData({
      search_nicht: app.globalData.type == 'special' ? 'car_void-' + app.globalData. marchantCode + '.png' : 'car_void.png',
    });
    // this.getOrderList(true)
  },
  getOrderList(isNew) { // 获取订单列表
    if (this.states) {
      wx.showLoading({ title: "加载中..." })
      this.states = false;
      let status = this.data.status == 0 ? '' : this.data.status;
      request({
        url: api.livesp,
        // url: api.orderList,
        data: {
          limit: this.limit,
          offset: this.offset,
          merchantId: this.merchantId,
          broadcastStatus:status
        }
      }).then(async res => {
        console.log(res)
        if (res.code == "I0000") {
          let oldList = this.data.list;
          let newList = res.elements;
          
          for (let i = 0, len = newList.length; i < len; i++) {
            if (newList[i].feedsWechatFileId) {
              newList[i].feedsWechatFile = getImageUrl(newList[i].feedsWechatFileId)
            }
          }
          console.log('newList', newList)
          wx.hideLoading();
          let list = oldList;
          list = oldList.concat(newList);
          if (isNew) {
            this.setData({ list:newList });
          } else {
            this.setData({ list });
          }

          if (newList.length >= this.limit && (this.offset * this.limit) <= res.totalElements) {
            this.states = true;
          } else {
            // if (this.offset > 1) {
            //   wx.showToast({
            //     title: '已加载全部',
            //     icon: 'none'
            //   })
            // }
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
  },
  imageError(e){
    let { idx } = e.currentTarget.dataset;
    let str = `list[${idx}].feedsWechatFile`
    this.setData({[str]:''})
  },
  liveHandle(e){
    let id = e.currentTarget.dataset.id
    // wx.navigateTo({
    //   url: '/pages/lives/detail?roomId='+id,
    // })
    let data = e.currentTarget.dataset.item
    if (data.broadcastStatus == 1 || data.roomNum) {
      let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/lives/lives' }))
      // wx.navigateTo({
      //   url: 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?type=1&room_id='+ data.roomNum+ '&customParams=' + customParams,
      // })
      wx.navigateTo({
        url: '/pages/lives/detail?roomId='+ data.roomNum + '&id='+data.id,
      })
    }
    
  },
  getMore() { // 加载更多
    if (this.states) {
      this.offset += 1;
      this.getOrderList()
    }
  },
  changeStatus(e) { // 切换分类
    let status = e.currentTarget.dataset.idx;
    if(!this.states) {
       this.states = true;
    }
    if (this.offset != 1) {
      this.offset = 1;
    }
    this.setData({
      status,
      // list: []
    })
    this.getOrderList(true)
  },
  shareHandle(){
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
      success: res => {
        console.log('res', res)
      },
      fail: err => {
        console.log('err', err)
      }
    })
  },
  toLives(){
    let roomId = "roomId" // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
    let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 })) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
    // wx.navigateTo({
    //     url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
    // })
    // wx.navigateTo({
    //   url: '/pages/lives/detail?roomId='roomId,
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow', this.isTolives)
    if(!this.states) {
        this.states = true;
    }
    if (this.offset != 1) {
      this.offset = 1;
    }
    this.getOrderList(true)
  },

  onHide: function () {
    console.log('onHide', this.isTolives)
    this.isTolives = !this.isTolives
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  onShareAppMessage() {
    return {
      title: '维本生鲜',
      path: 'pages/lives/lives'
    }
  },
  onShareTimeline(){
    return {
      title: '维本生鲜',
      path: 'pages/lives/lives'
    }
  }
})