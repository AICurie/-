import request from '../../utils/request';
import api from '../../utils/urlApi';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    idx:0,
    choice:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.choice){
      this.setData({choice:options.choice})
    }
  },
  onShow(){
    this.getList()
  },
  // 删除地址
  del(e){
    wx.showModal({
      content:"即将删除该地址",
      confirmText:"删除",
      confirmColor:"#EF2322",
      success: res => {
        if (res.confirm){
          let id = e.currentTarget.dataset.id;
          request({
            url:api.del_address + id,
            method:'delete'
          })
          .then(res => {
            if(res.code == "I0000") {
              let idx = e.currentTarget.dataset.idx;
              let list = this.data.list;
              list.splice(idx,1)
              this.setData({
                list
              })
              wx.showToast({
                title: '删除成功',
                icon:'none'
              })
            } else {
              wx.showToast({
                title: res.msg||'删除失败',
                icon:'none'
              })
            }
          })
        }
      }
    })
  },
   //修改地址
  edit(e){
    wx.navigateTo({
      url: '/pages/address/add?item=' + e.currentTarget.dataset.item,
    })
  },
  // 获取地址列表
  getList(){
    request({
      url:api.address,
      method:'get'
    }).then(res => {
      console.log(res)
      if(res.code == "I0000") {
        let list = res.elements;
        if(list.length == 1 && list[0].isDefault == 0) {
          this.changeDefault(list[0].id)
        }
        this.setData({
          list
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
    })
  },
  // 设为默认
  changeDefault(e){
    let id = 0;
    if (typeof e == "object") {
      id = e.currentTarget.dataset.id;
    } else {
      id = e;
    }
    request({
      url:api.defaultAddress + id,
      method:'put'
    }).then(res => {
      if(res.code == "I0000") {
        this.getList()
      } else {
        wx.showToast({
          title: res.msg||'操作异常',
          icon:'none'
        })
      }
    })
  },
  choice(e){
    let idx = e.currentTarget.dataset.idx;
    this.setData({idx});
    let pages = getCurrentPages();
    let page = pages[pages.length - 2];
    page.setData({address:this.data.list[idx]})
    wx.navigateBack({
      delta: 1,
    })
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