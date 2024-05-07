import request from '../../utils/request';
import api from '../../utils/urlApi';
import { getImageUrl } from '../../utils/request';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    baseUrl: '',
    appId: '',
    userInfo: {}
  },
  limit: 10,
  offset: 1,
  status: true,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGroupBuyingSKUList()
    let baseUrl = app.globalData.api + api.image;
    let appId = __wxConfig.accountInfo.appId;
    let userInfo = app.globalData.userInfo;
    this.setData({
      appId,
      baseUrl,
      userInfo
    })
  },
  getGroupBuyingSKUList(more){
      if (this.status) {
        this.status = false;
        request({
          url: api.getGroupBuyingSKUList,
          data: {
            limit: this.limit,
            offset: this.offset,
          }
        }).then(res => {
          console.log("res ", res)
          if (res.code == "I0000") {
            let newlist = res.elements;
            let oldlist = this.data.list;
            for (let i = 0, len = newlist.length; i < len; i++) {
              if (newlist[i].imgId) {
                newlist[i].image = getImageUrl(newlist[i].imgId);
              }
            }
            if (newlist >= this.limit) {
              this.status = true;
            }
            this.setData({
              list: more ? oldlist.concat(newlist) : newlist
            })
          }
        })
      }
  },
  detail(e) { // 商品详情
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?goodsId=${id}&skuSource=2`,
    })
  },
  onShow: function () {

  },
  onReachBottom: function () {

  },
})