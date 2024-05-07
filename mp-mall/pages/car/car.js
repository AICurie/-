import request from '../../utils/request';
import api from '../../utils/urlApi';
import { getImageUrl } from '../../utils/request'
let app = getApp();
Page({
  contact:'',
  data: {
    search_nicht: 'search_nicht.png',
    allChecked: false,
    isEdit: false,
    list: [
    ],
    delList: [],
    allPrice: 0,
    showPrice: 0,
    phone: "",
    userInfo: {},
    recom: []
  },
  offset:1,
  limit: 10,
  state: true,
  recomOffset: 1,
  recomLimit: 6,
  goodsOrderby: 'SALES_DESC',
  // 单选
  changeChecked(e) {
    let idx = e.currentTarget.dataset.idx;
    let checked = !this.data.list[idx].checked;
    this.setData({
      [`list[${idx}].checked`]: checked
    })
    this.isAllchecked()
    if (this.data.isEdit) {
      this.changeDelList()
    }
  },
  // 全选
  changeAll() {
    let allChecked = !this.data.allChecked;
    let list = this.data.list;
    if (this.data.isEdit) {
      list = list.map(item => {
          item.checked = item.checked == allChecked ? item.checked : allChecked;
        return item;
      })
      this.setData({
        list,
        allChecked: !this.data.allChecked
      })
      this.changeDelList()
    } else {
      let allPrice = 0;
      let showPrice = 0;
      list = list.map(item => {
        if(item.availableFlag == 1 && item.enable) {
          item.checked = item.checked == allChecked ? item.checked : allChecked;
          if (allChecked) {
            allPrice += Number(parseFloat((item.skuPrice * (item.discount == 0 ? 1 : item.discount)) * item.qty).toFixed(2));
            showPrice += Number(((item.price * (item.discount == 0 ? 1 : item.discount)) * item.qty).toFixed(2));
          }
        }
        return item;
      })
      this.setData({
        list,
        allPrice,
        showPrice: showPrice.toFixed(2),
        allChecked: !this.data.allChecked
      })
    }
  },
  // 判断是否全选
  isAllchecked() {
    let list = this.data.list;
    let allChecked = true;
    if (this.data.isEdit) {
      for (let i = 0, len = list.length; i < len; i++) {
        if (list[i] && !list[i].checked ) {
          allChecked = false;
        } 
      }
      this.setData({
        allChecked
      })
    } else {
      let allPrice = 0;
      let showPrice = 0;
      let num = 0;
      for (let i = 0, len = list.length; i < len; i++) {
        if (list[i]) {
          if ( !list[i].checked && list[i].availableFlag != 2 && list[i].enable) {
            allChecked = false;
          } else {
           if (list[i].availableFlag != 2 && list[i].enable) {
            num += 1;
            allPrice += Number(parseFloat((list[i].skuPrice * (list[i].discount == 0 ? 1 : list[i].discount)) * list[i].qty).toFixed(2));
            showPrice += Number((list[i].price * (list[i].discount == 0 ? 1 : list[i].discount) * list[i].qty).toFixed(2));
           }
          }
        }
      }
      if (num == 0) {
        allChecked = false;
      }
      this.setData({
        allChecked,
        allPrice,
        showPrice: showPrice.toFixed(2)
      })
    }

  },
  // 修改数量
  changeNum(e) {
    let idx = e.currentTarget.dataset.idx;
    let name = e.currentTarget.dataset.name;
    let qty = this.data.list[idx].qty;
    if (name == "add") {
      this.changeNumAjax(idx, qty += 1)
      // this.setData({
      //   ['list['+idx+'].qty']: qty += 1
      // })
      this.isAllchecked();
    } else {
      if (qty > 1) {
        this.changeNumAjax(idx, qty -= 1)
        // this.setData({
        //   ['list['+idx+'].qty']: qty -= 1
        // })
        this.isAllchecked();
      } else {
        wx.showModal({
          content:`即将删除该商品，是否继续?`,
          confirmText:"删除",
          confirmColor:"#FF0000",
          success: res => {
            if(res.confirm) {
              request({
                url: api.shoppingCar,
                data: {
                  ids: [this.data.list[idx].id]
                },
                method: 'delete',
              })
                .then(res => {
                  wx.hideLoading()
                  if (res.code == "I0000") {
                    this.offset = 1;
                    this.state = true;
                    this.setData({list: []})
                    this.getCatInfo()
                    wx.showToast({
                      title: '删除成功',
                      icon: 'none'
                    })
                    
                  } else {
                    wx.showToast({
                      title: res.msg || '删除失败',
                      icon: 'none'
                    })
                  }
                })
            }
          }
        })
        // wx.showToast({
        //   title: '商品数量不可小于1',
        //   icon: 'none'
        // })
      }
    }

  },
  // 发起修改数量请求
  changeNumAjax(idx, qty) {
    // wx.showLoading({title:"处理中..."})
    let item = this.data.list[idx];
    if (qty <= item.availableStock) {
      if (qty <= 999) {
        request({
          url: api.shoppingCar,
          data: {
            qty,
            activityId: item.activityId,
            activitySiteId: item.activitySiteId,
            skuSource: item.skuSource,
            skuId: this.data.list[idx].skuId
          },
          method: 'put'
        })
          .then(res => {
            // wx.hideLoading()
            if (res.code == "I0000") {
              let str = `list[${idx}].qty`;
              this.setData({ [str]: qty });
              this.isAllchecked();
            } else {
              let str = `list[${idx}].qty`;
              this.setData({ [str]: item.qty })
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          })
      } else {
        wx.showToast({
          title: '最多不能超过999',
          icon:'none'
        })
        let str = `list[${idx}].qty`;
        this.setData({ [str]: 999 });
      }
    } else {
      let str = `list[${idx}].qty`;
      this.setData({ [str]: item.qty })
      wx.showToast({
        title: "库存不足",
        icon: 'none'
      })
    }
  },
  // 发起批量删除请求
  delete(ids) {
    wx.showLoading({ title: "加载中" })
    request({
      url: api.shoppingCar,
      data: {
        ids
      },
      method: 'delete',
    })
      .then(res => {
        wx.hideLoading()
        if (res.code == "I0000") {
          this.offset = 1;
          this.state = true;
          this.setData({list: []})
          this.getCatInfo()
          wx.showToast({
            title: '删除成功',
            icon: 'none'
          })
          // let list = this.data.list;
          // let newList = [];
          // newList = newList.concat(...list.filter(item => !item.checked))
          this.setData({
            // list: newList,
            delList: []
          })
          this.setTabBarBadge()
        } else {
          wx.showToast({
            title: res.msg || '删除失败',
            icon: 'none'
          })
        }
      })
  },
  // 编辑
  changeEdit() {
      let list = this.data.list;
      list = list.map(item => { item.checked = false; return item });
      console.log("list", list)
      this.setData({
        list,
        allChecked: false,
        isEdit: !this.data.isEdit,
        delList: []
      })
  },
  // 输入数量
  inputNum(e) {
    let idx = e.currentTarget.dataset.idx;
    if (e.detail.value > 0) {
      this.setData({
        ['list['+idx+'].qty']: Number(e.detail.value)
      })
      // this.isAllchecked();
      this.changeNumAjax(idx, Number(e.detail.value))
    } else {
      wx.showToast({
        title: '商品数量不能小于1',
        icon: 'none'
      })
    }
  },
  // 已选删除商品
  changeDelList() {
    let list = this.data.list
    list = list.filter(item => item.checked == true);
    this.setData({
      delList: list
    })
  },
  // 删除商品
  delGoods() {
    if (this.data.delList.length > 0) {
      wx.showModal({
        content: `将要删除选中的${this.data.delList.length}款商品`,
        confirmText: "删除",
        confirmColor: "#FF5F58",
        success: res => {
          if (res.confirm) {
            let list = this.data.list.filter(item => item.checked);
            console.log("list ", list)
            let arr = [].concat(...list.map(item => item ? item.id : null)).filter(data => data != null)
            console.log("arr ", arr)
            this.delete(arr)
            this.setData({delList: []})
          }
        }
      })
    } else {
      wx.showToast({
        title: '请选择要删除的商品',
        icon: 'none'
      })
    }
  },
  // 去结算
  toOrider() {
    let list = this.data.list;
    let goods = [];
    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i].checked) {
        goods.push(list[i])
      }
    }
    if (goods.length > 0) {
      let userInfo = app.globalData.userInfo;
      let memberLimit = app.globalData.memberLimit;
      
          
      if(memberLimit) {
        if (userInfo.merchantMemberId && userInfo.status == 1) {
          app.globalData.goods = goods;
          wx.navigateTo({
            url: '/pages/order/create?allPrice=' + this.data.allPrice + '&showPrice=' + this.data.showPrice
          })
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
      } else {
        app.globalData.goods = goods;
        wx.navigateTo({
          url: '/pages/order/create?allPrice=' + this.data.allPrice + '&showPrice=' + this.data.showPrice
        })
      }
    } else {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
    }
  },
   // 加入购物车
   addCar(e) {
    let userInfo = app.globalData.userInfo;
    console.log("userInfo", userInfo)
    if (userInfo.mobile) {
      let memberLimit = app.globalData.memberLimit;
      if (memberLimit) {
        if (userInfo.merchantMemberId && userInfo.status == 1) {
          let num = e.currentTarget.dataset.num || 0;
          if (num <= 999) {
            let skuId = e.currentTarget.dataset.id;
            request({ url: api.shoppingCar, data: { skuId, qty: 1 }, method: 'post' })
              .then(res => {
                if (res.code == "I0000") {
                  this.offset = 1;
                  this.state = true;
                  this.setData({list:[]})
                  this.getCatInfo()
                  this.setTabBarBadge()
                  wx.showToast({
                    title: '已加入购物车',
                    icon: 'none'
                  })

                } else {
                  wx.showToast({
                    title: res.msg || '添加失败',
                    icon: 'none'
                  })
                }
              })
          } else {
            wx.showToast({
              title: '购物车数量不能超过999',
              icon: 'none'
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
      } else {
        let num = e.currentTarget.dataset.num || 0;
          if (num <= 999) {
            let skuId = e.currentTarget.dataset.id;
            request({ url: api.shoppingCar, data: { skuId, qty: 1 }, method: 'post' })
              .then(res => {
                if (res.code == "I0000") {
                  this.offset = 1;
                  this.state = true;
                  this.setData({list:[]})
                  this.getCatInfo()
                  this.setTabBarBadge()
                  wx.showToast({
                    title: '已加入购物车',
                    icon: 'none'
                  })
                } else {
                  wx.showToast({
                    title: res.msg || '添加失败',
                    icon: 'none'
                  })
                }
              })
          } else {
            wx.showToast({
              title: '购物车数量不能超过999',
              icon: 'none'
            })
          }
      }
      
    } else {
      wx.redirectTo({
        url: '/pages/login/login?url=/pages/car/car',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let baseUrl = app.globalData.api + api.image;
    let appId = __wxConfig.accountInfo.appId;
    
    this.setData({
      baseUrl,
      appId,
      search_nicht: app.globalData.type == 'special' ? 'car_void-' + app.globalData. marchantCode + '.png' : 'car_void.png',
    });
    // this.getRecomls();
  },
  // 获取推荐列表
  getRecomls(){
    request({ url: api.goods_list, data: { goodsOrderby:this.goodsOrderby, offset: this.recomOffset, limit: this.recomLimit } })
        .then(res => {
          if (res.code == "I0000") {
            this.setData({
              recom: res.elements
            })
          } else {
            this.setData({
              recom: []
            })
          }
        })
  },
  getCatInfo() { //获取购物车
    if(this.state) {
      this.state = false;
      wx.showLoading()
      request({
        url: api.shoppingCarPage,
        method: 'get',
        data:{
          offset: this.offset,
          limit: this.limit
        }
      })
        .then( res => {
          console.log(res)
          wx.hideLoading()
          if (res.code == "I0000") {
            if(app.globalData.getCar){
              app.globalData.getCar = false;
            }
            let oldList = this.data.list;
            let list = res.elements.filter(item => item);
              for (let i = 0, len = list.length; i < len; i++) {
                if (list[i]) {
                  list[i].skuPrice = Number(list[i].skuPrice.toFixed(2))
                  list[i].price = (list[i].skuPrice / 100).toFixed(2)
                  if (list[i].availableFlag == 1 && list[i].enable) {
                    list[i].checked = true;
                  }
                  if (list[i].imgId) {
                    list[i].image = getImageUrl(list[i].imgId, app.globalData.systemInfo.screenWidth / 2);
                  }
                }
              }
              if (list.length >= this.limit) {
                this.offset += 1;
                this.state = true;
              }
              console.log("list", list)
              this.setData({ list: oldList.concat(list) });
              this.isAllchecked();
              if (this.data.isEdit) {
                this.changeDelList();
              }
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        })
    }
  },
   // 加入购物车
  //  addCar(e) {
  //   let userInfo = app.globalData.userInfo;
  //   if (userInfo.mobile) {
  //     let num = e.currentTarget.dataset.num || 0;
  //     if (num <= 999) {
  //       let skuId = e.currentTarget.dataset.id;
  //       request({ url: api.shoppingCar, data: { skuId, qty: 1 }, method: 'post' })
  //         .then(res => {
  //           if (res.code == "I0000") {
  //             this.offset = 1;
  //             this.state = true;
  //             this.setData({list: []})
  //             wx.showToast({
  //               title: '已加入购物车',
  //               icon: 'none'
  //             })
  //           } else {
  //             wx.showToast({
  //               title: res.msg || '添加失败',
  //               icon: 'none'
  //             })
  //           }
  //         })
  //     } else {
  //       wx.showToast({
  //         title: '购物车数量不能超过999',
  //         icon: 'none'
  //       })
  //     }
  //   } else {
  //     wx.redirectTo({
  //       url: '/pages/login/login?url=/pages/car/car'
  //     })
  //     // wx.showModal({
  //     //   content:`您还不是会员，请提交认证信息，认证通过后继续操作`,
  //     //   confirmText:"去认证",
  //     //   confirmColor:"#60b533",
  //     //   success: res => {
  //     //     if(res.confirm) {
  //     //       wx.navigateTo({
  //     //         url: '/pages/login/auth',
  //     //       })
  //     //     }
  //     //   }
  //     // })
  //   }
  // },
  goMenu() {
    wx.switchTab({ url: '/pages/menu/menu' })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userInfo = app.globalData.userInfo;
    let mobile = userInfo.mobile;
    wx.setNavigationBarTitle({
      title: app.globalData.name
    })
 
    if (mobile) {
      this.getShopInfo()
      this.setData({ userInfo })
      if (app.globalData.getCar) {
        this.offset = 1;
        this.state = true;
        this.setData({list:[]})
        this.getCatInfo()
      }
      if (app.globalData.status) {
        this.setTabBarBadge();
      }
    } else {
      wx.redirectTo({
        url: '/pages/login/login?url=/pages/car/car',
      })
    }
    this.getMsgCount();
  },
  getMsgCount(){
    request({
      url: api.getUnreadMsgCount,
      method: 'get'
    }).then(res => {
      console.log("res ", res)
      if (res.code == "I0000") {
        if (res.data > 0) {
          wx.showTabBarRedDot({
            index: 3,
          })
        } else {
          wx.hideTabBarRedDot({
            index: 3,
          })
        }
      }
    })
  },
  setTabBarBadge() {
    request({
      url: api.shoppingCarPage,
      method: 'get'
    })
      .then(res => {
        if (res.code == "I0000") {
          let num = res.totalElements || 0;
          // let index = app.globalData.type == "single"?1:2
          if(num > 0) {
            let text = num > 99 ? '...' : num;
            wx.setTabBarBadge({
              index: 2,
              text
            })
          } else {
            wx.removeTabBarBadge({ index: 2 })
          }
        }
      })
  },
  onHide() {
    if (this.data.isEdit) {
      this.setData({ isEdit: false })
    }
  },
  getShopInfo(){ // 获取店铺信息
    request({
      url: api.getMerchant
    }).then(res => {
      console.log(res)
      if (res.code == "I0000") {
        app.globalData.name = res.data.name;
        app.globalData.memberLimit = res.data.memberLimit
        app.globalData.address = res.data.address;
        wx.setNavigationBarTitle({
          title: res.data.name
        })
      }
    })
  },
  getUserInfo(){ // 重新获取用户信息
    request({
      url:api.userInfo
    }).then(res => {
      if(res.code= "I0000") {
        app.globalData.userInfo = res.data;
        let point = res.data.point;
        this.setData({point,userInfo:res.data})
        wx.setStorageSync('userInfo', res.data);
        if (!res.data.mobile) {
          wx.showToast({
            title: '该账号已在其他设备登录，请重新登录',
            icon:'none'
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/login/login?url=/pages/car/car',
            })
          }, 1200);
        } 
      } 
    })
  },
  imageError(e){
    let { idx } = e.currentTarget.dataset;
    let str = `list[${idx}].image`
    this.setData({[str]:''})
  },
  allRequest(){
    let arr = [this.getShopInfo(),this.getUserInfo(),this.getCatInfo()];
    return Promise.all(arr)
  },
  getMore(){
    if (this.data.list.length >= this.limit) {
      this.getCatInfo()
    }
  },
  async onPullDownRefresh(){
    this.offset = 1;
    this.state = true;
    this.setData({list: []})
    await this.allRequest();
    wx.stopPullDownRefresh();
    wx.showToast({
      title: '刷新成功',
      icon:'none'
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