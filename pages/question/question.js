// pages/question/question.js
var app = getApp();
const api = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageSrc: '../../images/home/icon_down_arrow.svg',
    imageUp: '../../images/home/icon_up_arrow.svg',
    list: [],
    lastId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getNormalQuestion();
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
   * 展开问题答案
   */
  openAnswer: function(event) {
    // console.log(event);
    var questionId = event.currentTarget.dataset.id ? Number(event.currentTarget.dataset.id) : event.target.dataset.id ? Number(event.target.dataset.id) : 0;
    if (!questionId) {
      return;
    }
    if (questionId !== this.data.lastId) {
      this.setData({
        lastId: questionId
      })
    } else {
      this.setData({
        lastId: 0
      })
    }
  },
  /**
   * 获取常见问题信息
   */
  getNormalQuestion: function() {
    var that = this;
    app.packRequest({
      url: api.qustions,
      method: 'POST',
      success: function(res) {
        // console.log(res);
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status === '1') {
            that.setData({
              list: res.data.data
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