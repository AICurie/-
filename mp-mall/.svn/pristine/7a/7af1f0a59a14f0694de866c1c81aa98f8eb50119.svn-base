import request from '../../utils/request';
import api from '../../utils/urlApi';
import { getImageUrl } from '../../utils/request';
import { formaDate } from '../../utils/util';
const plugin = requirePlugin("logisticsPlugin")
const app = getApp();
Page({
  data: {
    status: 1,
    status_txt: '待支付',
    item: '',
    goods: [],
    arr:[773064534023634],
    id: '',
    point: 0,
    traces:'',
    detailStatus:'',
    delivery: {},
    recom: []
  },
  goodsOrderby: 'SALES_DESC',
  recomOffset: 1,
  recomLimit: 6,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let date = formaDate(new Date());
    let baseUrl = app.globalData.api + api.image;
    let appId = __wxConfig.accountInfo.appId;
    let userInfo = app.globalData.userInfo;
    this.setData({ id, date, point: app.globalData.userInfo.point,baseUrl,appId,userInfo })
    this.getOrderInfo();
    if (options.status) {
      this.setData({
        status: options.status
      })
    }
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
  afterSalep(){
    request({
      url: api.afterSalep,
      method: 'get',
      data: {
        orderId: this.data.item.orderId
      }
    }).then(res => {
      console.log("res ", res)
    })
  },
  getRoute(id){
    request({
      url:api.route + id
    }).then(res => {
      if(res.code == "I0000") {
        let data = res.data;
        let traces = data.traces[data.traces.length -1];
        this.setData({
          traces
        })
      }
    })
  },
  goRoute(){
    wx.navigateTo({
      url: '/pages/route/route?ids='+JSON.stringify(this.data.item.transportNos)+'&name='+ this.data.item.logisticsName +'&orderNo='+this.data.item.orderNo
    })
  },
  // 获取订单信息
  getOrderInfo(fn){
    if (this.data.id) {
      request({
        url: api.orderInfo,
        data: {
          orderNo: this.data.id
        }
      }).then( res => {
        console.log(res)
        if (res.code == "I0000") {
          let item = res.data;
          // let goods = item.detail;
          // goods.map(item => {
          //   if (item.imgId) {
          //     item.image = getImageUrl(item.imgId, app.globalData.systemInfo.screenWidth / 4);
          //   }
          // });
          this.setData({ item });
          this.getGoodsList();
          if (item.logisticsType != undefined && item.logisticsType != 2) {
            if (item.transportNos && item.transportNos.length == 1) {
              this.getRoute(item.transportNos[0].transportNo,item.orderNo)
            }
          }
          if (item.logisticsType == 4 && item.orderStatus > 2) {
            this.getDelivery()
          }
          
          // this.afterSalep();
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 1200)
        }
        fn && fn()
      })
    }
  },
  getGoodsList(){
    request({
      url: api.order_goods,
      data:{
        orderId: this.data.item.orderId,
        limit: 999,
        offset: 1
      }
    }).then(res => {
      console.log("res ", res)
      if (res.code == "I0000"){
        let goods = res.elements;
        for (let i = 0, len = goods.length; i < len; i++) {
          if (goods[i].imgId) {
            goods[i].image = getImageUrl(goods[i].imgId, app.globalData.systemInfo.screenWidth / 4);
          }
        }
          // goods.map(item => {
          //   if (item.imgId) {
          //     item.image = getImageUrl(item.imgId, app.globalData.systemInfo.screenWidth / 4);
          //   }
          // });
          this.setData({
            ['item.detail']: goods,
            goods
          })
      }
    })
  },
  // 获取闪送配送状态
  getDelivery(){
    request({
      url: api.delivery + this.data.id,
    }).then(res => {
      console.log('res', res)
      if (res.code == "I0000") {
        this.setData({
          delivery: res.data
        })
      }
    })
  },
  // 打开微信物流助手
  openRoute(){
    wx.showLoading({
      title: '加载中...',
    })
    request({
      url: api.delivery + this.data.item.orderNo + '/trace'
    }).then(res => {
      wx.hideLoading()
      console.log('res', res)
      if (res.code == "I0000") {
        if (res.data.errcode == 0) {
          
          let waybillToken = res.data.waybillToken;
          plugin.openWaybillTracking({
                waybillToken
          });
        } else {
          wx.showToast({
            title: '获取物流信息失败',
            icon: 'none'
          })
        }
      } else {
        wx.showToast({
          title: res.msg || '获取物流信息失败',
          icon: 'none'
        })
      }
    }, err => {
      wx.hideLoading()
    })
    
  },
  // 查看物流
  getRoute(id,orderNo){
    request({
      url:api.route + id + '/'+ orderNo
    }).then(res => {
      wx.hideLoading();
      if(res.code == "I0000") {
        let data = res.data;
        let detailStatus = data.detailStatus;
        this.setData({
          detailStatus
        })
      }
    })
  },
  // 图片加载异常展示默认图片
  imageError(e){
    let { idx } = e.currentTarget.dataset;
    let str = `goods[${idx}].image`
    this.setData({[str]:''})
  },
  cancel() { // 取消订单
    let that = this;
    wx.showModal({
      title: "取消订单",
      content: '即将取消订单，是否继续？',
      success: res => {
        if (res.confirm) {
          request({
            url: api.checkOrderFreightRefund,
            method: 'get',
            data: {
              orderId: ids
            }
          }).then(res => {
            if (res.code == "I0000") {
          request({
            url: api.cancel,
            data: {
              orderNo: this.data.item.orderNo
            },
            method: 'post'
          }).then(res => {
            if (res.code == "I0000") {
              wx.showToast({
                title: '取消成功',
                icon: 'none'
              })
              that.onLoad({
                id: that.data.id,
                status: that.data.status
              });
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
        }, err => {
          wx.showToast({
            title: '操作失败',
            icon: 'none'
          })
        })
        }
      }
    })

  },
   // 加入购物车
   addCar(e) {
     let skuId = e.currentTarget.dataset.id;
    request({ 
      url: api.shoppingCar, 
      data: { 
        skuId, qty: 1 
      }, 
      method: 'post' 
    })
    .then(res => {
      if (res.code == "I0000") {
        if (!app.globalData.getCar) {
          app.globalData.getCar = true;
        }
        // this.setTabBarBadge()
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: res.msg || '添加失败',
          icon: 'none'
        })
      }
    })
     
  },
  // 去评价
  toEvaluate(e){
    let { item } = e.currentTarget.dataset;
    let id = this.data.item.orderId;
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
    console.log("im ", im)
    console.log("JSON.stringify(im)", JSON.stringify(im))
    wx.navigateTo({
      url: '/pages/evaluate/evaluate?item='+JSON.stringify(im)+"&id="+id,
    })
  },
  // 申请售后
  aftersale(e){
    let { item } = e.currentTarget.dataset;
    let id = this.data.item.orderId;
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
    wx.redirectTo({
      url: "/pages/aftersale/index?item="+JSON.stringify(im)+"&id="+id,
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
  copy(e) { // 复制
    let data = e.currentTarget.dataset.item;
    wx.setClipboardData({
      data,
      success: res => {
        wx.showToast({
          title: '复制成功',
          icon: 'none'
        })
      },
      fail: err => {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        })
      }
    })
  },
  route(e){
    let id = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/route/route?id='+id
    })
  },
  player() { // 支付
    let that = this;
    request({
      url: api.payment + that.data.id,
      method: 'post'
    }).then(res => {
      console.log(res);
      console.log(that);
      if (res.code == "I0000") {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.dataPackage,
          paySign: res.data.paySign,
          signType: res.data.signType,
          success: res => {
            console.log(res, 111);
            wx.redirectTo({
              url: '/pages/player/res?id=' + that.data.id + `&status=${true}`,
            });
          },
          fail: err => {
            console.log(err, 2222);
            wx.redirectTo({
              url: '/pages/player/res?id=' + that.data.id,
            });
          }
        })
      } else {
        wx.redirectTo({
          url: '/pages/player/res?id=' + that.data.id,
        });
      }
    })
  },
  payment(){ // 补差价
    request({
      url: api.orders + this.data.item.orderId + '/change',
      method: 'put'
    }, {}).then(res => {
      console.log("res ", res)
      if (res.code == "I0000") {
        let id = res.data;
        request({
          url: api.payment + id + '/change',
          method: 'post'
        }, {}).then(res => {
          console.log("res", res)
          if (res.code == "I0000") {
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.dataPackage,
              paySign: res.data.paySign,
              signType: res.data.signType,
              success: res => {
                console.log(res, 111);
                wx.redirectTo({
                  url: '/pages/player/res?id=' + this.data.id + `&status=${true}`,
                });
              },
              fail: err => {
                console.log(err, 2222);
                wx.redirectTo({
                  url: '/pages/player/res?id=' + this.data.id,
                });
              }
            })
          } else {
            wx.showToast({
              title: res.msg || '支付失败',
              icon: 'none'
            })
          }
        })
      } else {
        wx.showToast({
          title: res.msg || '支付失败',
          icon: 'none'
        })
      }
    })
  },
  getList(e) { // 查看商品清单
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/order/list?id=' + id,
    })
  },
  finish() { // 确认收货
    wx.showModal({
      title: "确认收货",
      content: "即将确认收货，是否继续？",
      success: res => {
        if (res.confirm) {
          request({
            url: api.finish + this.data.item.orderId,
            method: 'put'
          }).then(res => {
            if (res.code == "I0000") {
              wx.showToast({
                title: '操作成功',
                icon: 'none'
              })
              this.getOrderInfo();
              // setTimeout(() => {
              //   wx.navigateBack({
              //     delta: 1,
              //   })
              // }, 1200)
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
  onPullDownRefresh(){
    this.getOrderInfo(() => {
      wx.showToast({
        title: '刷新成功',
        icon: 'none'
      })
      wx.stopPullDownRefresh()
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