import api from '../../utils/urlApi';
import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    detail: ''
  },
  onLoad: function (options) {
    let { id } = options;
    this.setData({
      id
    })
    this.getDetail();
  },
  getDetail(){
    request({
      url: api.readMsg + this.data.id
    }).then(res => {
      console.log("res ", res)
      if (res.code == "I0000"){
        this.setData({
          detail: res.data
        })
      } else {
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },err => {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    })
  }

})