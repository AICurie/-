const app = getApp()
import request from '../../utils/request';
import api from '../../utils/urlApi';
import { getImageUrl } from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: []
  },
  offset: 1,
  limit: 10,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoods()
  },
    // 加入购物车
    addCar(e) {
      let userInfo = app.globalData.userInfo;
      if (userInfo.mobile) {
        let num = e.currentTarget.dataset.num || 0;
        if (num <= 999) {
          let skuId = e.currentTarget.dataset.id;
          request({ url: api.shoppingCar, data: { skuId, qty: 1 }, method: 'post' })
            .then(res => {
              if (res.code == "I0000") {
                if (!app.globalData.getCar) {
                  app.globalData.getCar = true;
                }
                this.setTabBarBadge()
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
        wx.redirectTo({
          url: '/pages/login/login?url=/pages/cellars/cellars',
        })
      }
    },
    setTabBarBadge() {
      request({
        url: api.shoppingCarPage,
        method: 'get'
      })
        .then(res => {
          console.log(res)
          if (res.code == "I0000") {
            let num = res.totalElements || 0;
            let index = app.globalData.type == "single"?1:2
            if(num > 0) {
              let text = num > 99 ? '...' : num;
              wx.setTabBarBadge({
                index,
                text
              })
            } else {
              wx.removeTabBarBadge({ index })
            }
          }
        })
    },
    detail(e) { // 商品详情
      let id = e.currentTarget.dataset.id;
      // wx.navigateTo({
      //   url: '/pages/detail/detail?goodsId=' + id,
      // })
    },
  getGoods(){
      request({ url: api.goods_list, data: { offset: this.offset, limit: this.limit }, errMsg: '加载失败' })
      .then(res => {
        console.log(res)
        if (res.code == "I0000") {
          if (Array.isArray(res.elements) && res.elements.length > 0) {
            let goods = res.elements;
            goods.map(item => {
              if (item.goodsImgId) {
                item.image = getImageUrl(item.goodsImgId, app.globalData.systemInfo.screenWidth);
              }
            });
            this.setData({ goods })
          }
        } 
      })
  },
  onShow () {
    let userInfo = app.globalData.userInfo;
    let mobile = userInfo.mobile;
    if (mobile) {
      if (app.globalData.status) {
        this.setTabBarBadge();
      }
    }
    this.getShopInfo()
  },
  getShopInfo(){ // 获取店铺信息
    request({
      url: api.getMerchant
    }).then(res => {
      console.log(res)
      if (res.code == "I0000") {
        app.globalData.name = res.data.name;
        app.globalData.memberLimit = res.data.memberLimit
        app.globalData.address = res.data.address;
        wx.setNavigationBarTitle({
          title: res.data.name
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    if (!this.data.share){
      this.setData({share:true})
    }
   
      return {
        title: (app.globalData.name || "维本生鲜"),
        path:'/pages/detail/detail?goodsId=' + this.data.goodsId
      }
  },
  onShareTimeline: function() {
    return {
      title: app.globalData.name || "维本生鲜",
      path:'/pages/detail/detail?goodsId=' + this.data.goodsId
    }
  }
})