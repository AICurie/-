
import request from '../../utils/request';
import api from '../../utils/urlApi';
import {setToken} from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    code:'',
    code_txt:"获取验证码"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  changeipt(e){
    let item = e.currentTarget.dataset.item;
    let val = e.detail.value;
    this.setData({
      [item]:val
    })
  },
  changePhone(){
    let phone = this.data.phone;
    if (/^[1][3,4,5,7,8,9][0-9]{9}$/.test(phone)) {
      let code = this.data.code;
      if(code) {
        // wx.showToast({
        //   title: '修改成功，请重新登录',
        //   icon:'none'
        // })
        // wx.setStorageSync('wxUserInfo', '');
        // setTimeout(() => {
        //   wx.redirectTo({url:'/pages/login/login'})
        // },1200)
        // return
        request({
          url:api.mobile,
          method:'post',
          data:{
            mobileNo:phone,
            captchaCode:code
          }
        }).then(res => {
          console.log(res)
          if(res.code == "I0000") {
              wx.showToast({
                title: '修改成功，请重新登录',
                icon:'none'
              })
              wx.setStorageSync('token','');
              wx.setStorageSync('phone', '');
              wx.setStorageSync('userId', '')
              setToken()
              setTimeout(() => {
                wx.redirectTo({url:'/pages/login/login'})
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
          title: '请输入验证码',
          icon:'none'
        })
      }
    } else {
      wx.showToast({
        title: '手机号格式有误',
        icon:"none"
      })
    }
    
  },
  getcode(){
    if(this.data.disabled) return;
    let phone = this.data.phone;
    let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if(reg.test(phone)){
      // wx.showToast({
      //   title: '发送成功',
      //   icon:'none'
      // })
      // let time = 60;
      // this.setData({
      //   code_txt:'重新发送' + '(' +time + 's' + ')',
      //   disabled:true,
      //   num:this.data.num+=1
      // })
      // let inter = setInterval(()=>{
      //   time -= 1;
      //   if(time >= 1) {
      //     time = time >= 10 ? time : '0' + time;
      //     this.setData({
      //       code_txt:'重新发送' + '(' +time + 's' + ')'
      //     })
      //   } else {
      //     clearInterval(inter)
      //     this.setData({
      //       code_txt:'重新发送',
      //       disabled:false
      //     })
      //   }
      // },1000)
      // return
      request({
        url:api.sendCode,
        data:{
          mobile:phone,
          type:2
        },
        method:'post'
      }).then(res => {
        if(res.data) {
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
            title: res.msg || "发送异常",
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
  }
})