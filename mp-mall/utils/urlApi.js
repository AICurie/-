export default {
  order:"/api/order", // get 查看订单内容， post下单
  orders:"/api/order/", // {orderId}/change post 补款下单
  droplist:"/api/droplist", // get 获取下拉(分类)列表
  goods:'/api/goods',  // get 获取商品信息
  goods_top:'/api/goods/top', // 热销商品（首页）
  goods_list:'/api/goods/list', // 商品列表
  goods_detail:'/api/goods/detail', // 商品详情
  goods_sku:'/api/goods/item/detail/', // 商品sku
  auth:'/api/auth/mp', //判断用户是否登录
  shoppingCar:'/api/shoppingCar',  // get获取购物车信息，post加入购物车
  shoppingCarPage:'/api/shoppingCar/page',  // get获取购物车信息
  login_mp:'/api/login/mp', // 微信获取手机号登录
  login_mobile:'/api/login/mobile', // 手机验证码登录
  logout:'/api/logout',  //退出登录
  sendCode:'/api/sendCode', //发送验证码
  banner:'/api/goods/banner', // 首页banner
  catagory:'/api/goods/catagory', //商品分类
  catagory_home:'/api/goods/catagory/home', //首页分类
  files:'/api/files', //post上传文件， get加载文件
  videos:'/api/videos/', //查看视频
  image:'/api/images/', //查看图片
  map:'/api/map/info', // 获取当前地区名
  getPoster:'/api/merchant/getPoster', // 获取店铺轮播
  getMerchant:'/api/merchant/getMerchant', // 获取店铺信息
  add_address:'/api/user/addUserAddress', // 添加地址
  del_address:'/api/user/deleteUserAddress/', // 删除地址
  edit_address:'/api/user/editAddress', // 修改地址
  get_address:'/api/user/getOneAddress', // 获取地址详情
  address:'/api/user/getUserAddressList', // 获取地址列表
  integral:'/api/user/getPointDetail', // 获取积分详情
  defaultAddress:'/api/user/setDefaultAddress/',  //设置默认地址
  getAgreement:'/api/merchant/getAgreement', // 获取服务协议
  getPolicy:'/api/merchant/getPolicy', // 获取隐私政策
  getMobile:'/api/merchant/getMobile', // 获取电话
  orderInfo:'/api/order/getOrderInfo', // 查看订单内容
  orderList:'/api/order/getOrderList', // 获取订单列表
  payment:'/api/payment/', // 发起支付 post {changeOrderNo}/change 补差价
  mobile:'/api/user/modify/mobile', // 修改手机号
  userInfo:'/api/user/userInfo', // 获取用户信息
  cancel:'/api/order/cancel', // 取消订单
  checkOrderFreightRefund: '/api/order/checkOrderFreightRefund', // get ?orderId=409754096862629888 取消订单前调用
  order_goods:'/api/order/getOrderDetailPage', // 订单商品清单
  events:'/api/events', // 操作事件
  getExPoint:'/api/order/getExchangePoint', //获取积分折扣
  finish:'/api/order/finish/', // 订单确认收货
  merchantLogistics:'/api/merchantLogistics', // 获取配送模板
  route:'/api/merchantLogistics/route/', // 实时物流
  getLocation: '/api/map/getLocation', // 获取经纬度
  delivery: '/api/order/delivery/', //  {orderId} get 获取订单闪送配送状态 {orderNo}/trace  get 获取闪送物流信息
  livesl: '/api/livetelecastactivity/list', // get 获取直播间
  livesp: '/api/livetelecastactivity/page', // get 分页获取直播间 *
  liveset: '/api/livetelecastactivity/setStatus/', // get {id}/{status} 设置当前直播间状态
  livesd: '/api/livetelecastactivity/', // get {id} 根据id获取直播间
  buriedPoint: '/api/buriedPoint?t=liveTelecast', // 修改直播间状态
  notice: '/api/merchantNotice/page', // 分页获取公告
  couponUser: '/api/couponUser/myCoupons', // 待领券列表
  gain: '/api/couponUser/gain', // 领券
  merchantCouponGain: '/api/merchantCouponGain/page', // 分页获取用户领取代金券信息
  
  mycoupons: '/api/user/mycoupons', // 获取优惠券
  getCurrentDateSite: '/api/marketing/goodsSeckillSite/getCurrentDateSite', // 获取当天秒杀活动场次
  getSeckillSiteSKU: '/api/marketing/goodsSeckillSite/getSeckillSiteSKU', // 获取秒杀商品列表
  getGroupBuyingSKUList: '/api/marketing/goodsGroupBuyingActivity/getGroupBuyingSKUList', // 获取当前团购活动商品列表
  getGroupBuySkuDetail: '/api/marketing/goodsGroupBuyingActivity/getGroupBuySkuDetail/', // {id} 获取当前团购活动商品详情
  submitCertification: '/api/merchantMember/submitCertification', // post 提交认证
  getCertification: '/api/merchantMember/getCertification', // get 获取认证信息
  goodsGroupBuying: '/api/marketing/goodsGroupBuyingActivity/findOrderGroupBuyingByActivitySkuId/', // get 402441857981878272 获取进行中的拼团
  files: '/api/files', // post 上传
  layoutConfig: '/api/goods/layoutConfig/list', // get 获取首页布局
  getHomeGroup: '/api/marketing/goodsGroupBuyingActivity/getGroupBuyingSKUListByActivityId', // get ?activityId=402414742150451200 根据团购活动ID 获取活动商品
  // getHomeSeckill: '/api/marketing/goodsSeckillSite/getSeckillSiteSKU', // get ?activityId=403508677035823104 根据秒杀活动ID 获取秒杀商品?type=1&activityId=411597661582528512&limit=3
  getHomeSeckill: '/api/marketing/goodsSeckillSite/getSeckillActivitySku', // get ?activityId=403508677035823104 根据秒杀活动ID 获取秒杀商品?type=1&activityId=411597661582528512&limit=3
  commentp: "/api/goods/comment/page", // 获取商品用户评论
  comment: "/api/goods/comment", // post 评价
  applyType: "/api/order/afterSale/applyType/list", // 售后处理类型
  afterSale: '/api/order/afterSale/apply', // 售后申请
  applyReason: '/api/order/afterSale/applyReason/list', // 售后处理原因
  afterSalep: '/api/order/afterSale/page/ext', // 分页获取售后订单列表
  afterSaled: '/api/order/afterSale/', //{id}/cancel put 取消售后申请   {id} 修改售后申请
  getOrderInfo: '/api/order/getOrderInfo/', // get {orderId}/{orderDetailId} // 查看订单内容(售后详情)
  randomNotice: '/api/merchantNotice/random', // 订单购买信息
  msgInfo: '/api/msgInfo/page', //消息列表
  readMsg: '/api/msgInfo/readMsg/', // get {id}  消息详情
  getUnreadMsgCount: '/api/msgInfo/getUnreadMsgCount', // 未读消息数量
  submitFeedback: '/api/merchant/merchantFeedback/submit', // 提交反馈
  homePageExt: '/api/merchant/homePageExt', // 获取首页背景色
}