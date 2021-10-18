// const preApi = "http://192.168.1.79:8009/";
// const preApi = "http://47.106.113.101:2046/";
const preApi = "http://api.szgdxny.com/";

module.exports = {
  login: preApi + 'WxLogin/GetWxValidate',//获取token
  saveUserInfo: preApi + 'WxLogin/GetUserBasicsInfo', //获取用户基础信息
  saveUserPhone: preApi + 'WxLogin/GetUserPhoneInfo', //获取用户手机
  hasPhone: preApi + 'WxLogin/IsExistPhone', //用户是否已授权手机号
  qustions: preApi + 'OperationManage/GetOperatManageInfo', //获取常见问题信息
  stationInfo: preApi + 'WxHomePage/GetStationInfo', //获取站点信息
  elePile: preApi + 'WxHomePage/GetElePileInfo', //通过id获取电桩基本信息
  elePileAllInfo: preApi + 'WxHomePage/GetElePileAllInfo', //根据电桩充电类型获取所站桩信息
  schemeDetial: preApi + 'WxHomePage/GetSchemeDetialAllInfo', //获取时段信息
  eleCost: preApi + 'WxHomePage/GetEleCostInfo', //获取电费信息
  charge: preApi + 'WxHomePage/GetEleStateInfo', //充电
  chargeInfo: preApi + 'WxHomePage/GetRechargeInfo', //充电信息
  banner: preApi + 'WxHomePage/GetElePileImage', //获取轮播图
  gerPreOrderId: preApi + 'WxPersonalCenter/UnifiedOrderApp', //统一下单
  rechargeCoupons: preApi + 'WxPersonalCenter/GetCouponsMoney', //获取充值优惠券信息
  withdraw: preApi + 'WxPersonalCenter/Transfers', //提现
  accountInfo: preApi + 'WxPersonalCenter/GetUserMoney', //用户账户余额
  homeCoupon: preApi + 'WxLogin/GetCouponsInfo', //首页获取优惠券
  coupons: preApi + 'WxPersonalCenter/GetValidCouponsInfo', //有效优惠券列表
  invalidCoupons: preApi + 'WxPersonalCenter/GetLoseCouponsInfo', //失效优惠券列表
  ingOrders: preApi + 'WxOrderForm/GetOrderListInfo/GetOrderListInfo', //进行中订单
  finishedOrders: preApi + 'WxOrderForm/GetFinishOrderListInfo/GetFinishOrderListInfo', //已完成订单
  finishedDetail: preApi + 'WxOrderForm/GetOrderedDetislsInfo/GetOrderedDetislsInfo', //已完成订单详情
  ingDetail: preApi + 'WxOrderForm/GetOrderDetsilsInfo/GetOrderDetsilsInfo', //进行中订单详情
  overRecharge: preApi +'WxOrderForm/EndCharge', //结束充电
  recharge: preApi + 'WxHomePage/SendEleInfo', //立即充电
  freezeMoney: preApi + 'WxPersonalCenter/GetPersonInfo', //冻结资金
  rechargeMoney: preApi + 'WxOrderForm/GetRechargeMoneyInfo', //充值金额
  chargeMoney: preApi + 'WxOrderForm/GetRecEleMoneyInfo', //充电金额
  journeyRecord: preApi + 'WxPersonalCenter/GetMoneyDetailInfo', //资金明细
  manualWithdraw: preApi + 'WxPersonalCenter/ArtificialTransfers', //人工提现
  homeOrders: preApi + 'WxHomePage/GetResidueTime', //首页进行中订单
}


