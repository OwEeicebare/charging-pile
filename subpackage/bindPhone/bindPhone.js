var app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    token: ''
  },
  onLoad: function(option) {
    
  },
  onShow: function () {
    this.getTokenStorage();
  },
  getPhoneNumber: function(result) {
    if (result.detail.encryptedData) {
      this.requestUserPhone(result.detail.encryptedData, result.detail.iv);
    } else {
      wx.navigateBack();
    }

  },
  getTokenStorage: function() { //获取token
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        that.setData({
          token: res.data
        })
      },
    })
  },
  requestUserPhone: function(encryptedData, iv) { //获取用户手机号
    var that = this;
    app.packRequest({
      url: api.saveUserPhone,
      data: {
        token: this.data.token,
        encryptedData: encryptedData,
        iv: iv
      },
      method: 'POST',
      success: function(res) {
        if (!res.data) {
          wx.switchTab({
            url: '../../pages/home/home',
          })
          return;
        }
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            wx.setStorage({
              key: 'has-phone',//0为无手机号 1为有手机号
              data: 1,
            })
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