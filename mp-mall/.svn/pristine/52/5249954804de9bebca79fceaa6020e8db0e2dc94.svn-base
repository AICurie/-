import request from '../../utils/request';
import api from '../../utils/urlApi';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:false,
    phone:'',
    code:'',
    code_txt:"获取验证码",
    num:0,
    userInfo:'',
    url:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(options.userInfo) {
        this.setData({userInfo:options.userInfo})
      }
      if (options.url) {
        this.setData({url:options.url})
      }
      if (options.goodsId) {
        this.setData({goodsId:options.goodsId})
      }
      wx.setNavigationBarTitle({
        title: app.globalData.name
      })
  },
  // 输入手机，验证码
  changeipt(e){
    let item = e.currentTarget.dataset.item;
    let val = e.detail.value;
    this.setData({
      [item]:val
    })
  },
  // 获取验证码
  getcode(){
    if(this.data.disabled) return;
    let phone = this.data.phone;
    let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if(reg.test(phone)){
      
      request({url:api.sendCode,data:{mobile:phone,type:1},method:'post',header:{"content-type":"application/json"},errMsg:"发送失败"})
      .then(res => {
        if (res.data) {
          wx.showToast({
            title: '发送成功',
            icon:'none'
          })
          let time = 60;
          this.setData({
            code_txt:'重新发送' + '(' +time + 's' + ')',
            disabled:true,
            num:this.data.num+=1
          })
          let inter = setInterval(()=>{
            time -= 1;
            if(time >= 1) {
              time = time >= 10 ? time : '0' + time;
              this.setData({
                code_txt:'重新发送' + '(' +time + 's' + ')'
              })
            } else {
              clearInterval(inter)
              this.setData({
                code_txt:'重新发送',
                disabled:false
              })
            }
          },1000)
        } else {
          wx.showToast({
            title: res.msg || '发送失败',
            icon:'none'
          })
        }
      })
    } else {
      wx.showToast({
        title: '手机号格式不正确',
        icon:'none'
      })
    }
  },
  // 手机号登录
  login(){
    try {
      let phone = this.data.phone;
      let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if(!reg.test(phone)) throw '手机号格式不正确';
      let captchaCode = this.data.code;
      if(!captchaCode) throw '请输入验证';
      this.loginAjax(phone,captchaCode)
      // wx.showToast({
      //   title: '登录成功',
      //   icon:'none'
      // })
      // wx.setStorageSync('wxUserInfo', true)
      // setTimeout(() => {
      //   if (this.data.url) {
      //     if (this.data.goodsId) {
      //       wx.reLaunch({
      //         url: this.data.url + '?goodsId=' + this.data.goodsId,
      //       })
      //     } else {
      //       wx.reLaunch({
      //         url: this.data.url
      //       })
      //     }
      //   } else {
      //     wx.reLaunch({
      //       url: '/pages/user/user'
      //     })
      //   }
      // },1200)
    } catch (error) {
      if(typeof error == "string") {
        wx.showToast({
          title: error,
          icon:'none'
        })
      }
    }
    
  },
  // 手机号登录请求处理函数
  loginAjax(mobile,captchaCode){
    request({
      url:api.login_mobile,
      method:'post',
      data:{mobile,captchaCode},
      header:{"content-type":"application/json"},
      errMsg:"登录异常,请重试"
    }).then(res => {
        if(res.code == 'I0000') {
          wx.showToast({
            title: '登录成功',
            icon:'none'
          })
          app.globalData.userInfo = res.data;
          app.globalData.memberLimit = res.data.memberLimit
          wx.setStorageSync('userInfo', res.data)
          setTimeout(()=>{
            if(this.data.url) {
              if (this.data.goodsId) {
                wx.reLaunch({
                  url: this.data.url + '?goodsId=' + this.data.goodsId,
                })
              } else {
                wx.reLaunch({
                  url: this.data.url,
                })
              }
            } else {
              wx.reLaunch({
                url: '/pages/user/user',
              })
            }
          },1200)
        } else {
          wx.showToast({
            title: res.msg,
            icon:"none"
          })
        }
    })
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
  // 微信获取手机号登录
  getPhoneNumber(e){
    if(e.detail.errMsg == "getPhoneNumber:ok") {
      request({
        url:api.login_mp,
        data:{
          encryptedData:e.detail.encryptedData,
          iv:e.detail.iv
        },
        errMsg:"登录异常,请重试",
        method:'post'
      }).then(res =>{
        console.log(res);
        if(res.code == "I0000") {
           wx.showToast({
              title: '登录成功',
              icon:'none'
            })
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
                    url: this.data.url,
                  })
                }
              } else {
                wx.reLaunch({
                  url: '/pages/user/user',
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
        title: '登录异常',
        icon:'none'
      })
    }
  }
})