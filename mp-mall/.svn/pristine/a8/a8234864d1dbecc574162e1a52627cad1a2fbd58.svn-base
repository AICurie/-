import api from '../../utils/urlApi';
import request from '../../utils/request';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: '1',
    id: '',
    baseUrl: "",
    appId: "",
    list: []
  },
  status: true,
  offset: 1,
  limit: 10,
  endStr: '',
  startStr: '',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let baseUrl = app.globalData.api + api.image;
    let nowdate = new Date();
    let yy = nowdate.getFullYear();
    let MM = (nowdate.getMonth() + 1) >= 10 ? (nowdate.getMonth() + 1) : ('0' + (nowdate.getMonth() + 1));
    let DD = nowdate.getDate()>=10?nowdate.getDate():('0'+nowdate.getDate());
    let endStr = `${yy}-${MM}-${DD}`;
    let startDate = new Date(Date.now() - (1000*60*60*24*7));
    let startY = startDate.getFullYear();
    let startM = (startDate.getMonth() + 1) >= 10? (startDate.getMonth() + 1) : ('0'+(startDate.getMonth() + 1));
    let startD = startDate.getDate() >= 10 ? startDate.getDate() : ('0'+startDate.getDate());
    let startStr = `${startY}-${startM}-${startD}`;
    this.endStr = endStr;
    this.startStr = startStr;
    let appId = __wxConfig.accountInfo.appId;
    this.setData({
      id,
      appId,
      baseUrl
    })
    this.getlist();
  },
  viewImage(e){
    let { item, idx } = e.currentTarget.dataset;
    
  },
  changtab(e){
    let { val } = e.currentTarget.dataset;
    let tab = this.data.tab;
    if (val != tab) {
      this.setData({tab: val});
      this.status = true;
      this.offset = 1;
      this.getlist();
    }
  },
  getlist(more){
    if (this.status) {
      this.status = false;
      let data = {
        itemId: this.data.id,
        offset: this.offset, 
        limit: this.limit,
        commentType: 0,
        approveStatus: 1
      }
      if (this.data.tab == 2) {
        data.commentDateFrom = this.startStr;
        data.commentDateTo = this.endStr;
      } else if (this.data.tab == 3) {
        data.commentExtend = 1;
      }
      request({ url: api.commentp, data })
      .then(async res => {
        console.log(res)
        if (res.code == "I0000") {
          let newlist = res.elements;
          let oldlist = this.data.list;
          if (newlist.length >= this.limit) {
            this.status = true;
          }
          this.setData({
            list: more ?  oldlist.concat(newlist) : newlist
          })

        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
      this.getlist(true);
    }
  }
})