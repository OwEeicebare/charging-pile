const api = require('../../utils/api.js');
var app = getApp();
// pages/capital/capital.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    noCoupon: {
      imageSrc: '../../images/home/img_empty.svg',
      tips: '暂无资金流水记录，快去充电看看'
    },
    token: '',
    limit: 10,//限制数据条数
    currentPage: 1,//页码
    isBottom: false, //是否到底 不能再加载数据
    listCount: 0, //列表总数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTokenStorage();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      currentPage: 1,
      isBottom: false,
      list: []
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      currentPage: 1,
      isBottom: false,
      list: []
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isBottom) {
      wx.showToast({
        title: '已经到底啦',
        icon: 'none'
      })
    } else {
      if (this.data.listCount > (this.data.currentPage * this.data.limit)) {
        this.setData({
          currentPage: this.data.currentPage + 1
        })
      }
      wx.showLoading({
        title: '加载中',
      })
      this.getJourneyRecord();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取token
   */
  getTokenStorage: function () { //获取token
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          token: res.data
        })
        that.getJourneyRecord();
      },
    })
  },
  /**
   * 资金流水
   */
  getJourneyRecord: function () {
    var that = this;
    app.packRequest({
      url: api.journeyRecord,
      data: {
        token: this.data.token,
        page: this.data.currentPage,
        limit: this.data.limit
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            var currentCount = that.data.currentPage * that.data.limit;
            var list = that.data.list;
            list = res.data.data ? list.concat(res.data.data) : list.concat([]);
            that.setData({
              list: list,
              listCount: res.data.count,
              isBottom: currentCount < res.data.count ? false : true
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