var app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    loading: false,
    color: '#000',
    background: '#fff',
    show: true,
    animated: false,
    token: ''
  },
  onLoad: function(option) {
    this.getTokenStorage();
  },
  getUserInfo: function(result) { //获取用户信息
    // console.log(result);
    if (result.detail.userInfo) {
      app.globalData.userInfo = result.detail.userInfo;
      this.requestUserInfo(result.detail.encryptedData, result.detail.iv);
    } else {
      wx.switchTab({
        url: '../home/home',
      })
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
        // console.log('请求用户信息', res);
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status === '1') {
            wx.switchTab({
              url: '../home/home',
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
    wx.switchTab({
      url: '../home/home',
    })
  }
});