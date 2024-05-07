import api from '../../utils/urlApi';
import request from '../../utils/request';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    baseUrl: '',
    userInfo: {},
    appId: ''
  },
  recomOffset: 1,
  recomLimit: 6,
  goodsOrderby: 'SALES_DESC',
  detailId: '',
  orderId: '',
  onLoad: function (options) {
      let { detailId, orderId } = options;
      this.detailId = detailId || '';
      this.orderId = orderId || '';
      let baseUrl = app.globalData.api + api.image;
      let appId = __wxConfig.accountInfo.appId;
      let userInfo = app.globalData.userInfo;
      this.setData({baseUrl,appId,userInfo})
      this.getDetail();
      this.getRecomls();
  },
     // 加入购物车
     addCar(e) {
      let userInfo = app.globalData.userInfo;
      console.log("userInfo", userInfo)
      if (userInfo.mobile) {
        let memberLimit = app.globalData.memberLimit;
        if (memberLimit) {
          if (userInfo.merchantMemberId && userInfo.status == 1) {
            let num = e.currentTarget.dataset.num || 0;
            if (num <= 999) {
              let skuId = e.currentTarget.dataset.id;
              request({ url: api.shoppingCar, data: { skuId, qty: 1 }, method: 'post' })
                .then(res => {
                  if (res.code == "I0000") {
                    if (!app.globalData.getCar) {
                      app.globalData.getCar = true;
                    }
                    // this.setTabBarBadge()
                    wx.showToast({
                      title: '已加入购物车',
                      icon: 'none'
                    })
                  } else {
                    wx.showToast({
                      title: res.msg || '添加失败',
                      icon: 'none'
                    })
                  }
                })
            } else {
              wx.showToast({
                title: '购物车数量不能超过999',
                icon: 'none'
              })
            }
          } else {
            wx.showModal({
              content:`您还不是会员，请提交认证信息，等待认证通过后继续操作`,
              confirmText:"去认证",
              confirmColor:"#60b533",
              success: res => {
                if(res.confirm) {
                  wx.navigateTo({
                    url: '/pages/login/auth',
                  })
                }
              }
            })
          }
        } else {
          let num = e.currentTarget.dataset.num || 0;
            if (num <= 999) {
              let skuId = e.currentTarget.dataset.id;
              request({ url: api.shoppingCar, data: { skuId, qty: 1 }, method: 'post' })
                .then(res => {
                  if (res.code == "I0000") {
                    if (!app.globalData.getCar) {
                      app.globalData.getCar = true;
                    }
                    // this.setTabBarBadge()
                    wx.showToast({
                      title: '已加入购物车',
                      icon: 'none'
                    })
                  } else {
                    wx.showToast({
                      title: res.msg || '添加失败',
                      icon: 'none'
                    })
                  }
                })
            } else {
              wx.showToast({
                title: '购物车数量不能超过999',
                icon: 'none'
              })
            }
        }
        
      } else {
        wx.redirectTo({
          url: '/pages/login/login?url=/pages/order/order',
        })
      }
    },
     // 获取推荐列表
     getRecomls(){
      request({ url: api.goods_list, data: { goodsOrderby:this.goodsOrderby, offset: this.recomOffset, limit: this.recomLimit } })
          .then(res => {
            if (res.code == "I0000") {
              this.setData({
                recom: res.elements
              })
            } else {
              this.setData({
                recom: []
              })
            }
          })
    },
  getDetail(){
    request({
      url: api.getOrderInfo + this.orderId + '/' + this.detailId
    }).then(res => {
      console.log("res ", res)
      if (res.code == "I0000") {;
        this.setData({
          item: res.data
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  }
})