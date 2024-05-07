import api from '../../utils/urlApi';
import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: '1',
    list: []
  },
  toReceive(){
    wx.navigateTo({
      url: '/pages/coupon/receive'
    })
  },
  tabHandle(e){
    let { val } = e.currentTarget.dataset;
    let tab = this.data.tab;
    if (tab != val) {
      this.setData({tab: val})
    }
  },
  onLoad: function (options) {
    
  },
  getList(){
    request({
      url: api.mycoupons,
      method: 'get'
    }).then(res => {
      console.log('res', res)
      if (res.code == "I0000") {
        this.setData({
          list: res.elements,
        })
      }
    })
  },
  toPathHandle(e) {
    let { url } = e.currentTarget.dataset;
    wx.switchTab({
      url
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})