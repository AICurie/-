const app = getApp();
import request from '../../utils/request';
import api from '../../utils/urlApi';
import {getImageUrl} from '../../utils/request';
Page({
  data: {
    list:[],
    limit:10,
    offset:1,
    states:true,
    recom: [],
    baseUrl: '',
    appId: '',
    userInfo: {}
  },
  goodsOrderby: 'SALES_DESC',
  recomOffset: 1,
  recomLimit: 6,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let baseUrl = app.globalData.api + api.image;
    let appId = __wxConfig.accountInfo.appId;
    let userInfo = app.globalData.userInfo;
    this.setData({
      baseUrl,
      appId,
      userInfo,
    });
    this.getOrderList();
    // this.getRecomls();
  },
  topagehandle(e){
    let { orderid, detailid } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/aftersale/detail?orderId='+orderid +"&detailId=" + detailid
    })
  },
  getOrderList() { // 获取订单列表
    if (this.data.states) {
      wx.showLoading({ title: "加载中..." })
      this.setData({ states: false })
      request({
        url: api.orderList,
        // url: api.afterSalep,
        data: {
          limit: this.data.limit,
          offset: this.data.offset,
          // orderStatus:9
          isAfterSale: 1,
          afterSale: ''
        }
      }).then(async res => {
        console.log(res)
        if (res.code == "I0000") {
          let oldList = this.data.list;
          let newList = res.elements;
          wx.hideLoading();
          let list = oldList;
          if (newList && newList.length > 0) {
            // for (let i = 0, len = newList.length; i < len; i++) {
            //   if (newList[i].detail) {
            //     let item = newList[i].detail;
            //     for (let j = 0, key = item.length; j < key; j++) {
            //       if (item[j].)
            //     }
            //   }
            // }
            newList.map(item => {
              if (item.detail) {
                item.detail.map(key => {
                  if (key.imgId) {
                    key.image = getImageUrl(key.imgId, app.globalData.systemInfo.screenWidth / 4);
                  }
                });
              }
            });
            console.log("newList ", newList)
            list = oldList.concat(newList);
          }
          this.setData({ list });

          if (list.length >= this.data.limit || this.data.offset < res.totalPages) {
            this.setData({ states: true })
          } else {
            // if (this.data.offset > 1) {
            //   wx.showToast({
            //     title: '已加载全部',
            //     icon: 'none'
            //   })
            // }
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
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
  cancelHandle(e){
    wx.showModal({
      title: "确认取消本次售后申请?",
      content: "如您的问题未解决，请勿取消本次售后",
      confirmText: "确认取消",
      cancelText: "返回",
      confirmColor: '#60b533',
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          let { id } = e.currentTarget.dataset;
          request({
            url: api.afterSaled + id + '/cancel',
            method: 'put'
          }).then(res => {
            console.log("res ", res)
            if (res.code == "I0000") {
              wx.showToast({
                title: '操作成功',
                icon: 'none'
              })
              this.setData({
                states: true,
                offset: 1,
                list: []
              })
              this.getOrderList();
            } else {
              wx.showToast({
                title: res.msg || '操作失败',
                icon: 'none'
              })
            }
            
          })
        } 
      }
    })
  },
  toAftersale(e){
    let { item, id, type } = e.currentTarget.dataset;
    let im = {
      id: item.orderDetailId,
      skuPrice: item.skuPrice,
      imgId: item.imgId,
      isShowItemSupplier: item.isShowItemSupplier,
      itemSupplier: item.itemSupplier,
      itemName: item.itemName,
      skuSum: item.skuSum,
      skuUnit: item.skuUnit,
      skuId: item.skuId,
      itemId: item.itemId
    }
    
    wx.navigateTo({
      url: '/pages/aftersale/cause?item='+JSON.stringify(im)+'&id='+id+'&applyType='+type+'&orderDetailId='+item.orderDetailId,
    })
  },
  imageError(e){
    let { idx, index } = e.currentTarget.dataset;
    let str = `list[${index}].detail[${idx}].image`
    this.setData({[str]:''})
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