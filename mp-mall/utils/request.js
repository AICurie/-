const app = getApp();
// const api = "https://hjmp.welhow.com";
//const api = __wxConfig.envVersion == "release" ? "https://mp.trial.welhow.com" : (__wxConfig.envVersion == "trial" ? "https://mp.trial.welhow.com" : "https://mp.dev.welhow.com");

const api = app.globalData.api;
const RETRY = 10;
const MAX_WAIT_REFRESH = 5;
const RETRY_TIME = 200;
let refreshing = false;

// 保存tocken有效时间
export const holdExpireTime = time => {
  try {
    time = parseInt(time);
    if (isNaN(time)) throw 'holdExpireTime:请传入过期时间的秒数';
    let expireTime = (parseInt(Date.now() / 1000) + time) * 1000
    wx.setStorageSync('expireTime', expireTime)
  } catch (error) {
    if (typeof error == 'string') console.error(error)
    console.error(error)
  }
}
import apiList from './urlApi';
// 发起请求
export const request = async function (obj, retry = 0) {
  if (!obj.url) {
    console.error('请检查url参数')
    return Promise.reject('请检查url参数')
  }
  return new Promise(async (resolve, reject) => {
    let token = wx.getStorageSync('token') || '';

    if (token == "") {
      return setToken(retry,
        obj,
        resolve,
        reject);
    }

    // console.log('requestObj:::', obj)
    // let headerObj = {
    //     "content-type":"application/x-www-form-urlencoded"
    // }
    let headerObj = {
      "content-type": "application/json"
    }
    let header = obj.header || headerObj;
    header["Authorization"] = token;
    wx.request({
      url: api + obj.url,
      data: obj.data || '',
      method: obj.method || 'get',
      header,
      responseType: obj.responseType || 'text',
      success: async res => {
        if (res.statusCode == 200) {
          return await resolve(res.data)
        } else if (res.statusCode == 500) {
          wx.showToast({
            title: '服务器异常，请稍后重试',
            icon: 'none'
          });
          return await reject(res);
        } else if (res.statusCode == 401) {
          if (retry < RETRY) {
            setToken(retry + 1, obj, resolve, reject);

            //wx.setStorageSync('token', '');
            //await setToken();
            //return await resolve(request(obj, retry + 1))
          } else {
            wx.showToast({
              title: '服务器异常',
              icon: 'none'
            })
            return await reject('服务器异常')
          }
        } else if (res.statusCode == 404) {
          return await reject(res);
        } else {
          wx.showToast({
            title: obj.errMsg || '操作异常',
            icon: 'none'
          });
          return await reject(res);
        }
      },
      fail: async err => {
        wx.showToast({
          title: '网络异常,请检查网络',
          icon: 'none'
        })
        return await reject(err)
      }
    });
  });
}
let users = true;
// 获取token并存到本地
export const setToken = (retry = 0, opts, resolve, reject) => {
  console.log("setToken   ")
  if (refreshing && retry < MAX_WAIT_REFRESH) {
    setTimeout(() => {
      if (opts) {
        return request(opts, retry + 1).then(
          res => {
            if (resolve) resolve(res);
          },
          err => {
            if (reject) reject(err);
          }
        );
      } else {
        if (resolve) resolve({ token: wx.getStorageSync('token') || '' });
      }
    }, RETRY_TIME);
  } else {
    refreshing = true;
    console.log("refreshing")
    wx.login({
      success: res => {
        wx.request({
          url: api + apiList.auth,
          method: 'post',
          header: {
            "content-type": "application/json"
          },
          data: {
            wechatCode: res.code,
            appId: __wxConfig.accountInfo.appId
          },
          success: res => {
            refreshing = false;
            console.log(" res  ", res)
            if (res.data.code == "I0000") {

              wx.setStorageSync('token', res.data.data.token);
              app.globalData.getCar = true;
                request({
                  url:apiList.userInfo
                }).then(res => {
                  if(res.code= "I0000") {
                    app.globalData.userInfo = res.data;
                    wx.setStorageSync('userInfo', res.data)
                    app.globalData.memberLimit = res.data.memberLimit;
                   
                  }
                })
              
              // app.globalData.userInfo = res.data.data;
              // app.globalData.memberLimit = res.data.memberLimit
              // wx.setStorageSync('userInfo', res.data.data)
              if (res.data.data.expiresIn) {
                holdExpireTime(res.data.data.expiresIn);
              }
              if (opts) {
                request(opts, retry + 1).then(
                  res => {
                    if (resolve) resolve(res);
                  },
                  err => {
                    if (reject) reject(err);
                  }
                );
              } else {
                if (resolve) resolve(res.data.data);
              }
            } else {
              console.log(res)
              console.info('refresh response error', JSON.stringify(res.data));
              if (reject) reject(res.data);
            }
          },
          fail: err => {
            refreshing = false;
            console.info('refresh wx.request error', JSON.stringify(err));
            if (reject) reject(err);
          }
        });
      },
      fail: err => {
        refreshing = false;
        console.info('refresh wx.login error', JSON.stringify(err));
        if (reject) reject(err);
      }
    });
  }
}

export const getVideoUrl = (videoId) => {
  let videoUrl = api + apiList.videos + videoId;
  videoUrl = videoUrl + "?appId=" + __wxConfig.accountInfo.appId + "&";
  videoUrl = videoUrl.substring(0, videoUrl.length - 1);
  return videoUrl;
}

export const getImageUrl = (imageId, width, height) => {
  let imageUrl = api + apiList.image + imageId;
  imageUrl = imageUrl + "?appId=" + __wxConfig.accountInfo.appId + "&";
  if (width || height) {
    if (width) {
      imageUrl = imageUrl + "width=" + Math.ceil(width) + "&";
    }

    if (height) {
      imageUrl = imageUrl + "height=" + Math.ceil(height) + "&";
    }
  }
  imageUrl = imageUrl.substring(0, imageUrl.length - 1);
  return imageUrl;
}
export const event = (type, bizId) => {
  let pages = getCurrentPages();
  let currentPage = pages[pages.length - 1];

  request({
    url: apiList.events,
    method: 'post',
    data: {
      en: type,
      cm: {
        la: app.globalData.location.latitude,
        ln: app.globalData.location.longitude
      },
      et: {
        bizId: bizId,
        f4: JSON.stringify(app.globalData.systemInfo),
        f5: JSON.stringify({
          route: currentPage.route,
          options: currentPage.options
        }),
      }
    }
  });
}
export default request

