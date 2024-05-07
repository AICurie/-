import request from '../../utils/request';
import api from '../../utils/urlApi';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      url:'',
      userInfo:'',
      goodsId:'',
      check: false
  },
  checkhandle(){
    this.setData({
      check: !this.data.check
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.url) {
      this.setData({
        url:options.url
      })
    }
    if (options.goodsId) {
      this.setData({
        goodsId:options.goodsId
      })
    }
    wx.setNavigationBarTitle({
      title: app.globalData.name
    })
  },
  getUserInfoHandle(e){
    console.log('e', e)
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.showToast({
        title: '登录成功',
        icon:'none'
      })
      wx.setStorageSync('wxUserInfo', e.detail.userInfo)
      setTimeout(() => {
        if (this.data.url) {
          if (this.data.goodsId) {
            wx.reLaunch({
              url: this.data.url + '?goodsId=' + this.data.goodsId,
            })
          } else {
            wx.reLaunch({
              url: this.data.url
            })
          }
        } else {
          wx.reLaunch({
            url: '/pages/user/user'
          })
        }
      },1200)
    } else {
      wx.showToast({
        title: '登录失败,用户拒绝登录',
        icon:'none'
      })
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/index/index'
        })
      },1200)
    }
  },
  checktip(){
    wx.showToast({
      title: '请勾选同意后登录',
      icon: "none"
    })
  },
  getPhoneNumber(e){
    console.log("getPhoneNumber", e)
    if(e.detail.errMsg == "getPhoneNumber:ok") {
      // wx.showToast({
      //   title: '登录成功',
      //   icon:'none'
      // })
      // wx.setStorageSync('wxUserInfo', true)

      request({
        url:api.login_mp,
        data:{
          encryptedData:e.detail.encryptedData,
          iv:e.detail.iv
        },
        errMsg:'登录异常,请重试',
        method:'post'
      }).then(res =>{
        if(res.code == "I0000") {
          wx.showToast({
            title: '登录成功',
            icon:'none'
          })
          app.globalData.getCar = true;
          app.globalData.userInfo = res.data;
          app.globalData.memberLimit = res.data.memberLimit
          wx.setStorageSync('userInfo', res.data)
          setTimeout(()=>{
            if (this.data.url) {
              if (this.data.goodsId) {
                wx.reLaunch({
                  url: this.data.url + '?goodsId=' + this.data.goodsId,
                })
              } else {
                wx.reLaunch({
                  url: this.data.url
                })
              }
            } else {
              wx.reLaunch({
                url: '/pages/user/user'
              })
            }
          },1200)
        } else {
          wx.showToast({
            title: res.msg,
            icon:'none'
          })
        }
      })
    } else {
      wx.showToast({
        title: '已取消',
        icon:'none'
      })
    }
  },
  getUserInfo(){
    request({
      url:api.userInfo
    }).then(res => {
      console.log(res)
      if(res.code= "I0000") {
        app.globalData.userInfo = res.data;
      } else {
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
    })
  },
  mobile(){
    if (this.data.goodsId) {
      wx.navigateTo({
        url: '/pages/login/phone?url='+this.data.url + '&goodsId=' + this.data.goodsId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/phone?url='+this.data.url,
      })
    }
  }
})