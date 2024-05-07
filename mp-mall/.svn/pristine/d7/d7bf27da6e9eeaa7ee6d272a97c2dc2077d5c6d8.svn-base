
//获取应用实例
const app = getApp()
import request from '../../utils/request';
import api from '../../utils/urlApi';
import { getImageUrl } from '../../utils/request';
Page({
  data: {
    live: '',
    status: true,
    banner: [],
    list: [],
    goods: [],
    notices: [],
    statusBarHeight: 0,
    isIos: false,
    name: '维本生鲜',
    layout: [],
    baseUrl: "",
    appId: "",
    userInfo: {},
    mpBgcolorFirst: '',
    mpBgcolorSecond: '',
    gradientDirection: '',

  },
  limit: 10,
  offset: 1,
  status: true,
  onShow() {
    let userInfo = app.globalData.userInfo;
    this.setData({
      userInfo
    })
    if (app.globalData.status && userInfo.mobile) {
      this.setTabBarBadge()
    }
    this.getShopInfo()
    if (!userInfo) {
      wx.removeTabBarBadge({
        index: 3,
      })
    }
    this.getMsgCount();
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
      }
    })
  },
  // 获取首页背景色
  getHomePageExt(){
    request({
      url: api.homePageExt
    }).then(res => {
      console.log("res ", res)
      if (res.code == "I0000") {
        this.setData({
          gradientDirection: res.data.gradientDirection,
          mpBgcolorFirst: res.data.mpBgcolorFirst,
          mpBgcolorSecond: res.data.mpBgcolorSecond
        })
      }
    })
  },
  totabberpage(e){
    let { ids } = e.currentTarget.dataset;
    wx.reLaunch({
      url: '/pages/menu/menu?ids='+ids,
    })
  },
  changecurrent(e){
    let mv = wx.createVideoContext("indexmv");
    if (e.detail.current != 0) {
      
      console.log("mv", mv)
      mv.pause();
    } else {
      mv.play();
    }
  },
  topagehandle(e){
    let { url } = e.currentTarget.dataset;
    wx.navigateTo({
      url
    })
  },
  async changeTab(e){
    let { val, index } = e.currentTarget.dataset;
    let layout = this.data.layout;
    let data = layout[index];
    if (data.active != val ) {
      data.active = val;
      data.list = await this.asyncGetGoods(val, 0)
      this.setData({
        [`layout[${index}]`]: data
      })
    } 
  },
  getUserInfo(){ // 重新获取用户信息
    request({
      url:api.userInfo
    }).then(res => {
      console.log(res)
      if(res.code= "I0000") {
        app.globalData.userInfo = res.data;
        wx.setStorageSync('userInfo', res.data)
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
        this.setData({name: res.data.name})
      }
    })
  },
  onLoad: function () {
    this.getShopInfo()
    this.getSystemInfo()
    // this.getLocation();
    this.getDataInfo();
    // this.getGoods();
    this.getNotice();
    this.layoutConfig();
    this.getHomePageExt();
    let appId = __wxConfig.accountInfo.appId;
    this.setData({
      appId,
      baseUrl: app.globalData.api + api.image
    })
    let { pixelRatio } = wx.getSystemInfoSync();
    console.log("pixelRatio", pixelRatio)
  },
  layoutConfig(){
    request({
      url: api.layoutConfig
    }).then(async res => {
      if (res.code == "I0000") {
        let ls = res.data;
        for (let i = 0, len = ls.length; i < len; i++) {
          if (ls[i].layoutType == 3) {
            if (ls[i].layoutModels.length > 0 && ls[i].layoutModels[0].id) {
              ls[i].active = ls[i].layoutModels[0].id;
              ls[i].list = await this.asyncGetGoods(ls[i].layoutModels[0].id, 0)
            }
          } else if (ls[i].layoutType == 1 ) {
            let models = ls[i].layoutModels;
            if (models && models.length > 0 && models[0].id) {
              for (let j = 0, key = models.length; j < key; j++) {
                models[j].list = await this.asyncActivity(models[j].id, models[j].type) || [];
              }
            } else {
              ls[i].list = [];
            }
            
            ls[i].layoutModels = models;
          }
        }
        this.setData({
          layout: ls
        })
      }
    })
  },
  async asyncGetGoods(labelId, labelType){
    return request({
      url: api.goods_list,
      data: {
        labelId,
        labelType,
        offset:1,
        limit: 9999,
        goodsOrderby: 'LABEL_SORT_ASC'
      }
    }).then(res => {
      if (res.code == "I0000") {
        return res.elements || [];
      }
      return [];
    },err=>[])
  },
  getMoreGoods(){

  },
  async asyncActivity(activityId, type){
    return request({
      url: type == 1 ? api.getHomeSeckill : api.getHomeGroup,
      data: {
        activityId,
        offset: 1,
        limit: 999
      }
    }).then(res => {
      if (res.code == "I0000") {
        return res.elements || [];
      }
      return [];
    },err => [])
  },
  getNotice(){
    request({
      url: api.randomNotice  //api.notice
    }).then(res => {
      console.log('res', res)
      if (res.code == "I0000") {
        this.setData({
          notices: res.data  //res.elements
        })
      }
    })
  },
  imageError(e){
    let { idx, name } = e.currentTarget.dataset;
    let str = `${name}[${idx}].image`
    // this.setData({[str]:''})
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
        url: '/pages/login/login?url=/pages/menu/menu',
      })
    }
  },
  setTabBarBadge() {
    request({
      url: api.shoppingCarPage,
      method: 'get'
    })
      .then(res => {
        if (res.code == "I0000") {
          let num = res.totalElements || 0;
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
  // 获取首页数据
  getDataInfo() {
    request({
      url: api.getPoster,
      method: 'get',
      data: {
        type: 0
      }
    }).then(res => {
      if (res.code == "I0000") {
        let banner = res.data;
        if (banner && banner.length > 0) {
          banner.map(item => {
            if (item.imgId) {
              item.image = getImageUrl(item.imgId);
            }
          });
        }
        this.setData({ banner });
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
    request({
      url: api.catagory_home
    }).then(async res => {
      if (res.code == "I0000") {
        let list = res.data;
        this.setData({ list });
        if (list && list.length > 0) {
          list.map(item => {
            if (item.imgId) {
              item.image = getImageUrl(item.imgId, app.globalData.systemInfo.screenWidth / 2);
              this.setData({ list });
            }
          });
        }
      } else {
        // wx.showToast({
        //   title: res.msg,
        //   icon: 'none'
        // })
      }
    })
  },
  getGoods(more){
    if (this.status) {
      wx.showLoading({
        title: '加载中...',
        icon: 'none'
      })
      this.status = false;
      request({ url: api.goods_list, data: { offset: this.offset, limit: this.limit }, errMsg: '加载失败' })
      .then(res => {
        wx.hideLoading()
        if (res.code == "I0000") {
          if (Array.isArray(res.elements) && res.elements.length > 0) {
            let oldList = this.data.goods;
            let goods = res.elements;
            if (goods.length >= this.limit) {
              this.status = true;
            }
            goods.map(item => {
              if (item.goodsImgId) {
                item.image = getImageUrl(item.goodsImgId, app.globalData.systemInfo.screenWidth);
              }
            });
            let list = oldList.concat(goods);
            if (more) {
              this.setData({ goods: list })
            } else {
              this.setData({ goods })
            }
          } else {
            if (this.offset > 1) {
              this.setData({ goods: this.data.goods })
            } else {
              this.setData({ goods: [] })
            }
          }
        } 
      })
    }
  },
  // 获取设备信息
  getSystemInfo() {

    this.setData({
      isIos: app.globalData.systemInfo.system.startsWith('iOS'),
      statusBarHeight: app.globalData.systemInfo.statusBarHeight
    });
  },
  // 获取当前位置
  getLocation() {
    wx.getLocation({
      type: "wgs84",
      isHighAccuracy: true,
      success: res => {
        app.globalData.location.latitude = res.latitude;
        app.globalData.location.longitude = res.longitude;
        request({
          url: api.map,
          method: 'get',
          data: {
            lat: res.latitude,
            lng: res.longitude
          }
        })
          .then(res => {
            if (res.code == "I0000") {
              let live = res.data.province + res.data.city + res.data.district;
              this.setData({
                live
              })
            } else {
              wx.showToast({
                title: res.msg || '获取当前位置异常',
                icon: 'none'
              })
            }
          })
      },
      fail(err) {
        console.log(err)
        if (err.errMsg == "getLocation:fail auth denied") {
          wx.showToast({
            title: "网络异常",
            icon: 'none'
          })
        } else if (err.errMsg == "getLocation:fail auth deny") {
          wx.showToast({
            title: "定位失败,请打开位置信息",
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: "定位失败",
            icon: 'none'
          })
        }
      }
    })
  },
  // 监听页面滚动
  onPageScroll(e) {
    if (e.scrollTop > 30) {
      if (this.data.status) {
        this.setData({ status: false })
      }
    } else {
      if (!this.data.status) {
        this.setData({ status: true })
      }
    }
  },
  allRequest(){
    // 
    // this.getLocation(),
    let list = [this.getShopInfo(), this.getDataInfo(),this.getUserInfo(),this.getNotice(),this.layoutConfig(),this.getMsgCount(),this.setTabBarBadge(),this.getHomePageExt()];
    return Promise.all(list)
  },
  async onPullDownRefresh(){
    await this.allRequest();
    wx.stopPullDownRefresh();
    wx.showToast({
      title: '刷新成功',
      icon:'none'
    })
  },
  onShareAppMessage: function () {
      return {
        title: app.globalData.name || "维本生鲜",
        path:'/pages/index/index'
      }
  },
  onShareTimeline: function() {
    return {
      title: app.globalData.name || "维本生鲜",
      path:'/pages/index/index'
    }
  },
  onReachBottom(){
    // if (this.status) {
    //   this.offset += 1;
    //   this.getGoods(true)
    // }
  }
})
