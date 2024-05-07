import api from '../../utils/urlApi';
import request from "../../utils/request";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      company: '维本生鲜',
      logo: 'logo.png',
      descrption: '维本生鲜官方公众号。',
      userInfo:null,
      phone:'',
      supplying: 0,
      payment:0,
      deliver:0,
      receiving:0,
      mobile:"",
      point:0,
      cancel:0,
      scene:'',
      memberLimit: true,
      msgCount: 0
  },
  goodsOrderby: 'SALES_DESC',
  recomOffset: 1,
  recomLimit: 6,
  bindCallHandle(e){
    let { num } = e.currentTarget.dataset;
    if (num) {
      wx.makePhoneCall({
        phoneNumber: num
      })
    }
    
  },
  callHandle(mobile){
    
    // wx.showModal({
    //   content:`拨打${mobile}咨询`,
    //   confirmText:"拨打",
    //   confirmColor:"#EF2322",
    //   success: res => {
    //     if(res.confirm) {
    //       wx.makePhoneCall({
    //         phoneNumber: `${mobile}`
    //       })
    //     }
    //   }
    // })
  },
  call(){
    if(this.data.mobile){
      this.callHandle(this.data.mobile)
    } else {
      request({
        url:api.getMobile
      }).then(res => {
        console.log(res)
        if(res.code == "I0000") {
            this.setData({mobile:res.data})
            this.callHandle(res.data)
        } else {
          wx.showToast({
            title: res.msg || "获取失败",
            icon:'none'
          })
        }
      })
    }
  },
  handleContact (e) {
    console.log("e", e)
    console.log(e.detail.path)
    console.log(e.detail.query)
},
  topagehandle(e){
    let { url } = e.currentTarget.dataset;
    wx.navigateTo({
      url
    })
  },
 /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo();
    let userInfo = app.globalData.userInfo
    let mobile = userInfo.mobile;
    wx.setNavigationBarTitle({
      title: app.globalData.name
    })
    // let wxUserInfo = wx.getStorageSync('wxUserInfo');
    // if (!wxUserInfo) {
    //   wx.redirectTo({
    //     url: '/pages/login/login?url=/pages/user/user',
    //   })
    // }
    if (mobile) {
      this.getShopInfo()
      let {scene} = wx.getLaunchOptionsSync();
      console.log(scene)
      let memberLimit = app.globalData.memberLimit
      console.log(userInfo)
      this.setData({userInfo,scene,memberLimit})
      if(userInfo.merchantMemberId && userInfo.status == 1) {
        // this.getUserInfo()
        // this.getOrderList()
      } 
      if (app.globalData.status) {
        this.setTabBarBadge()
      }
      this.getMsgCount();
    } else {
      wx.redirectTo({
        url: '/pages/login/login?url=/pages/user/user',
      })
    }
  },
  toCoupon(){
    let memberLimit = this.data.memberLimit;
    let userInfo = this.data.userInfo;
    if(memberLimit) {
      if (userInfo.merchantMemberId && userInfo.status == 1) {
        wx.navigateTo({
          url: '/pages/coupon/index',
        })
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
      wx.navigateTo({
        url: '/pages/coupon/index',
      })
    }
  },
  getMsgCount(){
    request({
      url: api.getUnreadMsgCount,
      method: 'get'
    }).then(res => {
      console.log("res ", res)
      if (res.code == "I0000") {
        if (res.data > 0) {
          wx.showTabBarRedDot({
            index: 3,
          })
        } else {
          wx.hideTabBarRedDot({
            index: 3,
          })
        }
        this.setData({
          msgCount: res.data
        })
      }
    })
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
          // let index = app.globalData.type == "single"?1:3
          if(num > 0) {
            let text = num > 99 ? '...' : num;
            wx.setTabBarBadge({
              index: 2,
              text
            })
          } else {
            wx.removeTabBarBadge({ index: 2 })
          }
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let baseUrl = app.globalData.api + api.image;
    let appId = __wxConfig.accountInfo.appId;
    this.setData({
      baseUrl,
      appId,
      company: app.globalData.company,
      logo: 'logo-' + app.globalData.marchantCode + '.png',
      descrption: app.globalData.descrption,
    });
    // wx.setNavigationBarTitle({
    //   title: app.globalData.name
    // })

    this.getUserInfo();
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
      }
      
    } else {
      wx.redirectTo({
        url: '/pages/login/login?url=/pages/user/user',
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
  getUserInfo(updata){ // 重新获取用户信息
    request({
      url:api.userInfo
    }).then(res => {
      if(res.code= "I0000") {
        app.globalData.userInfo = res.data;
        let point = res.data.point;
        this.setData({point,userInfo:res.data})
        wx.setStorageSync('userInfo', res.data)
        if (updata) {
          if (!res.data.mobile) {
            wx.showToast({
              title: '该账号已在其他设备登录，请重新登录',
              icon:'none'
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/login/login?url=/pages/user/user',
              })
            }, 1200);
          } 
        }
      } 
    })
  },
  getOrderList(){ // 订单列表
      request({
        url:api.orderList
      }).then(res => {
        if (res.code == "I0000") {
          let list = res.elements;
          let payment = 0;
          let deliver = 0;
          let receiving = 0;
          let cancel = 0;
          let supplying = 0;
          for(let i = 0, len = list.length; i < len; i++) {
            if(list[i].orderStatus == 1) {
              payment += 1;
            } else if (list[i].orderStatus == 2) {
              deliver += 1;
            } else if(list[i].orderStatus == 3 || list[i].orderStatus == 4) {
              receiving += 1;

            } else if(list[i].orderStatus == 9){
              cancel += 1;
            }
            if (list[i].supplyStatus == 0 && list[i].orderStatus != 9){
              supplying += 1;
            }
          }
          this.setData({payment,deliver,receiving,cancel,supplying});
        } else {
          this.setData({payment:0,deliver:0,receiving:0,cancel:0,supplying:0});
        }
      })
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
        this.setData({
          memberLimit: res.data.memberLimit
        })
        wx.setNavigationBarTitle({
          title: res.data.name
        })
      }
    })
  },
  allRequest(){
    // ,this.getOrderList()
    const list = [this.getShopInfo(),this.getUserInfo(true), this.getRecomls(),this.getMsgCount(),this.setTabBarBadge()];
    return Promise.all(list)
  },
  async onPullDownRefresh(){
    await this.allRequest();
    wx.stopPullDownRefresh();
    console.log()
    wx.showToast({
      title: '刷新成功',
      icon:'none'
    })
  },
  follow(){
    wx.navigateTo({
      url: '/pages/link/link',
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