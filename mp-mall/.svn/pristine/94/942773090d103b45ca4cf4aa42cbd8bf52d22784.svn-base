import request from '../../utils/request';
import api from '../../utils/urlApi';
import { getImageUrl, event } from '../../utils/request';
const app = getApp();
Page({

  data: {
    count: 5,
    timer: null,
    image: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   image: getImageUrl("2c90b5bb7db78ec0017ee69e1367003c")
    // })
    this.getDataInfo();
    
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.countHandle();
    // wx.setStorageSync('wxUserInfo', '')
  },
    // 获取首页数据
    getDataInfo() {
      request({
        url: api.getPoster,
        method: 'get',
        data: {
          type: 1
        }
      }).then(res => {
        if (res.code == "I0000") {
          let banner = res.data;
          let image = '456456';
          if (banner && banner.length > 0) {
            // , app.globalData.systemInfo.screenWidth* 2
            image = getImageUrl(banner[0].imgId);
          }
          this.setData({ image });
          let userInfo = app.globalData.userInfo;
          event("start", userInfo.userId);
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    },
  countHandle(){
    console.log("countHandle")
    let count = this.data.count;
    count -= 1;
    console.log('count', count)
    if (count <= 0) {
      clearTimeout(this.data.timer);
      this.setData({count,timer: null});
      wx.reLaunch({
        url: '/pages/index/index'
      });
    } else {
      let timer = setTimeout(this.countHandle, 1000)
      this.setData({count,timer});
    }
  },
  skipHandle(){
    clearTimeout(this.data.timer);
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  }
})