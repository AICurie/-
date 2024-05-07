import request from '../../utils/request';
import api from '../../utils/urlApi';
import { getImageUrl } from '../../utils/request';
const app = getApp();


Page({
  limit: 10,
  offset: 1,
  getMoreStatus: true,
  data: {
    search_nicht: 'search_nicht.png',
    key: '',
    goods: [],
    skuName: '',
    status: false,
    isIos: false,
    vido_txt: "加载中",
    statusBarHeight: 0
  },
  onLoad: function (options) {
    let search = wx.getStorageSync('search') || [];
    let userInfo = app.globalData.userInfo;
    let appId = __wxConfig.accountInfo.appId;
    this.setData({ search, userInfo, appId, baseUrl: app.globalData.api + api.image, })
    this.setData({
      search_nicht: app.globalData.type == 'special' ? 'search_nicht-' + app.globalData. marchantCode + '.png' : 'search_nicht.png',
    });
    this.getSystemInfo()
  },
  getSystemInfo() {
    this.setData({
      isIos: app.globalData.systemInfo.system.startsWith('iOS'),
      statusBarHeight: app.globalData.systemInfo.statusBarHeight
    });
  },
  backhandle(){
    wx.navigateBack({
      delta: 1
    })
  },
  changeKey(e) {
    let key = e.detail.value;
    this.setData({
      key
    })
  },
  search() {  // 搜索
      if (this.data.key.length > 0) {
        let search = this.data.search;
        if (search.length >= 4) {
          search.pop()
        }
        let idx = search.indexOf(this.data.key);
        if (idx != -1) {
          search.splice(idx, 1)
        }
        search.unshift(this.data.key);
        wx.setStorageSync('search', search)
        this.limit = 10;
        this.getMoreStatus = true;
        this.setData({ search,  skuName: this.data.key, status: true, goods: [], vido_txt: "加载中..." })
        request({
          url: api.goods_list,
          data: {
            skuName: this.data.key
          }
        })
          .then(async res => {
            console.log(res)
            if (res.code == "I0000") {
              let goods = res.elements;
              if (goods.length && goods.length > 0) {
                goods.map(item => {
                  if (item.goodsImgId) {
                    item.image = getImageUrl(item.goodsImgId, app.globalData.systemInfo.screenWidth / 2);
                  }
                });
                this.setData({ goods })
              } else {
                this.setData({vido_txt: "未找到该商品"})
              }
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
              this.setData({vido_txt: "未找到该商品"})
            }
          })
      } else {
        wx.showToast({
          title: '请输入搜索内容',
          icon:'none'
        })
      }
  },
  getMore() { // 加载更多
    if (this.getMoreStatus) {
      this.getMoreStatus = false;
      request({
        url: api.goods_list,
        data: {
          skuName: this.data.skuName,
          offset: this.offset,
          limit: this.limit
        }
      }).then(async res => {
        let oldList = this.data.goods;
        let newList = res.elements;
        if (newList.length >= this.limit || this.offset < res.totalPages) {
          this.getMoreStatus = true;
        } else {
          this.getMoreStatus = false;
          // wx.showToast({
          //   title: '已加载全部',
          //   icon: 'none'
          // })
        }
        newList.map(item => {
          if(item.goodsImgId){
            item.image = getImageUrl(item.goodsImgId, app.globalData.systemInfo.screenWidth / 2);
          }
        });
        let goods = oldList.concat(newList);
        this.setData({ goods });
      })
    }
  },
  detail(e) { // 商品详情
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?goodsId=' + id,
    })
  },
  cancel() { // 取消
    if (this.data.status) {
      this.offset = 1;
      this.getMoreStatus = true;
      this.setData({ status: false, goods: [],key:'' })
    }
  },
  // addCar(e) { // 加入购物车
  //   let userInfo = app.globalData.userInfo;
  //   if (userInfo && userInfo.mobile) {
  //     let num = e.currentTarget.dataset.num || 0;
  //     if (num <= 999) {
  //       let id = e.currentTarget.dataset.id;
  //       request({ url: api.shoppingCar, method: 'post', data: { skuId: id, qty: 1 } })
  //         .then(res => {
  //           if (res.code == "I0000") {
  //             wx.showToast({
  //               title: '已加入购物车',
  //               icon: 'none'
  //             })
  //             if (!app.globalData.status) {
  //               app.globalData.status = true;
  //             }
  //             if (!app.globalData.getCar) {
  //               app.globalData.getCar = true;
  //             }
  //           } else {
  //             wx.showToast({
  //               title: res.msg,
  //               icon: 'none'
  //             })
  //           }
  //         })
  //     } else {
  //       wx.showToast({
  //         title: '购物车数量不能大于999',
  //         icon:'none'
  //       })
  //     }
  //   } else {
  //     wx.redirectTo({
  //       url: '/pages/login/login?url=/pages/search/search',
  //     })
  //   }
  // },
  
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
          url: '/pages/login/login?url=/pages/search/search',
        })
      }
    },
  reset() { //清空搜索框
    this.setData({ key: '' })
  },
  searchTap(e) { // 点击历史搜索
    let key = e.currentTarget.dataset.item;
    this.setData({ key });
    this.search();
  },
  cleSearch() { // 清空搜索记录
    this.setData({ search: [] })
    wx.setStorageSync('search', [])
  },
  imageError(e){
    let { idx } = e.currentTarget.dataset;
    let str = `goods[${idx}].image`
    this.setData({[str]:''})
  },
  onReachBottom: function () { // 下拉加载
    if (this.getMore) {
      this.offset += 1;
      this.getMore()
    }
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