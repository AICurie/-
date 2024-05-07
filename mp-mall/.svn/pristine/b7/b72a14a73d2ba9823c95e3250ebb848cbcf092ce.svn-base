import request from "../../utils/request";
import api from '../../utils/urlApi';
const app = getApp()
Page({
  data: {
    show:false,
    live:'',
    sex:1,
    tag:'',
    name:'',
    phone:'',
    address:'',
    postcode: "",
    customerAddress: '',
    customerAddressDetail: '',
    item:'',
    province:'浙江省',
    city:'杭州市',
    area:'拱墅区',
    street: '',
    num:0,
    lat: '',
    lng: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.item) {
      let item = JSON.parse(options.item);
      this.setData({
        item,
        name:item.customerName,
        phone:item.customerMobileNo,
        address:item.customerAddress,
        customerAddress: item.customerAddress,
        tag:item.customerLabel,
        sex:item.customerGender,
        postcode: item.postcode,
        province:item.customerProvince,
        city:item.customerCity,
        area:item.customerDistrict,
        street: item.customerStreet || '',
        lat: item.lat || '',
        lng: item.lng || '',
        customerAddressDetail: item.customerAddressDetail || ''
      })
    }
  },
  changeCity(e){ // 选择地址
    if(e instanceof Object) {
      let address = e.detail.currentTarget.dataset;
      this.setData({
        show:false,
        province:address.province,
        city:address.city,
        area:address.area,
        live: address.province +  address.city + address.area
      })
    }
  },
  async getCenter(){
    let data = this.data
    let customerAddress = data.province + data.city + data.area + data.street + data.customerAddressDetail;
    if (customerAddress != '') {
      return request({
        url: api.getLocation + '?location='+customerAddress,
        method:'get',
      })
      .then(res => {
        if (res.code == "I0000") {
          this.setData({
            lat: res.data.lat,
            lng: res.data.lng,
            customerAddress
          })
          return {
            lat: res.data.lat,
            lng: res.data.lng,
            customerAddress
          }
        }
      })
    } else {
      this.setData({
        lat: '',
        lng: ''
      })
      return {
        lat: '',
        lng: '',
        customerAddress
      }
    }
    
  },
  showCity(){
    this.setData({
      show:true
    })
  },
  changeActive(e){ // 选择标签
    let key = e.currentTarget.dataset.name;
    let val = e.currentTarget.dataset.item;
    if(this.data[key] != val) {
      this.setData({[key]:val})
    } else {
      if(key == 'tag') this.setData({tag:''})
    }
  },
  changeipt(e){ // 输入地址信息
    let item = e.currentTarget.dataset.item;
    let val = e.detail.value;
    
    if (item != 'name' && item != 'phone') {
      
      if (item == 'customerAddressDetail') {
        let data = this.data
        let customerAddressDetail = val
        if (customerAddressDetail.indexOf(data.province) > -1) {
          let provinceReg = RegExp(data.province)
          customerAddressDetail = customerAddressDetail.replace(provinceReg,'')
        }
        if (customerAddressDetail.indexOf(data.city) > -1) {
          let cityeReg = RegExp(data.city)
          customerAddressDetail = customerAddressDetail.replace(cityeReg,'')
        }
        if (customerAddressDetail.indexOf(data.area) > -1) {
          let areaReg = RegExp(data.area)
          customerAddressDetail = customerAddressDetail.replace(areaReg,'')
        }
        if (customerAddressDetail.indexOf(data.street) > -1) {
          let streetReg = RegExp(data.street)
          customerAddressDetail = customerAddressDetail.replace(streetReg,'')
        }
        customerAddressDetail = customerAddressDetail.trim()
        this.setData({
          customerAddressDetail
        })
      } else {
        this.setData({
          [item]:val
        })
      }
    } else {
      this.setData({
        [item]:val
      })
    }
    
  },
  async keepHandle(){
   try {
    let customerName = this.data.name;
    if(!customerName) throw '请输入收货人姓名';
    let customerMobileNo = this.data.phone;
    if(!/^1[3456789]\d{9}$/.test(customerMobileNo)) throw '手机号格式有误';
    let customerStreet = this.data.street;
    let customerAddressDetail = this.data.customerAddressDetail;
    if(!customerAddressDetail) throw '请输入详细地址';
    let customerProvince = this.data.province;
    if(!customerProvince) throw '请选择配送地区';
    let { lat, lng, customerAddress } = await this.getCenter()
    if (!lng || !lat) throw '街道或详细地址有误'
    let customerGender = this.data.sex;
    let customerLabel = this.data.tag;
    let customerCity = this.data.city;
    let customerDistrict = this.data.area;
    let postcode = this.data.postcode;
    let url = api.add_address;
    let method = 'post';
    let id = '';
    if(this.data.item != '') {
      url = api.edit_address;
      method = 'put';
      id = this.data.item.id;
    }
    request({
      url,
      method,
      data:{
        id,
        customerName,
        customerMobileNo,
        customerAddress,
        customerGender,
        customerLabel,
        customerProvince,
        customerCity,
        customerStreet,
        customerDistrict,
        lng,
        lat,
        postcode,
        customerAddressDetail
      }
    }).then(res => {
      console.log(res)
      if(res.code == "I0000") {
       if (id == '') {
        wx.showToast({
          title: '添加成功',
          icon:'none'
        })
       } else {
         wx.showToast({
           title: '修改成功',
           icon:'none'
         })
       }
        setTimeout(()=>{
          wx.navigateBack({
            delta:1
          })
        },1200)
      } else {
        wx.showToast({
          title: res.msg || "添加失败",
          icon:'none'
        })
      }
    })
   } catch (error) {
     console.log(error)
     if(typeof error == 'string') {
       wx.showToast({
         title: error,
         icon:'none'
       })
     } 
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