const api = require('../../utils/api.js');
var app = getApp();
// pages/wallet/wallet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasPhone: 0,
    packMoney: 0
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
    this.getHasPhoneStorage();
    this.getTokenStorage();
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
          hasPhone: Number(res.data)
        })
      },
    })
  },
  /**
   * 获取用户账户信息
   */
  getAccount: function (token) {
    var that = this;
    app.packRequest({
      url: api.accountInfo,
      data: {
        token: token
      },
      method: 'POST',
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            that.setData({
              packMoney: res.data.data
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: '请求错误',
            icon: 'none'
          })
        }
      }
    })
  },
  getTokenStorage: function () { //获取token
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.getAccount(res.data);
      }
    })
  },
})