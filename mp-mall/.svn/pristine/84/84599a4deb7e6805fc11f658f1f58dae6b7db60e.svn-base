import request from '../../utils/request';
import api from '../../utils/urlApi';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    live: "",
    areainfo: "",
    type: '1',
    businessLicenseImg: '',
    facadeImg: '',
    idCradFront: '',
    idCradBack: '',
    recommender: "",
    baseUrl: "",
    shop: {
      entName: "",
      userName: "",
      mobile: "",
      lat: '',
      lng: '',
      address: '',
      province: "",
      city: "",
      area: "",
      live: ''
    },
    team: {
      entName: "",
      userName: "",
      mobile: "",
      lat: '',
      lng: '',
      province: "",
      city: "",
      area: "",
      address: '',
      live: ''
    },
    showBtn: true,
    canvasHeight: 0,
    canvasWidth: 0
  },
  isSub: true,
  inputHandle(e){
    let { str } = e.currentTarget.dataset;
    this.setData({
      [str]: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("app ", app)
    
    let baseUrl = app.globalData.api + api.image;
    let appId = __wxConfig.accountInfo.appId;
    this.setData({appId,baseUrl})
    this.getCertification();
  },
  getCertification(){
    request({
      url: api.getCertification
    }).then(res => {
      console.log("res ", res)
      if (res.code == "I0000") {
        if (res.data){
          let str = res.data.type == 1 ? 'shop' : 'team';
          let data = res.data;
          this.setData({
            [`${str}.entName`]: data.entName,
            [`${str}.userName`]: data.userName,
            [ `${str}.mobile`]: data.mobile,
            [`${str}.province`]: data.provinceRegion,
            [`${str}.city`]: data.cityRegion,
            [`${str}.area`]: data.addressRegion,
            [`${str}.address`]: data.address,
            [`${str}.lat`]: data.lat,
            [`${str}.lng`]: data.lng,
            recommender: data.recommender,
            businessLicenseImg: data.businessLicenseImg,
            facadeImg: data.facadeImg,
            idCradFront: data.idCradFront,
            idCradBack: data.idCradBack,
            type: data.type,
            showBtn: data.status == 0 || data.status == 1 || data.status == 3 ? false : true
          })
        }
          
      }
    })
  },
  showCity(){
    if (this.data.showBtn) {
      this.setData({
        show:true
      })
    }
  },
  changeCity(e){ // 选择地址
    if(e instanceof Object) {
      let address = e.detail.currentTarget.dataset;
      let str = 'shop';
      if (this.data.type == 0) {
        str = 'team';
      }
      this.setData({
        show:false,
        [`${str}.province`]:address.province,
        [`${str}.city`]:address.city,
        [`${str}.area`]:address.area,
        [`${str}.live`]: address.province +  address.city + address.area
      })
    }
  },
  getShopCenter(){
    let data = this.data.shop;
    // + data.street
    let customerAddress = data.province + data.city + data.area  + data.address;
    if (customerAddress != '') {
      return request({
        url: api.getLocation + '?location='+customerAddress,
        method:'get',
      })
      .then(res => {
        if (res.code == "I0000") {
          let latStr = 'shop.lat';
          let lngStr = ''
          this.setData({
            [latStr]: res.data.lat,
            lng: res.data.lng,
            
          })
        }
      })
    } else {
      this.setData({
        lat: '',
        lng: ''
      })
    }
    
  },
  changTab(e){
    let { val } = e.currentTarget.dataset;
    let type = this.data.type;
    if (type != val) {
      this.setData({
        type: val,
        // areainfo: "",
        // businessLicenseImg: '',
        // facadeImg: '',
        // idCradFront: '',
        // idCradBack: '',
        // shop: {
        //   entName: "",
        //   userName: "",
        //   mobile: "",
        //   lat: '',
        //   lng: '',
        //   province: "",
        //   city: "",
        //   area: "",
        //   address: '',
        //   live: ''
        // },
        // team: {
        //   entName: "",
        //   userName: "",
        //   mobile: "",
        //   lat: '',
        //   lng: '',
        //   province: "",
        //   city: "",
        //   area: "",
        //   address: '',
        //   live: ''
        // },
        // recommender: ""
      })
    }
  },
  getLocation(e){
    if (this.data.showBtn) {
    wx.getLocation({
      type: 'wgs84',
      isHighAccuracy: true,//开启高精度定位
      success: res => {
          console.log("res" ,res)
          let latitude = res.latitude
          let longitude = res.longitude
          wx.chooseLocation({
            latitude,
            longitude,
            success: res => {
              console.log("res", res)
              let { str } = e.currentTarget.dataset;
              let strLat = str+'.lat';
              let strLng = str + '.lng';
              let strArea = str + '.address';
              let strAreaVal = res.name || this.data[str].address;
              this.setData({
                [strArea]: strAreaVal,
                [strLat]: res.latitude,
                [strLng]: res.longitude
              })
            }
          })
      },
      fail: err => {
        console.log("err", err)
      }
    })
  }
  },
  upimgHandle(e){
    if (this.data.showBtn) {
    let { str } = e.currentTarget.dataset;
    wx.chooseImage({
      count: 1,
      success: res => {
        console.log("res", res)
        wx.showLoading({ title: '处理中...' });
        let token = wx.getStorageSync('token') || '';
        this.compressImage(res.tempFilePaths[0], file => {
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
                  this.setData({
                    [str]: data.data
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
        
        // this.setData({
        //   [str]: res.tempFilePaths
        // })
      }
    })
  }
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
  subHandle(e){
    if (e.detail.errMsg == "getUserInfo:ok") {
      if(this.isSub) {
        this.isSub = false;
        try {
          let type = this.data.type;
          let {
            entName,
            userName,
            mobile,
            address,
            province,
            lat,
            city,
            area,
            lng
          } = type == 1 ? this.data.shop : this.data.team;
          let headImgUrl = e.detail.userInfo.avatarUrl;
          console.log("type " ,type)
          let {
            recommender,
            facadeImg,
            businessLicenseImg,
            idCradFront,
            idCradBack
          } = this.data;
          if (type == 1) {
            if (!entName) throw "请输入店铺名称";
            if (!facadeImg) throw "请上传店面照";
            if (!province || !city || !area) throw "请选择所属地区";
          } else {
            if (!entName) throw "请输入人员名称";
            if (!province || !city || !area) throw "请选择团体收货地址";
            if (!idCradFront) throw '请上传身份证正面';
            if (!idCradBack) throw '请上传身份证反面';
          }
          if (!userName) throw '请输入联系人';
          if (!mobile) throw "请输入联系人手机号";
          if (!/^1[3456789]\d{9}$/.test(mobile)) throw '手机号格式有误'
          if (!address) throw "请输入详细地址";
          if (!lat || !lng) throw "请获取定位信息";
          if (recommender) {
            let reg = /^[a-zA-Z]{1}\d{5}$/.test(recommender);
            if (!reg) throw "推荐人格式有误";
          }
          request({
            url: api.submitCertification,
            method: 'post',
            data: {
              provinceRegion: province,
              cityRegion: city,
              addressRegion: area,
              entName,
              userName,
              mobile,
              address,
              lat,
              lng,
              type,
              idCradBack,
              idCradFront,
              recommender,
              facadeImg,
              businessLicenseImg,
              headImgUrl
            }
          }).then(res => {
            this.isSub = true;
            console.log("res ", res)
            if (res.code == "I0000") {
              let pages = getCurrentPages();
              let page = pages[pages.length - 2];
              if (page.getUserInfo){
                page.getUserInfo(true);
              }
              wx.showToast({
                title: '认证信息提交成功',
                icon: "none"
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
                })
              },1200)
              
            } else {
              wx.showToast({
                title: res.msg || "操作失败",
                icon: "none"
              })
            }
          }, err => {
            this.isSub = true;
            wx.showToast({
              title: err.msg || '操作失败',
              icon: 'none'
            })
          })
        } catch (error) {
          this.isSub = true;
          if (typeof error == "string") {
            wx.showToast({
              title: error,
              icon: 'none'
            })
          } else {
            console.log("error ", error)
          }
        }
      }
      
    }
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: app.globalData.name
    })
  }
})