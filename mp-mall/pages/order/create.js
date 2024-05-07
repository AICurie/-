import request from '../../utils/request';
import api from '../../utils/urlApi';
import {formaDate, formatNumber} from '../../utils/util';
let app = getApp();
let allExchangePoint = 0;
Page({
  data: {
    integral:true,
    online:true,
    hidden:true,
    active:true,
    goods:[],
    allPrice:0,
    address:'',
    date:'',
    customerRemark:'',
    signed:false,
    exchangePoint:0,
    cha:0,
    amtPoint: 0,
    point:0,
    pointStatus:true,
    templates:[],
    tplName:'',
    template:{
      fee:0,
      templateName:'请选择配送方式'
    },
    tplPop:true,
    isBusiness: true,
    baseUrl: '',
    appId: ''
  },
  check:true,

  businessHandle(){ // 闪送营业时间范围
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    return (h > 8 || (h == 8 && m >= 30)) && (h < 20 || (h == 20 && m < 30))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = formaDate(new Date());
    let goods = app.globalData.goods;
    let allPrice = options.allPrice;
    let showPrice = Math.fround(options.showPrice*100);
    let userInfo = app.globalData.userInfo;
    let signed = userInfo.signed;
    let pointOffset = userInfo.pointOffset;
    let baseUrl = app.globalData.api + api.image;
    let appId = __wxConfig.accountInfo.appId;
    this.setData({baseUrl,appId, goods,allPrice,showPrice,date,signed,pointOffset, isBusiness: this.businessHandle()})
    request({
      url:api.address
    }).then(res => {
      console.log(res)
      if(res.code == "I0000") {
        let el = res.elements
        if (el.length > 0) {
          for(let i = 0, len = el.length; i < len; i++) {
            if(el[i].isDefault == 1) {
              let address = el[i];
              this.getLogistics(address)
              this.setData({address})
              break;
            }
          }
        }
      }
    })
    this.getUserInfo()
  },
  onShow(){
    console.log(this.data.goods)

    if (this.data.address) {
      this.getLogistics(this.data.address)
    }
  },
  getLogistics(address,fn){ // 获取配送方式
    console.log('address', address)
    let userInfo = app.globalData.userInfo
    console.log('userInfo',userInfo)
    this.setData({templates:[],template:{fee:0,templateName:'请选择配送方式'}})
    if ((!address.lat || !address.lng) && (!userInfo.merchantMemberId)) {
      wx.showModal({
        content: "请重新编辑或更换收货地址",

      }).then(res => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/address/address?choice='+true,
          })
        }
      })
    } else {
      let customerAddress = address.customerProvince + address.customerCity + address.customerDistrict + address.customerAddress;
      let goods = this.data.goods;
      let skusNumber = 0;
      for(let i = 0,len = goods.length; i < len; i++) {
        skusNumber += goods[i].qty;
      }
      let skusTotalFee = (this.data.showPrice);
      let distribution = {
        customerAddress,
        postcode: address.postcode,
        customerMobileNo:address.customerMobileNo,
        customerName:address.customerName,
        customerGender:address.customerGender,
        customerRemark: this.data.customerRemark,
        customerProvince: address.customerProvince,
        customerCity: address.customerCity,
        customerDistrict: address.customerDistrict,
        customerStreet: address.customerStreet || '',
        customerAddressDetail: address.customerAddressDetail || '',
        lat: address.lat,
        lng: address.lng
      }
      let dateNow = new Date()
      let preNo = dateNow.getFullYear() + formatNumber(dateNow.getMonth() + 1) + formatNumber(dateNow.getDate()) + formatNumber(dateNow.getHours()) + formatNumber(dateNow.getMinutes()) + formatNumber(dateNow.getSeconds()) + this.formatNum(dateNow.getMilliseconds())
      console.log('preNo',preNo)
      request({
        url:api.merchantLogistics,
        method: 'post',
        data:{
          detail: this.data.goods.map(item => ({
            skuSum: item.qty,
            skuDiscount: item.discount,
            skuPrice: item.skuPrice,
            skuId: item.skuId,
            skuName: item.name,
            skuUnit: item.skuUnit,
            imgId: item.imgId,
            skuWeight: item.skuWeight || 0
          })),
          distribution,
          skusNumber,
          skusTotalFee,
          orderPrice:this.data.allPrice,
          exchangePoint:this.data.exchangePoint,
          exchangePointAmt:this.data.chaPrice,
          payMethod:this.data.online ? 1 : 2,
          preNo
        }
      }).then(res => {
        if (res.code == "I0000") {
          let list = res.data;
          let template = {
            fee:0,
            templateName:'请选择配送方式'
          };
          for (let i = 0, len = list.length; i < len; i++) {
            // if (address.customerCity == "杭州市") {
              if (userInfo.merchantMemberId) {
                if (list[i].isDefault == 1 || i == len -1) {
                  template = list[i]
                  break;
                }
              } else {
                if ((list[i].isCustomDefault == 1 && this.businessHandle()) || i == len -1) {
                  template = list[i]
                  break;
                }
              }
            // } else {
            //   if (list[i].logisticsType == 3) {
            //     template = list[i]
            //     break;
            //   }
            // }
          }
          this.setData({templates:list,template})
          if (fn) {
            fn()
          }
        } else {
          wx.showToast({
            title: res.msg || "配送方式获取失败",
            icon:'none'
          })
        }
      })
    }
    
  },
  formatNum(n){
    n = n.toString()
    if (n[3]) {
      return n
    } else if (n[2]) {
      return '0'+n
    } else if (n[1]) {
      return '00'+n
    } else {
      return '000'+n
    }
  },
  changeTpl(e){ // 切换配送方式
    let item = e.currentTarget.dataset.item;
    console.log('item', item)
    if (item.logisticsType == 4 && (item.resultcode == 0) && !this.businessHandle()) {
      if (!this.businessHandle()) {
        wx.showToast({
          title: '非营业时间，请选择其他配送方式',
          icon: 'none'
        })
      } else{
        wx.showToast({
          title: '当前选项不可选',
          icon: 'none'
        })
      }
      
    } else {
      let idx = e.currentTarget.dataset.idx;
      let list = this.data.templates;
      for (let i = 0, len = list.length; i < len; i++) {
        if (idx == i) {
          list[i].isDefault = 1;
        } else {
          list[i].isDefault = 0;
        }
      }
      this.setData({
        templates:list,
        template:item
      })
    }
      
  },
  create(){ // 提交订单
      if(this.data.address.id) {

        if(this.data.template.templateId) {
          if (this.check) {
            let h = new Date().getHours()
            if (h >= 20 && this.data.template.logisticsType != 4) {
              wx.showModal({
                title: '发货提醒',
                content: this.data.template.expectedDelivery || `预计${this.data.date}配送`,
                success: res => {
                  if (res.confirm) {
                    this.check = false;
                    let detail = [];
                    let list = this.data.goods;
                    for(let i = 0, len = list.length; i < len; i++) {
                      let obj = {
                        skuDiscount:list[i].discount,
                        skuPrice:list[i].skuPrice,
                        skuSum:list[i].qty,
                        skuId:list[i].skuId,
                        skuName:list[i].name,
                        skuUnit:list[i].skuUnit,
                        imgId: list[i].imgId,
                        activityId: list[i].activityId || '',
                        activitySiteId: list[i].activitySiteId || '',
                        activitySkuId: list[i].activitySkuId || '',
                        skuSource: list[i].skuSource || '',
                        skuWeight: list[i].skuWeight || 0
                      }
                      detail.push(obj)
                    }
                    let ress = this.data.address;
                    let distribution = {
                      customerAddress: ress.customerProvince+ress.customerCity+ress.customerDistrict+(ress.customerStreet || '')+(ress.customerAddressDetail || ''),
                      customerMobileNo:ress.customerMobileNo,
                      customerName:ress.customerName,
                      postcode: ress.postcode,
                      customerGender:ress.customerGender,
                      customerRemark: this.data.customerRemark,
                      customerProvince: ress.customerProvince,
                      customerCity: ress.customerCity,
                      customerDistrict: ress.customerDistrict,
                      customerStreet: ress.customerStreet || '',
                      customerAddressDetail: ress.customerAddressDetail || '',
                      lat: ress.lat || '',
                      lng: ress.lng || ''
                    }
                    let dateNow = new Date()
                    let preNo = dateNow.getFullYear() + formatNumber(dateNow.getMonth() + 1) + formatNumber(dateNow.getDate()) + formatNumber(dateNow.getHours()) + formatNumber(dateNow.getMinutes()) + formatNumber(dateNow.getSeconds()) + this.formatNum(dateNow.getMilliseconds())

                    request({
                      url:api.order,
                      method:'post',
                      data:{
                        detail,
                        distribution,
                        orderPrice:this.data.allPrice,
                        orderRealPrice:(this.data.showPrice*1) + (this.data.template.fee*1),
                        exchangePoint:this.data.exchangePoint,
                        exchangePointAmt:this.data.chaPrice,
                        payMethod:this.data.online ? 1 : 2,
                        templateId:this.data.template.templateId,
                        transportMoney:this.data.template.fee,
                        logisticsType: this.data.template.logisticsType,
                        pickUpAddress: this.data.template.pickUpAddress || '',
                        longitude: this.data.template.longitude || '',
                        latitude: this.data.template.latitude || '',
                        preNo
                      }
                    }).then(res => {
                      if(res.code == "I0000") {
                        app.globalData.status = true;
                        if(!app.globalData.getCar) {
                          app.globalData.getCar = true;
                        }
                        this.getUserInfo();
                        if(this.data.online) {
                          wx.redirectTo({
                            url: '/pages/player/player?id='+res.data + '&price=' + ((this.data.showPrice*1) + (this.data.template.fee*1  || 0))
                          })
                        } else {
                          wx.redirectTo({
                            url: '/pages/order/info?id=' + res.data,
                          })
                        }
                        this.check = true;
                      } else {
                        
                        this.check = true;
                        if(!app.globalData.getCar) {
                          app.globalData.getCar = true;
                        }
                        wx.showModal({
                          title: '下单失败',
                          content: res.msg,
                          showCancel: false,
                          success: res => {}
                        })
                      }
                    },err => { 
                      this.check = true;
                      if(!app.globalData.getCar) {
                        app.globalData.getCar = true;
                      }
                    })
                  }
                }
              })
            } else {
              this.check = false;
              let detail = [];
              let list = this.data.goods;
              for(let i = 0, len = list.length; i < len; i++) {
                let obj = {
                  skuDiscount:list[i].discount,
                  skuPrice:list[i].skuPrice,
                  skuSum:list[i].qty,
                  skuId:list[i].skuId,
                  skuName:list[i].name,
                  skuUnit:list[i].skuUnit,
                  imgId: list[i].imgId,
                  activityId: list[i].activityId || '',
                  activitySiteId: list[i].activitySiteId || '',
                  activitySkuId: list[i].activitySkuId || '',
                  skuSource: list[i].skuSource || '',
                  skuWeight: list[i].skuWeight || 0
                }
                detail.push(obj)
              }
              let ress = this.data.address;
              let distribution = {
                customerAddress: ress.customerProvince+ress.customerCity+ress.customerDistrict+(ress.customerStreet || '')+(ress.customerAddressDetail || ''),
                  customerMobileNo:ress.customerMobileNo,
                  customerName:ress.customerName,
                  postcode: ress.postcode,
                  customerGender:ress.customerGender,
                  customerRemark: this.data.customerRemark,
                  customerProvince: ress.customerProvince,
                  customerCity: ress.customerCity,
                  customerDistrict: ress.customerDistrict,
                  customerStreet: ress.customerStreet || '',
                  customerAddressDetail: ress.customerAddressDetail || '',
                  lat: ress.lat || '',
                  lng: ress.lng || ''
              }
              let dateNow = new Date()
              let preNo = dateNow.getFullYear() + formatNumber(dateNow.getMonth() + 1) + formatNumber(dateNow.getDate()) + formatNumber(dateNow.getHours()) + formatNumber(dateNow.getMinutes()) + formatNumber(dateNow.getSeconds()) + this.formatNum(dateNow.getMilliseconds())
              request({
                url:api.order,
                method:'post',
                data:{
                  detail,
                  distribution,
                  orderPrice:this.data.allPrice,
                  orderRealPrice:(this.data.showPrice*1) + (this.data.template.fee*1),
                  exchangePoint:this.data.exchangePoint,
                  exchangePointAmt:this.data.chaPrice,
                  payMethod:this.data.online ? 1 : 2,
                  templateId:this.data.template.templateId,
                  transportMoney:this.data.template.fee,
                  pickUpAddress: this.data.template.pickUpAddress || '',
                  longitude: this.data.template.longitude || '',
                  latitude: this.data.template.latitude || '',
                  preNo
                }
              }).then(res => {
                if(res.code == "I0000") {
                  app.globalData.status = true;
                  if(!app.globalData.getCar) {
                    app.globalData.getCar = true;
                  }
                  this.getUserInfo();
                  if(this.data.online) {
                    wx.redirectTo({
                      url: '/pages/player/player?id='+res.data + '&price=' + ((this.data.showPrice*1) + (this.data.template.fee*1  || 0))
                    })
                  } else {
                    wx.redirectTo({
                      url: '/pages/order/info?id=' + res.data,
                    })
                  }
                  this.check = true;
                } else {
                  if(!app.globalData.getCar) {
                    app.globalData.getCar = true;
                  }
                  this.check = true;
                  wx.showModal({
                    title: '下单失败',
                    content: res.msg,
                    showCancel: false,
                    success: res => {}
                  })
                }
              },err => { 
                this.check = true;
                if(!app.globalData.getCar) {
                  app.globalData.getCar = true;
                }
              })
            }
          } else {
            wx.showToast({
              title: '请勿重复提交',
              icon:'none'
            })
          }
        } else {
          wx.showToast({
            title: '请选择配送方式',
            icon:'none'
          })
        }
      } else {
        wx.showToast({
          title: '请选择收货地址',
          icon:'none'
        })
      }
  },
  getUserInfo(){ // 重新获取用户信息
    request({
      url:api.userInfo
    }).then(res => {
      if(res.code= "I0000") {
        let data = res.data;
        this.setData({point:data.point || 0})
        // if (data.point > 0 && data.pointOffset) {
        //   this.getPoint(data.point);
        // } else {
          this.setData({chaPrice:0,exchangePoint:0,showPrice:this.data.allPrice})
        // }
        app.globalData.userInfo = data;
        wx.setStorageSync('userInfo', data)
      } 
    })
  },
  imageError(e){
    let { idx } = e.currentTarget.dataset;
    let str = `goods[${idx}].image`
    this.setData({[str]:''})
  },
  showTplPop(){ // 展示&关闭配送弹窗
    if (this.data.tplPop && this.data.templates.length == 0) {
      this.getLogistics(this.data.address,()=>{
        this.setData({
          tplPop:!this.data.tplPop
        })
      })
    } else {
      this.setData({
        tplPop:!this.data.tplPop
      })
    }
    
  },
  changeActive(e){
    let active = e.currentTarget.dataset.item;
    if (active != this.data.active) {
      this.setData({
        active
      })
    }
  },
  open(){
    if(this.data.online != this.data.active) {
      this.setData({active:this.data.online})
    }
    this.setData({hidden:false})
  },
  close(e){
    let item = e.currentTarget.dataset.item;
    if(item) {
      if (this.data.online != this.data.active){
        if(!this.data.active) {
          this.setData({chaPrice:0,exchangePoint:0,showPrice:this.data.allPrice})
          this.getLogistics(this.data.address)
        } else {
          this.getPoint(0)
        }
        this.setData({
          online:this.data.active
        })

      }
    }
    this.setData({hidden:true})
  },

  getPoint(exchangePoint){ // 折扣计算
    if(this.data.pointOffset) {
      request({
        url:api.getExPoint,
        data:{
          exchangePoint: exchangePoint,
          orderPrice: this.data.allPrice
        },
        method:'post'
      }).then(res => {
        console.log(res)
        if(res.code == "I0000") {
          let data = res.data;
          let showPrice = this.data.allPrice-(data.amt || 0);
          if(data.amt > 0) {
            this.setData({chaPrice:data.amt,exchangePoint:data.point,showPrice, amtPoint: data.point})
          }  else {
            this.setData({chaPrice:0,exchangePoint:0,showPrice, amtPoint: 0})
          }
        } else {
          this.setData({chaPrice:0,exchangePoint:0})
        }
        this.getLogistics(this.data.address)
      })
    }
    
  },
  changePoint(e){ // 修改抵扣积分
    let point = e.detail.value;
    let exchangePoint = this.data.point;
    if(Number(point) <= Number(exchangePoint)) {
      allExchangePoint = point;
    } else {
      allExchangePoint = exchangePoint;
    }
  },
  setPoint(){ // 确定抵扣积分
    this.setData({exchangePoint:allExchangePoint,pointStatus:true});
    this.getPoint(allExchangePoint);
  },
  showPoint(){ // 展示抵扣积分
    if (this.data.exchangePoint == allExchangePoint) {
      this.setData({
        exchangePoint:this.data.point
      })
    } else {
      this.setData({exchangePoint:allExchangePoint,pointStatus:true});
    }
    this.getPoint(this.data.exchangePoint);
  },
  hidePoint(){ // 隐藏抵扣积分
    this.setData({pointStatus:true})
  },
  changeIntegral(){ // 是否使用积分
    let showPrice = Number(this.data.showPrice);
    let chaPrice = Number(this.data.chaPrice);
    let exchangePoint = this.data.point;
    if (this.data.integral) {
     showPrice += chaPrice;
     exchangePoint = 0;
    } else {
      showPrice -= chaPrice;
      let allPrice = this.data.allPrice;
      let cha = Math.floor(exchangePoint - Number(allPrice > 1?(allPrice/100):allPrice));
      if (cha >= 0) {
       exchangePoint -=  cha;
      } 
    }
    this.setData({
      integral:!this.data.integral,
      showPrice,
      exchangePoint
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