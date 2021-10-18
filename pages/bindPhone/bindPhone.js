var app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    to: '',
    token: ''

  },
  onLoad: function(option) {
    // console.log(option);
    this.getTokenStorage();
    this.setData({
      to: option.to
    })
  },
  getPhoneNumber: function(result) {
    // console.log(result);
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
        // console.log('请求用户手机号', res);
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status === '1') {
            wx.navigateBack();
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
  }
});