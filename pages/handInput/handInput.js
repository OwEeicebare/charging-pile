const api = require('../../utils/api.js');
var app = getApp();
// pages/handInput/handInput.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ableState: 0, //0 灰 1 绿
    value: ''
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
   * 连接设备 进行充电
   */
  ensure: function () {
    if (!((/^\d+$/).test(this.data.value))) {
      wx.showToast({
        title: '编号错误，请重新输入',
        icon: 'none'
      })
      return;
    }
    app.requestCharge(this.data.value);
  },
  /**
   * 监听输入
   */
  inputNumber: function(event) {
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
  },
  /**
   * 清空输入框
   */
  clearNumber: function () {
    console.log('清空');
    this.setData({
      value: '',
      ableState: 0
    })
  }
})