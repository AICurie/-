import request from '../../utils/request';
import api from '../../utils/urlApi';
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
     status:true,
     orderId:'',
     time:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let orderId = options.id;
      let status = options.status ? true : false;
      this.timeOut();
      this.setData({status,orderId});
  },
  timeOut(){
    if(this.status){
      let time = 3;
      this.setData({time})
      let intval = setInterval(()=>{
        if(time <= 0) {
          time = '';
          this.setData({time})
          clearInterval(intval)
        }
        time -= 1;
        this.setData({time})
      },1000)
    }
  },
  detail(){
    wx.redirectTo({
      url: '/pages/order/info?id='+this.data.orderId,
    })
  },
  index(){
       if (app.globalData.type == "single") {
        wx.switchTab({
          url: '/pages/cellars/cellars',
        })
      } else {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
  },
  changeStatus(){
      request({
        url:api.payment + this.data.orderId,
        method:'post'
      }).then(res => {
        console.log(res)
        if(res.code == "I0000") {
          wx.requestPayment({
            timeStamp:res.data.timeStamp,
            nonceStr:res.data.nonceStr,
            package:res.data.dataPackage,
            paySign:res.data.paySign,
            signType:res.data.signType,
            success: res => {
              console.log(res)
              this.setData({status:true})
              this.timeOut()
            },
            fail:err => {
              console.log(err)
              wx.showToast({
                title: '支付失败',
                icon:'none'
              })
            }
          })
        } else {
          wx.showToast({
            title: res.msg || "支付异常",
            icon:'none'
          })
        }
      })
  },
  back(){
    wx.switchTab({
      url: '/pages/car/car',
    })
  }
})