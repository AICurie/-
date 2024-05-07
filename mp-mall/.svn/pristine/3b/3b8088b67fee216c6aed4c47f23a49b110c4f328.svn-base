import api from '../../utils/urlApi';
import request from '../../utils/request';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    list: [],
    baseUrl: '',
    goodInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options", options)
    let goodInfo = JSON.parse(options.item);
    console.log("goodInfo", goodInfo)
    let baseUrl = app.globalData.api + api.image;
    let appId = __wxConfig.accountInfo.appId;
    let id = options.id
    this.setData({
      id,
      appId,
      baseUrl,
      goodInfo
    })
    this.applyType();
  },
  applyType(){
    request({
      url: api.applyType,
      method: 'get',
      data: {
        afterSaleType: 1
      }
    }).then(res => {
      console.log("res ", res)
      if (res.code == "I0000") {
        this.setData({
          list: res.data
        })
      }
    })
  },
  topagehandle(e){
    let id = this.data.id;
    let applyType = e.currentTarget.dataset.type;
    let item = this.data.goodInfo;
    wx.redirectTo({
      url: `/pages/aftersale/cause?applyType=${applyType}&item=${JSON.stringify(item)}&id=${id}`
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
})