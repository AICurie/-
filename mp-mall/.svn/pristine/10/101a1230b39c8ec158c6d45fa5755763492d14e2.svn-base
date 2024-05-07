import api from '../../utils/urlApi';
import request from '../../utils/request';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appId: '',
    baseUrl: '',
    content: '',
    proposeMobile: '',
    imgIdList: []
  },
  isKeep: true,
  onLoad(){
    let baseUrl = app.globalData.api + api.image;
    let appId = __wxConfig.accountInfo.appId;
    this.setData({
      appId,
      baseUrl
    })
  },
  uphandle(){
    
    wx.chooseImage({
      count: 1,
      success: res => {
        console.log("res", res)
        let token = wx.getStorageSync('token') || '';
        wx.uploadFile({
          url: app.globalData.api + api.files,
          filePath: res.tempFilePaths[0],
          name: "file",
          header: {
            Authorization: token
          },
          success: res => {
            console.log("res ", res)
            if (res.statusCode == 200) {
              let data = JSON.parse(res.data);
              let images = this.data.imgIdList;
              images.push(data.data);
              this.setData({
                imgIdList: images
              })
            } else {
              wx.showToast({
                title: res.msg || "上传失败",
                icon: 'none'
              })
            }
          },
          fail: err => {
            wx.showToast({
              title: err.msg || "上传失败",
              icon: 'none'
            })
          }
        })
      }
    })
  },
  delImage(e) {
    let { idx } = e.currentTarget.dataset;
    let images = this.data.imgIdList;
    images.splice(idx, 1);
    this.setData({
      imgIdList: images
    })
  },
  changeStr(e){
    let { str } = e.currentTarget.dataset;
    let { value } = e.detail;
    this.setData({
      [str]: value
    })
  },

  subHandle(){
    let userInfo = app.globalData.userInfo;
    if (userInfo.merchantMemberId && userInfo.status == 1) {
      if (this.isKeep) {
        this.isKeep = false;
        if (!this.data.content) {
          wx.showToast({
            title: '请输入意见内容',
            icon: 'none'
          })
          this.isKeep = true;
          return
        }
        if (this.data.proposeMobile) {
          if (!/^1[3456789]\d{9}$/.test(this.data.proposeMobile)) {
            wx.showToast({
              title: '手机号码格式有误',
              icon: 'none'
            })
            this.isKeep = true;
            return
          }
        }
        request({
          url: api.submitFeedback,
          method: 'post',
          data: {
            content: this.data.content,
            proposeMobile: this.data.proposeMobile,
            imgIdList: this.data.imgIdList
          }
        }).then(res => {
          if (res.code == "I0000") {
            wx.showToast({
              title: '操作成功',
              icon: 'none'
            })
            setTimeout(() => {
              this.isKeep = true;
              wx.navigateBack({
                delta: 1,
              })
            }, 1200)
          } else {
            this.isKeep = true;
            wx.showToast({
              title: res.msg || "操作失败",
              icon: 'none'
            })
          }
          
        },err => {
          this.isKeep = true;
          wx.showToast({
            title: err.msg || "操作失败",
            icon: 'none'
          })
        })
      }
    } else {
      wx.showModal({
        content:`您还不是会员，请提交认证信息，等待认证通过后继续操作`,
        confirmText:"去认证",
        confirmColor:"#60b533",
        success: res => {
          if(res.confirm) {
            wx.navigateTo({
              url: '/pages/login/auth',
            })
          }
        }
      })
    }
  },
})