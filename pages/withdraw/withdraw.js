// pages/withdraw/withdraw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noCoupon: {
      imageSrc: '../../images/home/img_cash.svg',
      tips: '提现成功'
    },
    withdrawState: 0, //0 失败 1 成功
    animationData: {},
    money: 1234,
    value: '',
    ableState: 0, //按钮是否可点击0 灰 1 绿
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
   * 提现
   */
  withdraw: function() {
    if (!this.data.value) {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none'
      })
      return;
    }
    // if (this.data.value < 10) { //输入金额小于最低提现金额
    //   wx.showToast({
    //     title: '输入金额小于最低提现金额',
    //     icon: 'none'
    //   })
    //   return;
    // }
    var animation = wx.createAnimation({
      duration: 300
    })
    animation.height(0).step();
    this.setData({
      withdrawState: 1,
      animationData: animation.export()
    })
  },
  /**
   * 全部提现
   */
  withdrawAll: function() {
    var money = this.data.money
    this.setData({
      value: money + '.00'
    })
    if (money) {
      this.setData({
        ableState: 1
      })
    }
  },
  /**
   * 输入金额 
   */
  watchInput: function(event) {
    if (!((/^\d+\.\d{0,1}$/).test(event.detail.value)) && !((/^\d+$/).test(event.detail.value))) {
      // console.log(event.detail.value.indexOf('.'));
      var index = event.detail.value.indexOf('.') + 3;
      var inputValue = event.detail.value.substring(0, index); //裁剪成两位
      inputValue = inputValue.replace(/\.{1,}/g, ".");
      this.setData({
        value: inputValue 
      })
      return;
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
      value: event.detail.value
    })
  }
})