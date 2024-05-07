import request from '../../utils/request';
import api from '../../utils/urlApi';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:1,
    text:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.status && options.status == 2) {
      wx.setNavigationBarTitle({
        title: '隐私政策'
      })
      this.getPolicy()
    } else {
      this.getAgreement()
    }
  },
  // 获取服务协议
  getAgreement(){
    request({
      url:api.getAgreement
    }).then(res => {
      console.log(res)
      if (res.code == "I0000") {
        this.setData({ text:res.data })
      } else {
        wx.showToast({
          title: res.msg || "加载失败",
          icon:'none'
        })
      }
    })
  },
  // 获取隐私政策
  getPolicy(){
    request({
      url:api.getPolicy
    }).then(res => {
      console.log(res)
      if(res.code == "I0000") {
          this.setData({ text:res.data })
      } else {
        wx.showToast({
          title: res.msg || "加载失败",
          icon:'none'
        })
      }
    })
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