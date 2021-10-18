const api = require('../../utils/api.js');
var app = getApp();
// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    token: '',
    packMoney: 0, //账户余额
    couponLength: 0,
    fixMoney: 0, //冻结资金
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
      if (!this.data.hasUserInfo) {
        wx.navigateTo({
          url: '../../subpackage/login/login'
        })
      }
    } else if (!this.data.canIUse) {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../../subpackage/login/login'
      })
    }
    // this.getTokenStorage();

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
   * 进入钱包
   */
  toWallet: function() {
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../../subpackage/wallet/wallet',
      })
    } else {
      wx.navigateTo({
        url: '../../subpackage/login/login'
      })
    }
  },
  /**
   * 进入优惠券
   */
  toCoupon: function() {
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../../subpackage/coupon/coupon',
      })
    } else {
      wx.navigateTo({
        url: '../../subpackage/login/login'
      })
    }
  },
  /**
   * call
   */
  makeCall: function() {
    wx.makePhoneCall({
      phoneNumber: '0755-89958398',
    })
  },
  getTokenStorage: function() { //获取token
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        that.setData({
          token: res.data
        })
        that.getCoupons();
        that.getFreeze();
      },
    })
  },
  /**
   * 获取有效优惠券
   */
  getCoupons: function() {
    var that = this;
    app.packRequest({
      url: api.coupons,
      data: {
        token: this.data.token
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            that.setData({
              couponLength: res.data.data instanceof Array ? res.data.data.length : 0
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
  /**
   * 获取冻结资金
   */
  getFreeze: function () {
    var that = this;
    app.packRequest({
      url: api.freezeMoney,
      data: {
        token: this.data.token
      },
      method: 'POST',
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            that.setData({
              packMoney: res.data.data.userMenoey,
              fixMoney: res.data.data.freezeMoney
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
  }
})