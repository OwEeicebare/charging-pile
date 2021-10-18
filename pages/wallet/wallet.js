var app = getApp();
// pages/wallet/wallet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasPhone: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getHasPhoneStorage();
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
   * 进入充值界面
   */
  toRecharge: function() {
    if (this.data.hasPhone) {
      wx.navigateTo({
        url: '../recharge/recharge',
      })
    } else {
      wx.navigateTo({
        url: '../bindPhone/bindPhone'
      })
    }
  },
  /**
   * 进入提现界面
   */
  toWithdraw: function() {
    if (this.data.hasPhone) {
      wx.navigateTo({
        url: '../withdraw/withdraw',
      })
    } else {
      wx.navigateTo({
        url: '../bindPhone/bindPhone'
      })
    }
  },
  /**
   * 获取是否授权手机号
   */
  getHasPhoneStorage: function() {
    var that = this;
    wx.getStorage({
      key: 'has-phone',
      success: function(res) {
        that.setData({
          hasPhone: res.data
        })
      },
    })
  },
})