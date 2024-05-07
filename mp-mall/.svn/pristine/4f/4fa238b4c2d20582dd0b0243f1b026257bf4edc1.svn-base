import api from '../../utils/urlApi';
import request from '../../utils/request';
import { getImageUrl } from '../../utils/request';
let app = getApp();
Page({
  offset: 1,
  limit: 6,
  status: true,
  catagoryIdList: {}, // 记录点过的一级分类，下次点击不再发起获取二级分类请求
  data: {
    status: true,
    search_nicht: 'search_nicht.png',
    parentid: '',
    menu_key: '',
    hidden: false,
    sort_up: false,
    notices: [],
    // 一级列表
    scroll: [
    ],
    scroll_act: "水果",
    // 二三级列表
    list: [],
    list_act: "劲爆推荐",
    goods: [],
    statusBarHeight: 0,
    catagoryId: "",
    baseUrl: '',
    appId: '',
    goodsOrderby: 'TYPE_SORT_ASC',
    ids: ''
  },
  goodsType: '',
  async onLoad(options) {
    // if (options.parentId) {
    //   this.setData({ parentid: options.parentId })
    // }
    let ids = null;

    if (options.ids) {
      ids = options.ids.split(',');
      this.setData({ parentid: ids[0], ids })
    }
    // let userInfo = app.globalData.userInfo;
    wx.setNavigationBarTitle({
      title: app.globalData.name
    })
    let appId = __wxConfig.accountInfo.appId;
    this.setData({
      // userInfo,
      appId,
      baseUrl: app.globalData.api + api.image,
      search_nicht: app.globalData.type == 'special' ? 'search_nicht-' + app.globalData.marchantCode + '.png' : 'search_nicht.png',
    });
    console.log("ids ", ids)
    this.getMenuList(ids)
    this.getSystemInfo()
  },
  onShow(){
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
  tabsHandle(e){
    let { item } = e.currentTarget.dataset;
    console.log('item',item)
    if (item.catagoryId != this.data.scroll_act) {
      // this.setData({

      // })
      this.setData({ scroll_act: item.catagoryId, catagoryId: item.catagoryId, parentid: item.parentId })
      this.getmenuInfo(item.catagoryId);
    }
  },
  changeAct(e){
    let { status } = e.currentTarget.dataset;
    let { idx } = e.currentTarget.dataset;
    let list = this.data.list;
    if (status == 1) {
      let str = 'list['+idx+'].isOpen';
      if (list[idx].name == this.data.list_act) {
        this.setData({
          [str]: !list[idx].isOpen
        })
      } else {
        for (let i = 0, len = list.length; i < len; i++) {
          list[i].isOpen = false;
        }
        list[idx].name == this.data.list_act;
        this.setData({
          // list,
          list_act: list[idx].catagoryName,
          [str]: !list[idx].isOpen
        })
        this.getsecond(list[idx].catagoryId)
      }
    } else {
      let { key } = e.currentTarget.dataset;
      if (this.data.list[idx].list[key] != this.data.list_act) {
        this.setData({
          list_act: this.data.list[idx].list[key]
        })
      }
    }
  },
  topled(){
    let { item } = e.currentTarget.dataset;
    if (item.name != this.data.scroll_act) {
      this.setData({
        scroll_act: item.name,
        list: item.list,
        scroll_act:item.scroll_act
      })
    }
  },
  // 获取一级分类
  getMenuList(ids) {
    wx.showLoading({ title: "加载中..." })
    request({ url: api.catagory, errMsg: '加载失败' })
      .then(async res => {
        if (res.code == "I0000") {
          let data = res.data;
          data.map(item => {
            if (item.imgId) {
              item.image = getImageUrl(item.imgId);
            }
          });
          
          this.setData({ scroll: data, scroll_act: (ids && ids[0]) || res.data[0].catagoryId, catagorycode: res.data[0].catagoryCode })
          let parentId = this.data.parentid;
          if (!parentId) {
            if (res.data && res.data[0] && res.data[0].catagoryId) {
              console.log("res.data[0].catagoryId",res.data[0].catagoryId)
              this.getmenuInfo(res.data[0].catagoryId);
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          } else {
            this.getmenuInfo(parentId, ids)
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
  },
  getuse() {
    wx.showLoading({ title: "加载中..." })
    request({ url: api.catagory, errMsg: '加载失败' })
      .then(async res => {
        if (res.code == "I0000") {
          let list = res.data;
          list.map(item => {
            if (item.imgId) {
              item.image = getuse(item.imgId);
            }
          });
          this.setData({ list: res.data })
          let parentId = this.data.parentid;
          if (!parentId) {
            if (res.data && res.data[0] && res.data[0].catagoryId) {
              console.log("res.data[0].catagoryId",res.data[0].catagoryId)
              this.getsecond(res.data[0].catagoryId);
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          } else {
            this.getsecond(parentId)
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
  },
  // 根据一级分类id查找对应一级分类的下标
  getIdx(parentId) {
    let list = this.data.scroll;
    for (let i = 0, len = list.length; i < len; i++) {
      if (list[i].catagoryId == parentId) {
        return i
      }
    }
    return -1
  },
  gedIdx(parentId) {
    let list = this.data.list;
    for (let i = 0, len = list.length; i < len; i++) {
      console.log("list[i].catagoryId ", list[i].catagoryId)
      console.log("parentId ", parentId)
      if (list[i].catagoryId == parentId) {
        return i
      }
    }
    return -1
  },
  imageError(e){
    let { idx } = e.currentTarget.dataset;
    let str = `goods[${idx}].image`
    this.setData({[str]:''})
  },
  // 获取二级分类
  getmenuInfo(parentId, ids) {
    
        console.log('parentId',parentId)
        request({ url: api.catagory, data: { parentId }, errMsg: '加载失败' })
          .then(res => {
            if (res.code == "I0000") {
              if (res.data.length > 0) {
                // let str = `scroll[${idx}].list`
                let str = `list`
                
                this.setData({ [str]: res.data, catagoryId: (ids && ids[1]) || res.data[0].catagoryId, parentid: (ids && ids[1]) || res.data[0].parentId, catagorycode:res.data[0].catagoryCode })
                this.getsecond((ids && ids[1])||res.data[0].catagoryId ,ids)
              } else {
                wx.hideLoading();
                // catagoryId: this.data.scroll[idx].catagoryId, parentid: parentId 
                this.setData({ list: [], goods: [] })
                // this.getsecond(this.data.parentid)
              }
              console.log("this.data.list ", this.data.list)
              // this.catagoryIdList[parentId] = true;
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          })
  },
  
  //三级
  getsecond(parentId, ids) {
    console.log('parentId',parentId)
    let idx = this.gedIdx(parentId);
    console.log("idx", idx)
    this.offset = 1;
    this.status = true;
    if (idx > -1) {
      request({ url: api.catagory, data: { parentId }, errMsg: '加载失败' })
        .then(res => {
          if (res.code == "I0000") {
            if (res.data.length > 0) {
              let str = `list[${idx}].list`
              this.setData({ [str]: res.data, catagoryId: (ids && ids[2]) || res.data[0].catagoryId, catagorycode: res.data[0].catagoryCode})
              this.getGoodsList((ids && ids[3]) || res.data[0].catagoryId, res.data[0].catagoryCode)
            } else {
              wx.hideLoading();
              this.setData({ [`list[${idx}].list`]: [], goods: [] })
              // this.setData({ catagorycode: this.data.scroll[idx].catagoryCode, parentid: parentId })
              this.getGoodsList(this.data.parentid, this.data.catagorycode)
            }
            console.log("list", this.data.list)
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        })
    } else {
      wx.showToast({
        title: '操作异常，请稍后重试',
        icon: 'none'
      })
      console.log(idx)
    }
  },
  detail(e) { // 商品详情
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?goodsId=' + id,
    })
  },
  // 加入购物车
  // addCar(e) {
  //   let userInfo = app.globalData.userInfo;
  //   if (userInfo.mobile) {
  //     let num = e.currentTarget.dataset.num || 0;
  //     if (num <= 999) {
  //       let skuId = e.currentTarget.dataset.id;
  //       request({ url: api.shoppingCar, data: { skuId, qty: 1 }, method: 'post' })
  //         .then(res => {
  //           if (res.code == "I0000") {
  //             if (!app.globalData.getCar) {
  //               app.globalData.getCar = true;
  //             }
  //             // this.setTabBarBadge()
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
  //       url: '/pages/login/login?url=/pages/menu/menu'
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
                  if (!app.globalData.getCar) {
                    app.globalData.getCar = true;
                  }
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
                  if (!app.globalData.getCar) {
                    app.globalData.getCar = true;
                  }
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
        url: '/pages/login/login?url=/pages/menu/menu',
      })
    }
  },
  // 获取商品列表
  getGoodsList(goodsType, catagoryCode, more) {
    if (this.status) {
      this.status = false;
      let goodsOrderby = this.data.goodsOrderby;
      if (goodsOrderby == 'price') {
        goodsOrderby = this.data.sort_up ? 'PRICE_ASC' : 'PRICE_DESC';
      }
      console.log("goodsOrderby ", goodsOrderby)
      this.goodsType = goodsType;
      request({ url: api.goods_list, data: { typeId: goodsType, catagoryCode, goodsOrderby, offset: this.offset, limit: this.limit }, errMsg: '加载失败' })
        .then(res => {
          wx.hideLoading()
          if (res.code == "I0000") {
            if (Array.isArray(res.elements) && res.elements.length > 0) {
              let oldList = this.data.goods;
              let goods = res.elements;
              if (goods.length >= this.limit) {
                this.status = true;
              } else {
                // if (this.offset > 1) {
                //   wx.showToast({
                //     title: '已加载全部',
                //     icon: 'none'
                //   })
                // }
              }
              goods.map(item => {
                if (item.goodsImgId) {
                  item.image = getImageUrl(item.goodsImgId, app.globalData.systemInfo.screenWidth / 2);
                }
              });
              let list = oldList.concat(goods);
              if (more) {
                this.setData({ goods: list })
              } else {
                this.setData({ goods })
              }
            } else {
              if (this.offset > 1) {
                // wx.showToast({
                //   title: '已加载全部',
                //   icon: 'none'
                // })
                this.setData({ goods: this.data.goods })
              } else {
                this.setData({ goods: [] })
              }
            }
            // this.setData({ catagorycode: catagoryCode })
          } else {
            if (this.offset > 1) {
              this.setData({ goods: this.data.goods })
            } else {
              this.setData({ goods: [] })
            }
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        })
    }

  },
  // 展开分类
  changeIdx(e) {
    let dataset = e.currentTarget.dataset;
    let { item } = dataset;
    if (dataset.status == '1') {
      
      let parentid = dataset.parentid;
      console.log("parentid ", parentid)
      console.log("this.data.parentid ", this.data.parentid)
      if (this.data.parentid == parentid) {
        this.setData({
          hidden: !this.data.hidden
        })
      } else {
        if (!this.status) {
          this.offset = 1;
          this.status = true;
        }
        this.setData({parentid})
        wx.showLoading({ title: '加载中...' })
        if (item.attatchmentFlag == 1) {
          this.getGoodsList(parentid)
        } else {
          this.getsecond(parentid)
        }
        
        if (this.data.hidden) {
          this.setData({
            hidden: false
          })
        }
      }
    } else {
      let catagoryCode = dataset.catagorycode;
      let type = dataset.type;
      if (this.data.catagoryId != type) {
        if (!this.status) {
          this.offset = 1;
          this.status = true;
        }
        this.setData({
          catagoryId: type
        })
        wx.showLoading({ title: '加载中...' })
        this.getGoodsList(type, catagoryCode)
      }
    }
  },
  // changeIdx(e) {
  //   let dataset = e.currentTarget.dataset;
  //   if (dataset.status == '1') {
  //     let parentid = dataset.type;
  //     if (this.data.parentid == parentid) {
  //       this.setData({
  //         hidden: !this.data.hidden
  //       })
  //     } else {
  //       if (!this.status) {
  //         this.offset = 1;
  //         this.status = true;
  //       }
  //       wx.showLoading({ title: '加载中...' })
  //       this.getmenuInfo(parentid)
  //       if (this.data.hidden) {
  //         this.setData({
  //           hidden: false
  //         })
  //       }
  //     }
  //   } else {
  //     let catagoryCode = dataset.catagorycode;
  //     let type = dataset.type;
  //     if (this.data.type != catagoryId) {
  //       if (!this.status) {
  //         this.offset = 1;
  //         this.status = true;
  //       }
  //       wx.showLoading({ title: '加载中...' })
  //       this.getGoodsList(type, catagoryCode)
  //     }
  //   }
  // },
  // 切换排序方式
  changeSort(e) {
    let goodsOrderby = e.currentTarget.dataset.item;
    if (goodsOrderby == "price") {
      this.setData({
        sort_up: !this.data.sort_up
      })
    }
    this.setData({
      goodsOrderby,
    })
    this.status = true;
    this.offset = 1;
    this.getGoodsList(this.goodsType, this.data.catagorycode)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userInfo = app.globalData.userInfo;
    this.setData({
      userInfo
    })
    if (app.globalData.status && userInfo.mobile) {
      this.setTabBarBadge()
    }
    if (!userInfo) {
      wx.removeTabBarBadge({
        index: 3,
      })
    }
  },
    // 获取设备信息
    getSystemInfo() {

      this.setData({
        isIos: app.globalData.systemInfo.system.startsWith('iOS'),
        statusBarHeight: app.globalData.systemInfo.statusBarHeight
      });
    },
  // 滚动加载
  getMore() {
    if (this.status) {
      this.offset += 1;
      this.getGoodsList(this.goodsType, this.data.catagorycode, true)
    }
  },
  async onPullDownRefresh(){
    let ids = this.data.ids;
    if (ids) {
      ids = ids.toString();
    }
    this.setData({
      parentid: "",
    })
    console.log("this.data.ids",ids)
    await this.onLoad({ids});
    await this.setTabBarBadge();
    wx.stopPullDownRefresh();
    wx.showToast({
      title: '刷新成功',
      icon:'none'
    })
  },
  async setTabBarBadge() {
    request({
      url: api.shoppingCarPage,
      method: 'get'
    })
      .then(res => {
        console.log(res)
        if (res.code == "I0000") {
          let num = res.totalElements || 0;
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