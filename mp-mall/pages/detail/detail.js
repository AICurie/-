import api from '../../utils/urlApi';
import request from '../../utils/request';
import { getVideoUrl } from '../../utils/request';
import { getImageUrl } from '../../utils/request';
import { event } from '../../utils/request';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    screenWidth: '',
    goodsId: '',
    goodsInfo: '',
    imgs: [],
    share:true,
    skuId:'',
    showSku:true,
    skuTab: '1',
    skuItem: {},
    nowTimeStamp: '',
    endTimeStamp: '',
    isHideCollage: true,
    goodsGroupBuying: {},
    comments: [],
    baseUrl: "",
    videos: [],
    appId: "",
    userInfo: {},
    recom: [],
    skuSource: '',
    activitySiteId: '',
    activitySkuId: '',
    activityId: '',
    seckillSiteId: '',
  },
  goodsOrderby: 'SALES_DESC',
  recomOffset: 1,
  recomLimit: 6,
  inter: null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.goodsId) {
      let baseUrl = app.globalData.api + api.image;
      event("display", options.goodsId);
      let appId = __wxConfig.accountInfo.appId;
      let userInfo = app.globalData.userInfo;
      let { skuSource, activitySiteId, activitySkuId, activityId, seckillSiteId } = options;
      this.setData({
        appId,
        skuSource,
        baseUrl,
        userInfo,
        activitySiteId,
        activitySkuId,
        activityId,
        seckillSiteId,
        goodsId: options.goodsId,
        skuId:options.goodsId
      })
      console.log(this.data.skuId)
      this.getGoodInfo(options.goodsId, skuSource, activitySiteId, activitySkuId, activityId, seckillSiteId);
      
    } else {
      wx.showToast({
        title: '该商品不存在或已下架!',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
      }, 1200)
    }
    if (options.scene && "banner" == options.scene && options.bizId) {
      event("banner", options.bizId);
    }
    this.setData({
      screenWidth: app.globalData.systemInfo.screenWidth
    });
    this.getRecomls();
  },
  // 预览图片
  viewImage(e){
    let { idx } = e.currentTarget.dataset;
    // wx.previewMedia({
    //   sources: this.data.imgs.map(item => ({url: item, type: 'image'})),
    //   current: idx
    // })
    wx.previewImage({
      urls: this.data.imgs,
      current: idx
    })
  },
   // 加入购物车
   addCars(e) {
    let userInfo = app.globalData.userInfo;
    console.log("userInfo", userInfo)
    if (userInfo.mobile) {
      let memberLimit = app.globalData.memberLimit;
      if (memberLimit) {
        if (userInfo.merchantMemberId && userInfo.status == 1) {
          let skuSource = this.data.skuSource;
          if (!skuSource && skuSource != 0) {
            let num = e.currentTarget.dataset.num || 0;
            if (num <= 999) {
              let skuId = e.currentTarget.dataset.id;
              request({ url: api.shoppingCar, data: { skuId, qty: 1 }, method: 'post' })
                .then(res => {
                  if (res.code == "I0000") {
                    if (!app.globalData.getCar) {
                      app.globalData.getCar = true;
                    }
                    // this.setTabBarBadge()
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
            let item = this.data.goodsInfo;
            console.log("item ", item)
            item.qty = 1;
            item.price = (item.activityUnitPrice / 100).toFixed(2);
            item.activitySkuId = item.id;
            let goods = [item];
            let allPrice = item.activityUnitPrice;
            let showPrice = item.activityUnitPrice / 100;
            app.globalData.goods = goods;
            // wx.navigateTo({
            //   url: '/pages/order/create?allPrice=' + allPrice + '&showPrice=' + showPrice
            // })
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
                  // this.setTabBarBadge()
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
        url: '/pages/login/login?url=/pages/order/order',
      })
    }
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
  onShow(){
    let goodsInfo = this.data.goodsInfo;
    if (goodsInfo && goodsInfo.switchStatus != undefined && (goodsInfo.switchStatus == 0 || (this.data.skuSource == 2 && goodsInfo.goodsGroupBuyingExtVoList.length > 0))) {
      if (this.data.endTimeStamp && !this.inter) {
        this.handleInter();
      } else {
        if (goodsInfo.endTime && !this.inter) {
          let date = new Date();
          let y = date.getFullYear();
          let M = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0'+(date.getMonth() + 1);
          let D = date.getDate();
          let dateStr = y+'/'+M+'/'+D+' '+goodsInfo.endTime;
          let endTimeStamp = new Date(dateStr).getTime();
          this.setData({endTimeStamp})
          this.handleInter();
        }
      }
    }
    let userInfo = app.globalData.userInfo;
    this.setData({
      userInfo
    })
  },
  getComment(){
    request({ url: api.commentp, data: {itemId: this.data.goodsInfo.itemId, offset: 1, limit: 1,commentType:0,approveStatus:1} })
    .then(async res => {
      console.log(res)
      if (res.code == "I0000") {
        this.setData({
          comments: res.elements
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },

  changecurrent(e){
    console.log("changecurrent", e)
    let mv = wx.createVideoContext("mv");
    if (e.detail.current != 0) {
      
      console.log("mv", mv)
      mv.pause();
    } else {
      mv.play();
    }
  },
  toMoreHandle(){
    wx.navigateTo({
      url: '/pages/evaluate/list?id='+this.data.goodsInfo.itemId,
    })
  },
  getGoodInfo(goodsId,skuSource=null, activitySiteId=null, activitySkuId=null, activityId=null, seckillSiteId=null) {
    let data = {
      goodsId
    }
    if (skuSource && skuSource == 1) {
      data.skuSource = skuSource;
      data.activitySiteId = activitySiteId;
      data.activitySkuId = activitySkuId;
      data.activityId = activityId;
      data.seckillSiteId = seckillSiteId;
    } else if (skuSource == 2) {
      data.skuSource = skuSource;
    }
    request({ url: api.goods_detail, data, errMsg: '加载失败' })
      .then(async res => {
        console.log(res)
        if (res.code == "I0000") {
          if (res.data) {
            res.data.itemDesc = this.formatRichText(res.data.itemDesc || '');
            let skuItem = {};
            let skus = res.data.skus || [];
            if (skus && skus.length > 0) {
              skuItem = skus[0];
            }
            let nowTimeStamp = '';
            let endTimeStamp = '';
            console.log("res.data.switchStatus ", res.data.switchStatus);
            console.log("res.data.endTime ", res.data.endTime)
            if (res.data.switchStatus != undefined && res.data.switchStatus == 0 || (skuSource == 2 && res.data.goodsGroupBuyingExtVoList.length > 0)) {
              nowTimeStamp = Date.now();
              if (res.data.endTime) {
                let date = new Date();
                let y = date.getFullYear();
                let M = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0'+(date.getMonth() + 1);
                let D = date.getDate();
                let dateStr = y+'/'+M+'/'+D+ ' ' +res.data.endTime;
                endTimeStamp = new Date(dateStr).getTime();
                this.handleInter();
              } else if (skuSource == 2 && res.data.goodsGroupBuyingExtVoList.length > 0) {
                this.handleInter();
              }
            }
            if (res.data.goodsGroupBuyingExtVoList && res.data.goodsGroupBuyingExtVoList.length >= 2) {
              let ls = [res.data.goodsGroupBuyingExtVoList[0],res.data.goodsGroupBuyingExtVoList[1]];
              for (let i = 0, len = ls.length; i < len; i ++) {
                ls[i].groupBuyingEndTimeStamp = new Date(ls[i].groupBuyingEndTime).getTime();
              }
              console.log("ls ", ls)
              res.data.goodsGroupBuyingExtVoList = ls;
            } else if (res.data.goodsGroupBuyingExtVoList && res.data.goodsGroupBuyingExtVoList.length < 2) {
              let ls = res.data.goodsGroupBuyingExtVoList;
              for (let i = 0, len = ls.length; i < len; i ++) {
                ls[i].groupBuyingEndTimeStamp = new Date(ls[i].groupBuyingEndTime).getTime();
              }
              console.log("ls ", ls)
              res.data.goodsGroupBuyingExtVoList = ls;
            }
            this.setData({ goodsInfo: res.data, skuItem, nowTimeStamp, endTimeStamp });
            this.getComment();
            let imgs = res.data.img;
            let videos = res.data.video;
            let imgList = [];
            let videoList = [];
            if(imgs) {
              imgs.map(item => {
                if (item) {
                  imgList.push(getImageUrl(item));
                }
              });
            } else {
              imgList.push('/images/good_default.png');
            }
            if(videos){
              videos.map(item => {
                if (item) {
                  videoList.push(getVideoUrl(item));
                }
              });
            }
            this.setData({ imgs: imgList, videos: videoList})
          } else {
            wx.showToast({
              title: '该商品不存在或已下架!',
              icon: 'none'
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 1,
              })
            }, 1200)
          }

        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
  },
  toPageHandle(e){
    let { url } = e.currentTarget.dataset;
    wx.navigateTo({
      url
    })
  },
  formatRichText(html){
    let newContent= html.replace(/]*>/gi,function(match,capture){
      match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
      match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
      match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
      return match;
    });
    newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
      // match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
      return match;
    });
    // newContent = newContent.replace(/]*\/>/gi, '');
    newContent = newContent.replace(/style=""/g, '');
    // newContent = newContent.replace(/width=/g, '');
    // newContent = newContent.replace(/height=/g, '');
    // newContent = newContent.replace(/width:/g, '');
    // newContent = newContent.replace(/height:/g, '');
    // height:auto;
    newContent = newContent.replace(/<img/g, '<img style="display:block;margin-top:0;margin-bottom:0;"');
    console.log((this.data.screenWidth - 40) / 720);
    let s = (this.data.screenWidth - 40) / 720;
    newContent = newContent.replace(/transform\: scaleY\(1\);/g, 'transform: scaleY('+s+');display:block;')
    return newContent;
  },
  imageError(e){
    let { idx } = e.currentTarget.dataset;
    let str = `imgs[${idx}]`
    this.setData({[str]:''})
  },
  handleInter(){
    let inter = setTimeout(this.handleInter,1000);
    this.setData({
      nowTimeStamp: Date.now()
    })
    this.inter = inter;
  },
  stop(){},
  close(){
    this.setData({
      showSku:true
    })
  },
  addCarHandle(){
    let userInfo = app.globalData.userInfo;
    if (userInfo && userInfo.mobile) {
      let memberLimit = app.globalData.memberLimit;
      if (memberLimit) {
        if (userInfo.merchantMemberId && userInfo.status == 1) {
          let goodsInfo = this.data.skuItem;
          let skuId = goodsInfo.id;
          if (skuId) {
            let number = goodsInfo.number || 0;
            console.log("number ", number)
            console.log("goodsInfo.stock ", goodsInfo.stock)
            // if (goodsInfo.stock > 0 && number < goodsInfo.stock) {
              if (number <= 999) {
                request({ url: api.shoppingCar, method: 'post', data: { skuId, qty: 1 } })
                .then(res => {
                  if (res.code == "I0000") {
                    wx.showToast({
                      title: '已加入购物车',
                      icon: 'none'
                    })
                    let goodsInfo = this.data.goodsInfo;
                    let number = goodsInfo.number || 0;
                    number += 1;
                    if (goodsInfo.isShopping && goodsInfo.isShopping == 1) {
                      this.setData({ ['goodsInfo.number']: number,showSku:true })
                    } else {
                      this.setData({ ['goodsInfo.number']: number, ['goodsInfo.isShopping']: 1,showSku:true })
                    }
                    if (!app.globalData.status) {
                      app.globalData.status = true;
                    }
                    if (!app.globalData.getCar) {
                      app.globalData.getCar = true;
                    }
                  } else {
                    wx.showToast({
                      title: res.msg,
                      icon: 'none'
                    })
                  }
                })
              } else {
                wx.showToast({
                  title: '购物车数量不能超过999',
                  icon:'none'
                })
              }
            // } else {
            //   wx.showToast({
            //     title: '库存不足',
            //     icon:'none'
            //   })
            // }
            
          } else {
          this.showSkuHandle()
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
        let goodsInfo = this.data.skuItem;
        let skuId = goodsInfo.id;
        if (skuId) {
          let number = goodsInfo.number || 0;
          if (goodsInfo.stock > 0 && number < goodsInfo.stock) {
            if (number <= 999) {
              request({ url: api.shoppingCar, method: 'post', data: { skuId, qty: 1 } })
              .then(res => {
                if (res.code == "I0000") {
                  wx.showToast({
                    title: '已加入购物车',
                    icon: 'none'
                  })
                  let goodsInfo = this.data.goodsInfo;
                  let number = goodsInfo.number || 0;
                  number += 1;
                  if (goodsInfo.isShopping && goodsInfo.isShopping == 1) {
                    this.setData({ ['goodsInfo.number']: number,showSku:true })
                  } else {
                    this.setData({ ['goodsInfo.number']: number, ['goodsInfo.isShopping']: 1,showSku:true })
                  }
                  if (!app.globalData.status) {
                    app.globalData.status = true;
                  }
                  if (!app.globalData.getCar) {
                    app.globalData.getCar = true;
                  }
                } else {
                  wx.showToast({
                    title: res.msg,
                    icon: 'none'
                  })
                }
              })
            } else {
              wx.showToast({
                title: '购物车数量不能超过999',
                icon:'none'
              })
            }
          } else {
            wx.showToast({
              title: '库存不足',
              icon:'none'
            })
          }
          
        } else {
        this.showSkuHandle()
        }
      }
      
    } else {
      wx.redirectTo({
        url: '/pages/login/login?url=/pages/detail/detail&goodsId=' + this.data.goodsId,
      })
    }
  },
  changeSku(e){ // 选择sku
    // let item = e.currentTarget.dataset.item;
    // let goodsInfo = this.data.goodsInfo;
    // this.getGoodInfo(item.id)
    // this.setData({
    //   skuId:item.id
    // })
    let { val } = e.currentTarget.dataset;
    if (val.id != this.data.skuItem.id) {
      this.setData({skuItem: val})
    }
  },
  showSkuHandle(){
  
      this.setData({
        showSku:false
      })
  },
  addCar() {
    let userInfo = app.globalData.userInfo;
    if (userInfo && userInfo.mobile) {
      let memberLimit = app.globalData.memberLimit;
      if (memberLimit) {
        if (userInfo.merchantMemberId && userInfo.status == 1) {
          let skuId = this.data.skuId;
          if (skuId) {
            let skuSource = this.data.skuSource;
            if (!skuSource || skuSource == 0) {
              let goodsInfo = this.data.goodsInfo;
              let number = goodsInfo.number || 0;
                if (number <= 999) {
                  request({ url: api.shoppingCar, method: 'post', data: { skuId, qty: 1 } })
                  .then(res => {
                    if (res.code == "I0000") {
                      wx.showToast({
                        title: '已加入购物车',
                        icon: 'none'
                      })
                      let goodsInfo = this.data.goodsInfo;
                      let number = goodsInfo.number || 0;
                      number += 1;
                      if (goodsInfo.isShopping && goodsInfo.isShopping == 1) {
                        this.setData({ ['goodsInfo.number']: number,showSku:true, isHideCollage: true })
                      } else {
                        this.setData({ ['goodsInfo.number']: number, ['goodsInfo.isShopping']: 1,showSku:true, isHideCollage: true })
                      }
                      if (!app.globalData.status) {
                        app.globalData.status = true;
                      }
                      if (!app.globalData.getCar) {
                        app.globalData.getCar = true;
                      }
                    } else {
                      wx.showToast({
                        title: res.msg,
                        icon: 'none'
                      })
                    }
                  })
                } else {
                  wx.showToast({
                    title: '购物车数量不能超过999',
                    icon:'none'
                  })
                }
            } else {
              // let item = this.data.goodsInfo;
              
              // item.qty = 1;
              // item.skuSource = skuSource;
              // item.price = (item.skuActivityPrice / 100).toFixed(2);
              // item.activitySkuId = this.data.activitySkuId;
              // item.imgId = item.img && item.img[0];
              // item.name = item.itemName;
              // item.skuId = this.data.goodsId;
              // item.skuPrice = item.skuActivityPrice;
              // item.activitySiteId = this.data.activitySiteId;
              // item.activityId = this.data.activityId;
              // let goods = [item];
              // let allPrice = item.skuActivityPrice;
              // let showPrice = item.skuActivityPrice / 100;
              // app.globalData.goods = goods;
              // console.log("item ", item)
              //  wx.navigateTo({
              //     url: '/pages/order/create?allPrice=' + allPrice + '&showPrice=' + showPrice
              //   })
              // let goodsInfo = this.data.goodsInfo;
              // if (goodsInfo.isShopping == 1 && goodsInfo.number >= goodsInfo.siteBuyRestrict) {
              //   wx.showToast({
              //     title: '',
              //     icon: 'none'
              //   })
              //   return
              // }
              request({ 
                url: api.shoppingCar, method: 'post', 
                data: { 
                  skuId, 
                  activityId: this.data.activityId,
                  activitySiteId: this.data.activitySiteId,
                  activitySkuId: this.data.activitySkuId,
                  skuSource, 
                  qty: 1 
                } 
              })
                .then(res => {
                  if (res.code == "I0000") {
                    wx.showToast({
                      title: '已加入购物车',
                      icon: 'none'
                    })
                    if (!app.globalData.status) {
                      app.globalData.status = true;
                    }
                    if (!app.globalData.getCar) {
                      app.globalData.getCar = true;
                    }
                    let goodsInfo = this.data.goodsInfo;
                      let number = goodsInfo.number || 0;
                      number += 1;
                      if (goodsInfo.isShopping && goodsInfo.isShopping == 1) {
                        this.setData({ ['goodsInfo.number']: number,showSku:true, isHideCollage: true })
                      } else {
                        this.setData({ ['goodsInfo.number']: number, ['goodsInfo.isShopping']: 1,showSku:true, isHideCollage: true })
                      }
                  } else {
                    wx.showToast({
                      title: res.msg || "操作失败",
                      icon: 'none'
                    })
                  }
                },err => {
                  wx.showToast({
                    title: err.msg || "操作失败",
                    icon: 'none'
                  })
                })
            }
            
            
          } else {
          this.showSkuHandle()
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
        let skuId = this.data.skuId;
        if (skuId) {
          let goodsInfo = this.data.goodsInfo;
          let number = goodsInfo.number || 0;
          if (goodsInfo.stock > 0 && number < goodsInfo.stock) {
            if (number <= 999) {
              request({ url: api.shoppingCar, method: 'post', data: { skuId, qty: 1 } })
              .then(res => {
                if (res.code == "I0000") {
                  wx.showToast({
                    title: '已加入购物车',
                    icon: 'none'
                  })
                  let goodsInfo = this.data.goodsInfo;
                  let number = goodsInfo.number || 0;
                  number += 1;
                  if (goodsInfo.isShopping && goodsInfo.isShopping == 1) {
                    this.setData({ ['goodsInfo.number']: number,showSku:true, isHideCollage: true })
                  } else {
                    this.setData({ ['goodsInfo.number']: number, ['goodsInfo.isShopping']: 1,showSku:true, isHideCollage: true })
                  }
                  if (!app.globalData.status) {
                    app.globalData.status = true;
                  }
                  if (!app.globalData.getCar) {
                    app.globalData.getCar = true;
                  }
                } else {
                  wx.showToast({
                    title: res.msg,
                    icon: 'none'
                  })
                }
              })
            } else {
              wx.showToast({
                title: '购物车数量不能超过999',
                icon:'none'
              })
            }
          } else {
            wx.showToast({
              title: '库存不足',
              icon:'none'
            })
          }
          
        } else {
        this.showSkuHandle()
        }
      }
      
    } else {
      wx.redirectTo({
        url: '/pages/login/login?url=/pages/detail/detail&goodsId=' + this.data.goodsId,
      })
    }
  },
  goCar() {
    wx.switchTab({ url: '/pages/car/car' })
  },
  goIndex(){
    wx.switchTab({ url: '/pages/index/index' })
  },
  showShare(){
    this.setData({
      share:!this.data.share
    })
  },
  showCollage(e){
    let { item } = e.currentTarget.dataset;
    this.setData({
      goodsGroupBuying: item,
      isHideCollage: false
    })
  },
  hideCollage(){
    this.setData({
      isHideCollage: true
    })
  },
  onHide(){
    if (this.inter) {
      clearTimeout(this.inter);
      this.inter = null;
    }
  },
  onUnload(){
    if (this.inter) {
      clearTimeout(this.inter);
      this.inter = null;
    }
  },
  onShareAppMessage: function () {
    if (!this.data.share){
      this.setData({share:true})
    }
    
    let { goodsId, skuSource, activitySiteId, activitySkuId, activityId,seckillSiteId } = this.data;
      return {
        title: (app.globalData.name || "维本生鲜"),
        path:`/pages/detail/detail?goodsId=${goodsId}&skuSource=${skuSource}&activitySiteId=${activitySiteId}&activitySkuId=${activitySkuId}&activityId=${activityId}&seckillSiteId=${seckillSiteId}`
      }
  },
  onShareTimeline: function() {
    let { goodsId, skuSource, activitySiteId, activitySkuId, activityId,seckillSiteId } = this.data;
    return {
      title: app.globalData.name || "维本生鲜",
      path:`/pages/detail/detail?goodsId=${goodsId}&skuSource=${skuSource}&activitySiteId=${activitySiteId}&activitySkuId=${activitySkuId}&activityId=${activityId}&seckillSiteId=${seckillSiteId}`
    }
  }
})