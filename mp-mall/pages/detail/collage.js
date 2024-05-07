import request from '../../utils/request';
import api from '../../utils/urlApi';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    listItem: {},
    nowTimeStamp: '',
    isHideCollage: true
  },
  id: '',
  offset: 1,
  limit: 10,
  status: true,
  inter: null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { id } = options;
    this.id = id;
    this.getList();
  },
  getList(more){
    if (this.status) {
      this.status = false;
      request({
        url: api.goodsGroupBuying + this.id,
        data: {
          offset: this.offset,
          limit: this.limit
        }
      }).then(res => {
        console.log("res ", res)
        if (res.code == "I0000") {
          let newlist = res.elements;
          let oldlist = this.data.list;
          for (let i = 0, len = newlist.length; i < len; i++) {
            newlist[i].groupBuyingEndTimeStamp = new Date(newlist[i].groupBuyingEndTime).getTime();
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
  showCollage(e){
    let { item } = e.currentTarget.dataset;
    this.setData({
      listItem: item,
      isHideCollage: false
    })
  },
  hideCollage(){
    this.setData({
      isHideCollage: true
    })
  },
  stopHandle(){},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.inter) {
      this.handleInter();
    }
  },
  handleInter(){
    let inter = setTimeout(this.handleInter,1000);
    this.setData({
      nowTimeStamp: Date.now()
    })
    this.inter = inter;
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.inter) {
      clearTimeout(this.inter);
      this.inter = null;
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
  },
  addCar() {
    let userInfo = app.globalData.userInfo;
    if (userInfo && userInfo.mobile) {
      let skuId = this.id;
        request({ url: api.shoppingCar, method: 'post', data: { skuId, qty: 1 } })
        .then(res => {
          if (res.code == "I0000") {
            wx.showToast({
              title: '已加入购物车',
              icon: 'none'
            })
            this.offset = 1;
            this.status = true;
            this.getList();
            if (!app.globalData.status) {
              app.globalData.status = true;
            }
            if (!app.globalData.getCar) {
              app.globalData.getCar = true;
            }
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        })
        
    } else {
      wx.redirectTo({
        url: '/pages/login/login?url=/pages/collage/collage&id=' + this.id,
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.status) {
      this.offset += 1;
      this.getList(true);
    }
  }
})