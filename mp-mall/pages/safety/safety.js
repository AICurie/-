import request from '../../utils/request';
import api from '../../utils/urlApi';
import {setToken} from '../../utils/request';
const app = getApp()
Page({
  contact: '',
  data: {
    mobile:'',
    version: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = app.globalData.userInfo;
    this.setData({mobile:userInfo.mobile,version: app.globalData.accountInfo.miniProgram.version + " " + app.globalData.accountInfo.miniProgram.envVersion});
    request({
      url:api.getMobile
    }).then(res => {
      console.log(res)
      if(res.code == "I0000") {
        this.contact = res.data;
          // this.setData({mobile:res.data})
      }
    })
  },
  logout(){
    wx.showModal({
      content:"即将退出，是否继续？",
      success(res){
        if(res.confirm){
          request({url:api.logout,method:'post',errMsg:"退出异常，请重试"})
          .then(res => {
            console.log(res)
            if(res.code == 'I0000') {
              wx.showToast({
                title: '退出成功',
                icon:'none'
              })
              wx.setStorageSync('token', '')
              wx.setStorageSync('userInfo', '')
              app.globalData.userInfo = '';
              app.globalData.getCar = true;
              app.globalData.status = true;
              app.globalData.order_status = true;
              console.log(app.globalData)
              setToken();
              setTimeout(() => {
                if (app.globalData.type == "single") {
                  wx.switchTab({
                    url: '/pages/cellars/cellars',
                  })
                } else {
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                }
              },1200)
            } else {
              wx.showToast({
                title: '操作异常',
                icon:'none'
              })
            }
          })
        }
      }
    })
  },
  call(){
    if(this.contact) {
      wx.showModal({
        content:`拨打${this.contact}咨询`,
        confirmText:"拨打",
        confirmColor:"#EF2322",
        success: res => {
          if(res.confirm) {
            wx.makePhoneCall({
              phoneNumber: this.contact
            })
          }
        }
      })
    } else {
      request({
        url:api.getMobile
      }).then(res => {
        if(res.code== "I0000") {
          this.contact = res.data;
          wx.showModal({
            content:`拨打${res.data}咨询`,
            confirmText:"拨打",
            confirmColor:"#EF2322",
            success: res => {
              if(res.confirm) {
                wx.makePhoneCall({
                  phoneNumber: res.data
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon:'none'
          })
        }
      })
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