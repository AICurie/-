import api from '../../utils/urlApi';
import request from '../../utils/request';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: '',
    applyType: '',
    reason: '',
    needRefundAmount: '',
    applyDesc: '',
    array: [],
    imgs: [],
    baseUrl: "",
    id: "",
    appId: '',
    canvasHeight: 0,
    canvasWidth: null
  },
  id: '',
  orderDetailId: '',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { id, item, applyType, orderDetailId } = options;
    let baseUrl = app.globalData.api + api.image;
    this.id = id;
    this.orderDetailId = orderDetailId || '';
    let appId = __wxConfig.accountInfo.appId;
    this.setData({
      item: JSON.parse(item),
      applyType,
      baseUrl,
      appId
    })
    this.applyReason();
    if(orderDetailId) {
      this.getDetail();
    }
    let { pixelRatio } = wx.getSystemInfoSync();
    console.log("pixelRatio", pixelRatio)
    this.pixelRatio = pixelRatio;
  },
  getDetail(){
    request({
      url: api.getOrderInfo + this.id + '/' + this.orderDetailId
    }).then(res => {
      console.log("res ", res)
      if (res.code == "I0000") {
        let item = res.data.detail[0];
        this.setData({
          id: item.id,
          reason: item.reason,
          needRefundAmount: (item.needRefundAmount > 0 ? (item.needRefundAmount / 100) : 0),
          applyDesc: item.applyDesc,
          imgs: item.extendModel.imgIds
        })
      }
    })
  },
  bindPickerChange(e){
    console.log("e ", e)
    let { value } = e.detail;
    this.setData({
      reason: this.data.array[value].name
    })
  },
  changePrice(e){
    let { value } = e.detail;
    console.log('value ', value)
    let needRefundAmount = 0;
    if (!isNaN(value)) {
      let maxNum = (this.data.item.skuPrice / 100) * this.data.item.skuSum;
      if (value >= maxNum) {
        needRefundAmount = maxNum;
      } else {
        needRefundAmount = value;
      }
    } else {
      needRefundAmount = 0;
    }
    this.setData({
      needRefundAmount
    })
  },
  changeDesc(e){
    let { value } = e.detail;
    this.setData({
      applyDesc: value
    })
  },
  upimgHandle(e){
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      success: res => {
        console.log("res", res)
        wx.showLoading({
          title: '处理中...'
        })
        let token = wx.getStorageSync('token') || '';
        console.log("res.tempFilePaths[0] ", res.tempFilePaths[0])
        this.compressImage(res.tempFilePaths[0], file => {
          console.log("file ", file)
          wx.uploadFile({
            url: app.globalData.api + api.files,
            filePath: file,
            name: "file",
            header: {
              Authorization: token
            },
            success: res => {
              wx.hideLoading();
              console.log("res ", res)
              if (res.statusCode == 200) {
                let data = JSON.parse(res.data);
                if (data.code == "I0000") {
                  let imgs = this.data.imgs;
                  imgs.push(data.data);
                  this.setData({
                    imgs
                  })
                } else {
                  wx.hideLoading();
                  wx.showToast({
                    title: data.msg || '上传失败',
                    icon: 'none'
                  })
                }
              } else {
                wx.hideLoading();
                wx.showToast({
                  title: '上传失败',
                  icon: 'none'
                })
              }
            },
            fail: err => {
              wx.hideLoading();
              wx.showToast({
                title: '上传失败',
                icon: 'none'
              })
            }
          })
        })
      }
    })
  },
  compressImage(path, callback) {
    var that = this;
    console.log("path ", path)
    //获取图片信息
    wx.getImageInfo({
      src: path,
      success: res => {
        console.log("res ", res)
        var ctx = wx.createCanvasContext('CanvasId'); // 创建画布
        var towidth = res.width > 750 ? 750 : res.width;  //设置canvas尺寸，按宽度500px的比例压缩
        var toheight = res.height == res.width ? towidth : Math.trunc(towidth*res.height/res.width);  //根据图片比例换算出图片高度
        that.setData({ canvasHeight: toheight, canvasWidth: towidth });
        ctx.drawImage(path, 0, 0, res.width, res.height, 0, 0, towidth, toheight);
        ctx.draw(false, () => {
          wx.canvasToTempFilePath({
            canvasId: 'CanvasId',
            fileType:"jpg",
            destWidth: towidth,
            destHeight: toheight,
            quality: 0.8, // 注意你的压缩质量，卤煮真的压缩出20KB的，图片整个都是糊的
            success: function (res) {
              console.log(res.tempFilePath);
              callback(res.tempFilePath);
            },
            fail: err => {
              wx.hideLoading();
              wx.showToast({
                title: '上传失败',
                icon: 'none'
              })
            }
          }, this)
        })
        // setTimeout(()=>{

        // },2000)
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    });
  },
  delHandle(e) {
    let { idx } = e.currentTarget.dataset;
    let imgs = this.data.imgs;
    imgs.splice(idx, 1);
    this.setData({
      imgs
    })
  },
  applyReason(){
    request({
      url: api.applyReason,
      method: 'get',
      data: {
        afterSaleType: 1
      }
    }).then(res => {
      console.log("res ", res)
      let array = res.data.map(item => ({id: item.id, name: item.applyReason}))
      this.setData({
        array
      })
    })
  },
  topagehandle(e){
    
    try {
      let reason = this.data.reason;
      if (!reason) throw '请选择申请原因';
      request({
        url: this.orderDetailId ? (api.afterSaled + this.data.id) : api.afterSale,
        method: this.orderDetailId ? 'put' : 'post',
        data: {
          orderId: this.id,
          orderDetailId: this.data.item.id,
          afterSaleType: 1,
          applyType: this.data.applyType,
          reason,
          needRefundAmount: (this.data.needRefundAmount*100) || 0,
          applyDesc: this.data.applyDesc,
          extendModel: {
            imgIds: this.data.imgs
          }
        }
      }).then(res => {
        console.log("res ", res)
        if (res.code == "I0000") {
          wx.showToast({
            title: '提交成功',
            icon: 'none'
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/aftersale/info'
            })
          }, 1200)
        } else {
          wx.showToast({
            title: res.msg || '操作失败',
            icon: 'none'
          })
        }
        
      })
    } catch (error) {
      if (typeof error == "string") {
        wx.showToast({
          title: error,
          icon: 'none'
        })
      } else {
        console.log("error ", error)
      }
    }

    
    // let { url } = e.currentTarget.dataset;
    // wx.navigateTo({
    //   url
    // })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  }
})