// pages/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activedMoney: '',
    noCoupon: {
      imageSrc: '../../images/home/img_recharge.svg',
      tips: '充值成功'
    },
    rechargeState: 0, //0 失败 1 成功
    animationData: {},
    ableState: 0, //按钮是否可点击0 灰 1 绿
    value: '',
    coupon: {
      couponList: [{
        id: 1
      },
      {
        id: 2
      },
      {
        id: 3
      }
      ]
    }, //优惠券列表
    popShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 修改充值金额
   */
  changeMoney: function(event) {
    // console.log(event);
    var money = event.target.dataset.money ? Number(event.target.dataset.money) : event.currentTarget.dataset.money ? Number(event.currentTarget.dataset.money) : '';
    if (!money) {
      return;
    }
    this.setData({
      activedMoney: money,
      value: money,
      ableState: 1
    })
  },
  /**
   * 充值
   */
  recharge: function() {
    // console.log(this.data.value);
    if (!this.data.value) {
      wx.showToast({
        title: '请输入充值金额',
        icon: 'none'
      })
      return;
    }
    if (!((/^\d+$/).test(this.data.value))) {
      wx.showToast({
        title: '充值金额只能为整数',
        icon: 'none'
      })
      return;
    }
    // if (this.data.value < 10) { //输入金额小于最低充值金额
    //   wx.showToast({
    //     title: '输入金额小于最低充值金额',
    //     icon: 'none'
    //   })
    //   return;
    // }
    //发起微信支付
    var that = this;
    var timestamp = Date.parse(new Date()) / 1000 + '';
    // wx.requestPayment({
    //   timeStamp: timestamp,
    //   nonceStr: '5K8264ILTKCH16CQ2502SI8ZNMTM67VS',
    //   package: 'prepay_id=***',
    //   signType: 'MD5',
    //   paySign: 'MD5(appId=wxd678efh567hg6787&nonceStr=5K8264ILTKCH16CQ2502SI8ZNMTM67VS&package=prepay_id=wx2017033010242291fcfe0db70013231072&signType=MD5&timeStamp=1490840662&key=qazwsxedcrfvtgbyhnujmikolp111111) = 22D9B4E54AB1950F51E0649E8810ACD6',
    //   success: function() {
    //     var animation = wx.createAnimation({
    //       duration: 300
    //     })
    //     animation.height(0).step();
    //     that.setData({
    //       rechargeState: 1,
    //       animationData: animation.export()
    //     })
    //   },
    //   fail: function(error) {
    //     // console.log('fail', error);
    //     wx.showToast({
    //       title: error.errMsg,
    //       icon: 'none'
    //     })
    //   }
    // })
    var animation = wx.createAnimation({
      duration: 300
    })
    animation.height(0).step();
    that.setData({
      rechargeState: 1,
      popShow: true,
      animationData: animation.export()
    })
    // that.setData({
    //   rechargeState: 1,
    //   animationData: animation.export()
    // })
  },
  /**
   * 输入金额
   */
  inputMoney: function(event) {
    // console.log(event);
    if (!((/^\d+$/).test(event.detail.value))) {
      wx.showToast({
        title: '充值金额只能为整数',
        icon: 'none'
      })
    }
    if (event.detail.value) {
      this.setData({
        ableState: 1
      })
    } else {
      this.setData({
        ableState: 0
      })
    }
    this.setData({
      activedMoney: '',
      value: event.detail.value
    })
  },
  /**
   * 关闭弹窗
   */
  closePopUp: function (event) {
    // console.log('close',event);
    if (event.target.dataset.operate || event.currentTarget.dataset.operate) {
      this.setData({
        popShow: false
      })
    }
  },
})