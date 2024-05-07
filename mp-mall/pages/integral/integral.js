import request from '../../utils/request';
import api from '../../utils/urlApi';
const app = getApp();
Page({

  data: {
    list:[],
    point:0,
    type:[0],
    ranking: '',
    pointTotal: '',
    pointTotalSpend: ''
  },
  getPointDetail(){
    // console.log("api.getPointDetail", api.getPointDetail)
    request({
      url: api.integral,
      method: 'get'
    }).then(code => {
      console.log('code', code)
      if (code.code == "I0000") {
        this.setData({
          list: code.elements,
        }) 
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = app.globalData.userInfo;
    if(userInfo) {
      this.setData({point:userInfo.point, pointTotal: userInfo.pointTotal, pointTotalSpend: userInfo.pointTotalSpend,ranking: userInfo.ranking})
    }
    this.getPointDetail()
  },

  // onLoad: function (type) {
  //   let userInfo = app.globalData.userInfo;
  //   if(userInfo.type) {
  //     this.setData({type:userInfo.type})
  //   }
  //   this.gettypeDetail()
  // },
  onShow(){
    // request({
    //   url:api.integral
    // }).then(res => {
    //   if(res.code == "I0000") {
    //     let list = res.elements;
    //     this.setData({list})
    //   } else {
    //     wx.showToast({
    //       title: res.msg || "加载异常",
    //       icon:'none'
    //     })
    //   }
    // })
  },
  getUserInfo(){ // 重新获取用户信息
    request({
      url:api.userInfo
    }).then(res => {
      if(res.code= "I0000") {
        app.globalData.userInfo = res.data;
        let point = res.data.point;
        let userInfo = res.data;
        this.setData({point,userInfo,point:userInfo.point, pointTotal: userInfo.pointTotal, pointTotalSpend: userInfo.pointTotalSpend,ranking: userInfo.ranking})
        wx.setStorageSync('userInfo', res.data)
      } 
    })
  },
  allRequest(){
    let ls = [this.getPointDetail(), this.getUserInfo()];
    return Promise.all(ls);
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
    if (app.globalData.type == "single") {
      return {
        title: app.globalData.name || "维本生鲜",
        path:'/pages/cellars/cellars'
      }
    } else {
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
  },
  onShareTimeline: function() {
    return {
      title: app.globalData.name || "维本生鲜",
      path:'/pages/index/index'
    }
  },
  //send
  send: function(){
    wx.request({
      url: api.integral,
      data: {
        point: '',
        accuPoint: '',
        type: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  }

})