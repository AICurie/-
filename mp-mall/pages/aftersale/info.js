// pages/aftersale/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  toIndex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  toList(){
    wx.redirectTo({
      url: '/pages/order/invalid',
    })
  }
})