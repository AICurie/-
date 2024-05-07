import api from '../../utils/urlApi';
import request from '../../utils/request';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    star: 100,
    item: {},
    images: [],
    baseUrl: "",
    appId: "",
    canvasHeight: 0,
    canvasWidth: null,
    commentContent: ""
  },
  slider1change(e){
    console.log('e', e)
    console.log('e.detail.value', e.detail.value)
    this.setData({
      star: e.detail.value
    })
  },
  uphandle(){
    
    wx.chooseImage({
      count: 1,
      success: res => {
        console.log("res", res)
        wx.showLoading({ title: '处理中...' });
        let token = wx.getStorageSync('token') || '';
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
              console.log("res ", res)
              wx.hideLoading();
              if (res.statusCode == 200) {
                let data = JSON.parse(res.data);
                if (data.code == "I0000") {
                  let images = this.data.images;
                  images.push(data.data);
                  this.setData({
                    images
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
  delImage(e) {
    let { idx } = e.currentTarget.dataset;
    let images = this.data.images;
    images.splice(idx, 1);
    this.setData({
      images
    })
  },
  inputhandle(e){
    let { str } = e.currentTarget.dataset;
    let val = e.detail.value;
    this.setData({
      [str]: val
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { id, item } = options;
    console.log("item ", item);
    let baseUrl = app.globalData.api + api.image;
    let appId = __wxConfig.accountInfo.appId;
    this.setData({
      id,
      appId,
      baseUrl,
      item: JSON.parse(item)
    })
  },

  subHandle(){

    let commentContent = this.data.commentContent;
    if (!commentContent) {
      wx.showToast({
        title: '请输入评价内容',
        icon: 'none'
      })
      return
    }
    let orderId = this.data.id;
    let item = this.data.item;
    let commentScore = this.data.star / 20;
    let imgIds = this.data.images;
    let data = {
      orderId,
      orderDetailId: item.id,
      itemId: item.itemId,
      skuId: item.skuId,
      commentScore,
      commentType: 0,
      commentContent,
      commentExtendModel: {
        imgIds
      }
    };
    request({ url: api.comment, method: "post", data: [data] })
    .then(async res => {
      console.log(res)
      if (res.code == "I0000") {
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1200)
      } else {
        wx.showToast({
          title: res.msg || "提交失败",
          icon: 'none'
        })
      }
    })

  },

})