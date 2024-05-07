import request from '../../utils/request';
import api from '../../utils/urlApi';
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
  id: "",
  title: "",
  offset: 1,
  limit: 10,
  status: true,
  labelType: "",
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options ", options)
    let { title, id, labelType } = options;
    this.title = title;
    this.id = id;
    this.labelType = labelType;
    wx.setNavigationBarTitle({title});
    this.getList();
    let baseUrl = app.globalData.api + api.image;
    let appId = __wxConfig.accountInfo.appId;
    console.log("baseUrl ", baseUrl)
    this.setData({
      appId,
      baseUrl
    })
  },
  onShow(){
    let userInfo = app.globalData.userInfo;
    this.setData({
      userInfo
    })
  },
  getList(more){
    if (this.status) {
      this.status = false;
      request({
        url: api.goods_list,
        data: {
          offset: this.offset,
          limit: this.limit,
          labelId: this.id,
          labelType: this.labelType
        }
      }).then(res => {
        console.log("res ", res)
        if (res.code == "I0000") {
          let newlist = res.elements || [];
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
        url: '/pages/login/login?url=/pages/activity/arrondi',
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.status) {
      this.offset += 1;
      this.getList(true);
    }
  }
})