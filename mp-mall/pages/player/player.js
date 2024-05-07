const app = getApp()
import api from '../../utils/urlApi';
import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wechat: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderId = options.id;
    let price = options.price;
    this.setData({ orderId, price })
  },
  changePlayer(e) {
    let wechat = e.currentTarget.dataset.item;
    if (wechat != this.data.wechat) {
      this.setData({ wechat })
    }
  },
  player() {
    console.log(this.data);
    let that = this;
    request({
      url: api.payment + that.data.orderId,
      method: 'post'
    }).then(res => {
      console.log(res)
      if (res.code == "I0000") {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.dataPackage,
          paySign: res.data.paySign,
          signType: res.data.signType,
          success: res => {
            console.log(res, 111);
            wx.redirectTo({
              url: '/pages/player/res?id=' + that.data.orderId + `&status=${true}`,
            });
          },
          fail: err => {
            console.log(err, 2222);
            wx.redirectTo({
              url: '/pages/player/res?id=' + that.data.orderId,
            });
          }
        })
      } else {
        wx.redirectTo({
          url: '/pages/player/res?id=' + that.data.orderId,
        });
      }
    });
  },
  back() {
    wx.showModal({
      content: "即将离开支付页面，请在24小时内完成支付",
      confirmText: "离开",
      success: res => {
        if (res.confirm) {
          if (app.globalData.type == "single") {
            wx.switchTab({
              url: '/pages/cellars/cellars',
            })
          } else {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      }
    })
  }
})