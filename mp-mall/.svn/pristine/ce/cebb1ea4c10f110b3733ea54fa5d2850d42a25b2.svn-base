
App({
  onLaunch: async function () {
    this.globalData.systemInfo = wx.getSystemInfoSync();
    console.log( this.globalData.systemInfo)
    this.globalData.accountInfo = wx.getAccountInfoSync();
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo
    }
  },

  onShow: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    // 检查新版本更新
    var updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(res => {
      // 请求完新版本信息的回调
      console.log("[微信  ][up.Man.Chk][调用成功]: ", res);
    });

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success(res) {
          console.log("[微信  ][up.Man.Rdy][调用成功]: ", res);
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });
    });

    updateManager.onUpdateFailed(res => {
      // 新版本下载失败
      console.log("[微信  ][up.Man.Fai][调用成功]: ", res);
    });
  },

  globalData: {
    name: '维本生鲜',
    type: 'special', // 'special', 'plateform'， 'single'
     /*
    // wx50b049105610b4ef
    company: '为宏智能',
    marchantCode: 'whit',
    // https://mp.trial.langmeta.com
    // https://mp.dev.langmeta.com
    // http://192.168.21.23:54201
    // https://dk.langmeta.com/api/order/getOrderList
    // api: __wxConfig.envVersion == "release" ? "https://mp.trial.langmeta.com" : (__wxConfig.envVersion == "trial" ? "https://mp.trial.langmeta.com" : "https://mp.dev.langmeta.com"),
    api: __wxConfig.envVersion == "release" ? "https://mp.dev.langmeta.com" : (__wxConfig.envVersion == "trial" ? "https://mp.dev.langmeta.com" : "https://mp.dev.langmeta.com"),
    descrption: '为宏智能科技有限公司官方公众号。为宏智能，赋能千行百业、共筑智慧互联。',
    linkUrl: 'https://mp.weixin.qq.com/s/-20BRmo9RjVT2TXMwbImNw',
     */
    // /*
    // wxb94aaf6ff0eca5fc
    company: '维本生鲜',
    marchantCode: 'SYL001',
    api: __wxConfig.envVersion == "release" ? "https://weiben.langmeta.com" : (__wxConfig.envVersion == "trial" ? "https://weiben.langmeta.com" : "https://weiben.langmeta.com"),
    descrption: '维本生鲜',
    linkUrl: 'https://mp.weixin.qq.com/s/-20BRmo9RjVT2TXMwbImNw',
    // */
    goods: [],
    mobile: '',
    address: '',
    status: true,
    userInfo: {},
    order: '',
    memberLimit: true,
    getCar: true,
    order_status: true,
    systemInfo: {},
    accountInfo: {},
    location: {},
  }
})