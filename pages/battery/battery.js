var app = getApp();
const api = require('../../utils/api.js');
// pages/battery/battery.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rules: {},
    listShow: false,
    stationInfo: {},
    eleNumber: '',
    chargeInfo: {},
    pays: [
      {
        money: '10'
      },
      {
        money: '50'
      },
      {
        money: '100'
      },
      {
        money: '200'
      },
      {
        money: '500'
      },
      {
        money: '1000'
      }
    ],
    activeMoney: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getStationInfoStorage();
    this.getTokenStorage();
    // console.log(options);
    this.setData({
      eleNumber: options.eleNumber
    })
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
   * 关闭列表及说明
   */
  closeList: function(event) {
    if (event.target.dataset.operate || event.currentTarget.dataset.operate) {
      this.setData({
        listShow: false
      })
    }
  },
  /**
   * 打开计费规则
   */
  openRules: function(event) {
    this.setData({
      listShow: true
    })
  },
  /**
   * 立即充电
   */
  immediatelyEle: function() {
    wx.switchTab({
      url: '../orders/orders'
    })
  },
  /**
   * 进入充值界面
   */
  toRecharge: function() {
    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },
  /**
   * 获取计费规则
   */
  getFeeRules: function(id) {
    var that = this;
    app.packRequest({
      url: api.schemeDetial,
      data: id,
      method: 'POST',
      success: function(res) {
        // console.log(res);
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status === '1') {
            that.setData({
              rules: {
                list: res.data.data
              }
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
   * 获取stationInfo
   */
  getStationInfoStorage: function() {
    var that = this;
    wx.getStorage({
      key: 'stationInfo',
      success: function(res) {
        that.setData({
          stationInfo: res.data
        })
        that.getFeeRules(res.data.id);
      },
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
        that.getChargeInfo();
      },
    })
  },
  /**
   * 获取充电信息
   */
  getChargeInfo: function() {
    var that = this;
    app.packRequest({
      url: api.chargeInfo,
      data: {
        token: this.data.token,
        eleNumber: this.data.eleNumber
      },
      method: 'POST',
      success: function(res) {
        // console.log(res);
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status === '1') {
            that.setData({
              chargeInfo: res.data.data
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
   * 选择充电金额
   */
  changeMoney: function (event) {
    var index = event.target.dataset.index ? Number(event.target.dataset.index) : event.currentTarget.dataset.index ? Number(event.currentTarget.dataset.index) : '';
    if (!index) {
      return;
    }
    this.setData({
      activeMoney: index
    })
  }
})