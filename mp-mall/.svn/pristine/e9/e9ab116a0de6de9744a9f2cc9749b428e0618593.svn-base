import request from '../../utils/request';
import api from '../../utils/urlApi';
import { getImageUrl } from '../../utils/request';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateSite: [],
    list: [],
    idx: 0,
    baseUrl: '',
    appId: '',
    userInfo: {},
    seckillSiteId: '',
    nowTimeStamp: ''
  },
  type: "1",
  inter: null,
  status: true,
  offset: 1,
  limit: 10,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let baseUrl = app.globalData.api + api.image;
    let appId = __wxConfig.accountInfo.appId;
    let userInfo = app.globalData.userInfo;
    this.setData({
      appId,
      baseUrl,
      userInfo
    })
  },
  getCurrentDateSite(){
    request({
      url: api.getCurrentDateSite
    }).then(res => {
      console.log("res ", res)
      if (res.code == "I0000") {
        let dateSite = res.data;
        let date = new Date();
        let y = date.getFullYear();
        let M = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0'+(date.getMonth() + 1);
        let D = date.getDate();
        let dateStr = y+'/'+M+'/'+D+ ' ';
        let nowTimeStamp = this.data.nowTimeStamp;
        let seckillSiteId = '';
        let idx = 0;
        let seckillId = '';
        for (let i = 0, len = dateSite.length; i < len; i++) {
          if (dateSite[i].startTime) {
            dateSite[i].startTimeStamp = new Date(dateStr+dateSite[i].startTime).getTime();
          }
          if (dateSite[i].endTime) {
            dateSite[i].endTimeStamp = new Date(dateStr+dateSite[i].endTime).getTime();
          }
          if (dateSite[i].startTime && dateSite[i].endTime) {
            if (dateSite[i].startTimeStamp < nowTimeStamp && dateSite[i].endTimeStamp > nowTimeStamp) {
              seckillSiteId = dateSite[i].id;
              seckillId = dateSite[i].id;
              idx = i;
            }
          }
        }
        if (!seckillSiteId) {
          for (let i = 0, len = dateSite.length; i < len; i++) {
            if (dateSite[i].startTime && dateSite[i].endTime) {
              if (dateSite[i].startTimeStamp > nowTimeStamp) {
                seckillSiteId = dateSite[i].id;
                idx = i;
                break;
              }
            }
          }
        }
        if (!seckillSiteId) {
          seckillSiteId = dateSite[dateSite.length -1].id;
          idx = dateSite.length -1;
        }
        this.setData({
          idx,
          dateSite,
          seckillId,
          seckillSiteId
        })
        console.log("seckillSiteId", seckillSiteId)
        this.getSeckillSiteSKU()
      }
    })
  },
  getSeckillSiteSKU(more){
    if (this.status) {
      this.status = false;
      request({
        url: api.getSeckillSiteSKU,
        data: {
          offset: this.offset,
          limit: this.limit,
          seckillSiteId: this.data.seckillSiteId,
          type: this.type
        }
      }).then(res => {
        console.log("res ", res)
        if (res.code == "I0000") {
          let newlist = res.elements;
          let oldlist = this.data.list;
          for (let i = 0, len = newlist.length; i < len; i++) {
            if (newlist[i].imgId) {
              newlist[i].image = getImageUrl(newlist[i].imgId, 200, 200);
            }

            let availableStock = newlist[i].availableStock || 0;
            let shipStock = newlist[i].shipStock || 0;
            let all = (availableStock*1) + (shipStock*1);
            newlist[i].progress = (Number((all - shipStock)/all)*100).toFixed(1);
            newlist[i].progressw = (Number(shipStock/all)*100).toFixed(1);
          }
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
  // addCar(e) { // 加入购物车
  //   let userInfo = app.globalData.userInfo;
  //   if (userInfo && userInfo.mobile) {
  //     let num = e.currentTarget.dataset.num || 0;
  //     if (num <= 999) {
  //       let { id, skusource, activitysiteid, activityskuid, activityid } = e.currentTarget.dataset;
  //       request({ 
  //         url: api.shoppingCar, method: 'post', 
  //         data: { 
  //           skuId: id, 
  //           activityId: activityid,
  //           activitySiteId: activitysiteid,
  //           activitySkuId: activityskuid,
  //           skuSource: skusource, 
  //           qty: 1 
  //         } 
  //       })
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
  //             this.status = true;
  //             this.offset = 1;
  //             this.getSeckillSiteSKU()
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
  
  addCar(e) { // 加入购物车
    let userInfo = app.globalData.userInfo;
    if (userInfo && userInfo.mobile) {
      let memberLimit = app.globalData.memberLimit;
      
        let { id, skusource, activitysiteid, activityskuid, activityid, item } = e.currentTarget.dataset;


        request({ 
          url: api.shoppingCar, method: 'post', 
          data: { 
            skuId: id, 
            activityId: activityid,
            activitySiteId: activitysiteid,
            activitySkuId: activityskuid,
            skuSource: skusource, 
            qty: 1 
          } 
        })
          .then(res => {
            if (res.code == "I0000") {
              wx.showToast({
                title: '已加入购物车',
                icon: 'none'
              })
              if (!app.globalData.status) {
                app.globalData.status = true;
              }
              if (!app.globalData.getCar) {
                app.globalData.getCar = true;
              }
              this.status = true;
              this.offset = 1;
              this.getSeckillSiteSKU()
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          })
    } else {
      wx.redirectTo({
        url: '/pages/login/login?url=/pages/search/search',
      })
    }
  },
  toOrider(e) {
    
    let userInfo = app.globalData.userInfo;
    let memberLimit = app.globalData.memberLimit;
    if(memberLimit) {
      if (userInfo.merchantMemberId && userInfo.status == 1) {
        let { id, skusource, activitysiteid, activityskuid, activityid, item } = e.currentTarget.dataset;
        item.qty = 1;
        item.price = (item.activityUnitPrice / 100).toFixed(2);
        item.activitySkuId = item.id;
        let goods = [item];
        let allPrice = item.activityUnitPrice;
        let showPrice = item.activityUnitPrice / 100;
        app.globalData.goods = goods;
        wx.navigateTo({
          url: '/pages/order/create?allPrice=' + allPrice + '&showPrice=' + showPrice
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
      let { id, skusource, activitysiteid, activityskuid, activityid, item } = e.currentTarget.dataset;
      let goods = [item];
      let allPrice = item.basicSkuPrice;
      let showPrice = item.basicSkuPrice / 100;
      app.globalData.goods = goods;
      app.globalData.goods = goods;
      wx.navigateTo({
        url: '/pages/order/create?allPrice=' + allPrice + '&showPrice=' + showPrice
      })
    }
},

  
  changTab(e){
    let { id, idx } = e.currentTarget.dataset;
    let seckillSiteId = this.data.seckillSiteId;
    if (id != seckillSiteId) {
      this.status = true;
      this.offset = 1;
      this.setData({idx, seckillSiteId: id});
      this.getSeckillSiteSKU()
    }
  },
  detail(e) { // 商品详情
    let id = e.currentTarget.dataset.id;
    let activitySiteId = e.currentTarget.dataset.activitysiteid;
    let activityId = e.currentTarget.dataset.activityid;
    let activitySkuId = e.currentTarget.dataset.activityskuid;
    let seckillSiteId = e.currentTarget.dataset.seckillsiteid;
    wx.navigateTo({
      url: `/pages/detail/detail?goodsId=${id}&activitySiteId=${activitySiteId}&activityId=${activityId}&activitySkuId=${activitySkuId}&skuSource=1&seckillSiteId=${seckillSiteId}`,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      nowTimeStamp: Date.now()
    })
    this.getCurrentDateSite();
    this.handleInter();
  },
  handleInter(){
    let inter = setTimeout(this.handleInter,1000);
    this.setData({
      nowTimeStamp: Date.now()
    })
    this.inter = inter;
    // this.checksess();
  },
  checksess(){
    let dateSite = this.data.dateSite;
    let nowTimeStamp = this.data.nowTimeStamp;
    let id = null;
    let idx = 0;
    let seckillSiteId = this.data.seckillSiteId;
    for (let i = 0, len = dateSite.length; i < len; i++) {
      if (dateSite[i].startTimeStamp < nowTimeStamp && dateSite[i].endTimeStamp > nowTimeStamp) {
        id = dateSite[i].id;
        idx = i;
      }
    }
    if (id && id != seckillSiteId) {
      this.setData({
        idx,
        seckillSiteId: id
      })
      this.status = true;
      this.offset = 1;
      this.getSeckillSiteSKU()
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("this.inter", this.inter)
    if (this.inter) {
      clearTimeout(this.inter);
      this.inter = null;
    }
  },
  onReachBottom: function () {
    if (this.status) {
      this.offset += 1;
      this.getSeckillSiteSKU(true);
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.inter) {
      clearTimeout(this.inter);
      this.inter = null;
    }
  }
})