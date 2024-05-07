const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    version: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({version: app.globalData.accountInfo.miniProgram.version});
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: app.globalData.name
    })
  }
})