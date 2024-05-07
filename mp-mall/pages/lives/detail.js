import request from "../../utils/request"
import api from '../../utils/urlApi';
// let livePlayer = requirePlugin('live-player-plugin')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomId: '',
    width: '100',
    height: 100,
    fontSize: 17,
    color: "#FFFFFF",
    customParams: '',
    backgroundColor: "#6467F0",
    isBack: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options.roomId', options.roomId)
    // this.setData({
    //   roomId: options.roomId,
    //   customParams: encodeURIComponent(JSON.stringify({ path: 'pages/lives/lives' }))
    // })
    this.buriedPoint(options.roomId,options.id)
  },
  buriedPoint(room_id,id){
    console.log('buriedPoint', id)
    livePlayer.getLiveStatus({ room_id })
    .then(res => {
        console.log('res', res)
        request({
          url: api.buriedPoint,
          method: 'post',
          data: {
            id,
            liveStatus: res.liveStatus
          }
        }).then(res => {
          
        })
    }).catch(err => {
        console.log('get subscribe status', err)
    })
    let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/lives/lives' }))
    wx.navigateTo({
      url: 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?type=1&room_id='+ room_id+ '&customParams=' + customParams,
    })
  },
  onHide(){
    this.setData({
      isBack: true
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.isBack) {
      wx.navigateBack({
        delta: '1',
      })
    }
  }
})