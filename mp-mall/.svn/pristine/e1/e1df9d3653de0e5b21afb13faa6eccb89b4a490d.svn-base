import api from '../../utils/urlApi';
import request from "../../utils/request";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  status: true,
  offset: 1,
  limit: 11,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  getList(more){
    
    if (this.status) {
      this.status = false;
      wx.showLoading({
        title: '加载中...',
      })
      request({
        url: api.msgInfo,
        method: 'get',
        data: {
          offset: this.offset,
          limit: this.limit
        }
      }).then(res => {
        wx.hideLoading();
        console.log("res ", res)
        if (res.code == "I0000") {
          let newList = res.elements;
          if (newList.length >= this.limit) {
            this.status = true;
          }
          let oldList = this.data.list;
          this.setData({
            list: more ? oldList.concat(newList) : newList
          })
        }
      },err => {
        wx.hideLoading();
      })
    }
    
  },
  toDetail(e){
    let { idx } = e.currentTarget.dataset;
    let { id } = this.data.list[idx];
    this.setData({
      [`list[${idx}].status`]: 1
    })
    wx.navigateTo({
      url: '/pages/user/messaged?id=' + id
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom")
    if (this.status) {
      this.offset += 1;
      this.getList(true);
    }
  },
  allRequest(){
    // ,this.getOrderList()
    const list = [this.getList()];
    return Promise.all(list)
  },
  async onPullDownRefresh(){
    this.status = true;
    this.offset = 1;
    await this.allRequest();
    wx.stopPullDownRefresh();
    wx.showToast({
      title: '刷新成功',
      icon:'none'
    })
  },
})