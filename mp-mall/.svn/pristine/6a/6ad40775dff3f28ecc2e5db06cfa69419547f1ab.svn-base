import request from '../../utils/request';
import api from '../../utils/urlApi';
import { getImageUrl } from '../../utils/request';
const app = getApp();
Page({
  limit: 10,
  offset: 1,
  states: true,
  data: {
    search_nicht: 'search_nicht.png',
    status: 0,
    list: [],
    goods: [],
    recom: [],
    baseUrl: '',
    appId: ''
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
      search_nicht: app.globalData.type == 'special' ? 'search_nicht-' + app.globalData. marchantCode + '.png' : 'search_nicht.png',
    });
    if (options.status) {
      this.setData({ status: options.status })
    }
    this.getOrderList()
    // this.getRecomls();
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
  topagehandle(e){
    let { url } = e.currentTarget.dataset;
    wx.navigateTo({
      url
    })
  },
  toEvaluate(e){
    let { item, id } = e.currentTarget.dataset;
    let im = {
      id: item.id,
      skuPrice: item.skuPrice,
      image: item.image,
      isShowSkuSupplier: item.isShowSkuSupplier,
      itemSupplier: item.itemSupplier,
      itemName: item.itemName,
      skuSum: item.skuSum,
      skuUnit: item.skuUnit,
      skuId: item.skuId,
      itemId: item.itemId
    }
    wx.navigateTo({
      url: '/pages/evaluate/evaluate?item='+JSON.stringify(im)+"&id="+id,
    })
  },
  onShow(){
    if (this.data.list.length > 0) {
      this.states = true;
      this.offset = 1;
      this.getOrderList(true)
    }
   
  },
  changeStatus(e) { // 切换分类
    let status = e.currentTarget.dataset.idx;
    if(!this.states) {
       this.states = true;
    }
    if (this.offset != 1) {
      this.offset = 1;
    }
    this.setData({
      status,
      // list: []
    })
    this.getOrderList(true)
  },
  getOrderList(isNew) { // 获取订单列表
    if (this.states) {
      wx.showLoading({ title: "加载中..." })
      this.states = false;
      let orderStatus = this.data.status == 0 || this.data.status == 7 ? '' :  this.data.status;
      let orderStatusList = '';
      let supplyStatus = this.data.status == 7 ? 0:'';
      request({
        url: api.orderList,
        data: {
          limit: this.limit,
          offset: this.offset,
          orderStatus,
          supplyStatus,
          orderStatusList
        }
      }).then(async res => {
        console.log(res)
        if (res.code == "I0000") {
          let oldList = this.data.list;
          let newList = res.elements;
          wx.hideLoading();
          let list = oldList;
          if (newList && newList.length > 0) {
            newList.map(item => {
              if (item.detail) {
                item.detail.map(key => {
                  if (key.imgId) {
                    key.image = getImageUrl(key.imgId, app.globalData.systemInfo.screenWidth / 2);
                  }
                });
              }
            });
            list = oldList.concat(newList);
          }
          if (isNew) {
            this.setData({ list:newList });
          } else {
            this.setData({ list });
          }
          if (newList.length >= this.limit || this.offset < res.totalPages) {
            this.states = true;
          } else {
            // if (this.offset > 1) {
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
  getMore() { // 加载更多
    if (this.states) {
      this.offset += 1;
      this.getOrderList()
    }
  },
  imageError(e){
    let { idx, index } = e.currentTarget.dataset;
    let str = `list[${index}].detail[${idx}].image`
    this.setData({[str]:''})
  },
  cancel(e) { // 取消订单
    wx.showModal({
      title: "取消订单",
      content: "即将取消订单，是否继续？",
      success: res => {
        if (res.confirm) {
          let id = e.currentTarget.dataset.id;
          let ids = e.currentTarget.dataset.ids;
          request({
            url: api.checkOrderFreightRefund,
            method: 'get',
            data: {
              orderId: ids
            }
          }).then(res => {
            console.log("res ", res)
            if (res.code == "I0000") {
              
              request({
                url: api.cancel,
                data: {
                  orderNo: id
                },
                method: 'post'
              }).then(res => {
                if (res.code == "I0000") {
                  wx.showToast({
                    title: '取消成功',
                    icon: 'none'
                  })
                  this.getUserInfo();
                  setTimeout(() => {
                    this.states = true;
                    this.offset = 1;
                    this.setData({
                      list: []
                    })
                    this.getOrderList()
                  }, 500)
                } else {
                  wx.showToast({
                    title: res.msg || "取消失败",
                    icon: 'none'
                  })
                }
              })
            } else {
              wx.showToast({
                title: res.msg || '操作失败',
                icon: 'none'
              })
            }
          },err => {
            console.log("err ", err)
            wx.showToast({
              title: '操作失败',
              icon: 'none'
            })
          })
         
        }
      }
    })

  },
  getUserInfo() { // 重新获取用户信息
    request({
      url: api.userInfo
    }).then(res => {
      console.log(res)
      if (res.code = "I0000") {
        app.globalData.userInfo = res.data;
      }
    })
  },
  player(e) {  //去支付
    let that = this;
    let id = e.currentTarget.dataset.id
    request({
      url: api.payment + id,
      method: 'post'
    }).then(res => {
      console.log(res)
      if (res.code == "I0000") {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.dataPackage,
          paySign: res.data.paySign,
          signType: res.data.signType,
          success: res => {
            wx.redirectTo({
              url: '/pages/player/res?id=' + id + `&status=${true}`,
            })
          },
          fail: err => {
            wx.redirectTo({
              url: '/pages/player/res?id=' + id,
            })
          }
        })
      } else {
        wx.redirectTo({
          url: '/pages/player/res?id=' + id,
        })
      }
    })
  },
  finish(e){ // 确认收货
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "确认收货",
      content: "即将确认收货，是否继续？",
      success: res => {
        if (res.confirm) {
    request({
      url:api.finish + id,
      method:'put'
    }).then(res => {
      console.log(res)
      if (res.code == "I0000") {
        wx.showToast({
          title: '操作成功',
          icon:'none'
        })
        this.states = true;
        this.offset = 1;
        this.setData({list: []})
        this.getOrderList()
      } else {
        wx.showToast({
          title: res.msg || '操作失败',
          icon:'none'
        })
      }
    })
    }
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