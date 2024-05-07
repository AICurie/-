let app = getApp();
import request from '../../utils/request';
import api from '../../utils/urlApi';
Page({
  data: {
    mobile:'',
    version: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({version: app.globalData.accountInfo.miniProgram.version + " " + app.globalData.accountInfo.miniProgram.envVersion});
    request({
      url:api.getMobile
    }).then(res => {
      console.log(res)
      if(res.code == "I0000") {
          this.setData({mobile:res.data})
      }
    })
  },
  call(){
    wx.makePhoneCall({phoneNumber:this.data.mobile})
  },
  onShareAppMessage: function () {
    if (app.globalData.type == "single") {
      return {
        title: app.globalData.name || "维本生鲜",
        path:'/pages/cellars/cellars'
      }
    } else {
      return {
        title: app.globalData.name || "维本生鲜",
        path:'/pages/index/index'
      }
    }
  },
  onShareTimeline: function() {
    if (app.globalData.type == "single") {
      return {
        title: app.globalData.name || "维本生鲜",
        path:'/pages/cellars/cellars'
      }
    } else {
      return {
        title: app.globalData.name || "维本生鲜",
        path:'/pages/index/index'
      }
    }
  }
})