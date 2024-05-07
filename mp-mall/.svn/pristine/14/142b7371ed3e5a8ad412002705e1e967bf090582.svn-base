// pages/remarks/remaks.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerRemark:'',
    list:['请打电话，不要敲门','快到的时候，提前联系','袋子不要打死结','若人不在，放在门口']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  changeItem(e){
    let customerRemark = e.currentTarget.dataset.item;
    this.setData({customerRemark})
  },
  changeIpt(e){
    let val = e.detail.value;
    this.setData({
      customerRemark:val
    })
  },

  btn(){
    let pages = getCurrentPages();
    let page = pages[pages.length - 2];
    page.setData({customerRemark:this.data.customerRemark})
    wx.navigateBack({
      delta: 1,
    })
  }
})