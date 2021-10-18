var app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    token: ''
  },
  onLoad: function(option) {

  },
  onShow: function() {

  },
  getUserInfo: function(result) { //获取用户信息
    wx.showLoading({
      title: '授权中...',
    })
    if (result.detail.userInfo) {
      app.globalData.userInfo = result.detail.userInfo;
      this.getTokenStorage(result.detail.encryptedData, result.detail.iv);
    } else {
      wx.switchTab({
        url: '../../pages/home/home',
      })
    }
  },
  getTokenStorage: function (encryptedData, iv) { //获取token
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        that.setData({
          token: res.data
        })
        that.requestUserInfo(encryptedData, iv);
      },
    })
  },
  requestUserInfo: function(encryptedData, iv) { //获取用户信息
    app.packRequest({
      url: api.saveUserInfo,
      data: {
        token: this.data.token,
        encryptedData: encryptedData,
        iv: iv
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            wx.switchTab({
              url: '../../pages/home/home',
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
  cancel: function() { //取消授权
    // wx.navigateBack();
    wx.switchTab({
      url: '../../pages/home/home',
    })
  }
});