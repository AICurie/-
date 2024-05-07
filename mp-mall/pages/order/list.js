import request from '../../utils/request';
import api from '../../utils/urlApi';
import {getImageUrl} from '../../utils/request';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    id:'',
    limit:10,
    offset:1,
    status:true,
    afterSaleBtnFlag: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let goods = app.globalData.goods;
    let id = options.id;
    if (id) {
      this.setData({id})
      this.getList()
    } else {
      this.setData({goods,status:false})
    }
  },
  getList(){
    if(this.data.status) {
      this.setData({status:false})
      wx.showLoading({
        title: '加载中...',
      })
      request({
        url:api.order_goods,
        data:{
          orderId:this.data.id,
          limit:this.data.limit,
          offset:this.data.offset
        }
      }).then(async res => {
        if(res.code == "I0000") {
          let oldList = this.data.goods;
          let newList = res.elements;
          wx.hideLoading()

          newList.map(item => {
            if(item.imgId){
              item.image = getImageUrl(item.imgId, app.globalData.systemInfo.screenWidth / 2);
            }
          });
          let goods = oldList.concat(newList);
          this.setData({goods});
          if(newList.length >= this.data.limit || this.data.offset < res.totalpages) {
            this.setData({status:true})
          } else {
            // wx.showToast({
            //   title: '已加载全部',
            //   icon:'none'
            // })
          }
        } else {
          wx.showToast({
            title: res.msg || "加载异常",
            icon:'none'
          })
        }
      })
    }
  },
  imageError(e){
    let { idx } = e.currentTarget.dataset;
    let str = `goods[${idx}].image`
    this.setData({[str]:''})
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      if(this.data.status) {
        this.setData({offset:this.data.offset+=1})
        this.getList()
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