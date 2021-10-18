const api = require('../../utils/api.js');
var app = getApp();
// pages/coupon/coupon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    noCoupon: {
      imageSrc: '../../images/home/img_empty.svg',
      tips: '无可用优惠券，快去领取吧'
    }
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
   * 获取token
   */
  getTokenStorage: function() { //获取token
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        that.getCoupons(res.data);
      },
    })
  },
  /**
   * 获取有效优惠券
   */
  getCoupons: function(token) {
    var that = this;
    app.packRequest({
      url: api.coupons,
      data: {
        token: token
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            that.setData({
              list: res.data.data instanceof Array ? res.data.data : []
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