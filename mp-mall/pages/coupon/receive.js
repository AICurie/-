import api from '../../utils/urlApi';
import request from '../../utils/request';
// pages/coupon/receive.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  gainStatus: true,
  status: true,
  offset: 1,
  limit: 10,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.couponUser();
  },
  couponUser(more){
    if (this.status) {
      this.status = false;
      request({
        url: api.couponUser
      }).then(res => {
        console.log("res ", res)
        if (res.code == "I0000") {
          let newlist = res.elements;
          let oldlist = this.data.list;
          if (newlist.length >= this.limit) {
            this.status = true;
          }
          this.setData({
            list: more ? oldlist.concat(newlist) : newlist
          })
        }
      })
    }

  },
  gainHandle(e) {
    if (this.gainStatus) {
      this.gainStatus = false;
      let { id } = e.currentTarget.dataset;
      request({
        url: api.gain,
        method: 'post',
        data: {
          couponsId: id
        }
      }).then(res => {
        console.log("res ", res)
        this.gainStatus = true;
        if (res.code == "I0000") {
          wx.showToast({
            title: "领取成功",
            icon: 'none'
          })
          this.status = true;
          this.offset = 1;
          this.couponUser();
        } else {
          wx.showToast({
            title: res.msg || "领取失败",
            icon: 'none'
          })
        }
      }, err => {
        this.gainStatus = true;
      })
    } else {
      wx.showToast({
        title: '请勿重复点击',
        icon: 'none'
      })
    }
    
  },
  toPathHandle(e) {
    let { url } = e.currentTarget.dataset;
    wx.switchTab({
      url
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})