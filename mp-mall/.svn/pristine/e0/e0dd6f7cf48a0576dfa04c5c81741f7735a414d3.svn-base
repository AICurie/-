import request from '../../utils/request';
import api from '../../utils/urlApi';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailStatus:'',
    transportNo:'',
    traces:'',
    show:true,
    obj:{},
    ids:[],
    name:'',
  },
  orderNo:'',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // let ids = options.ids;
    let ids = JSON.parse(options.ids);
    let name = options.name;
    this.orderNo = options.orderNo;
    this.setData({ids,name})
    this.getRoute(ids[0].transportNo,this.orderNo);
  },
  getRoute(props,orderNo){
    let id = props;
    if (typeof props == "object") {
      id = id.currentTarget.dataset.id;
    }
    wx.showLoading();
    if (this.data.obj[id]){
      if (id == this.data.transportNo) {
        this.setData({show:!this.data.show})
      } else {
        this.setData({transportNo:id})
      }
      wx.hideLoading();
    } else {
      request({
        url:api.route + id + '/'+ orderNo || this.orderNo
      }).then(res => {
        wx.hideLoading();
        if(res.code == "I0000") {
          let data = res.data;
          let traces = data.traceList || [];
          for( let i = 0, len = traces.length; i < len; i++) {
            traces[i].idx = i;
          }
          traces.sort((a,b) => b.idx - a.idx);
          let obj = this.data.obj;
          obj[id] = {detailStatus:data.detailStatus,traces};
          this.setData({
            obj,
            transportNo:id,
            show:true
          })
        } else {
          wx.showToast({
            title: res.msg || "加载异常",
            icon:'none'
          })
        }
      },err => {
        wx.showToast({
          title: err.msg || "加载异常",
          icon:'none'
        })
      })
    }
  
  }

})