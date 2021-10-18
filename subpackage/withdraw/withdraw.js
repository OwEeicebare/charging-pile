const api = require('../../utils/api.js');
var app = getApp();
// pages/withdraw/withdraw.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noCoupon: {
      imageSrc: '../../images/home/img_cash.svg',
      tips: '申请提交成功'
    },
    withdrawState: 0, //0 失败 1 成功
    animationData: {},
    value: '',
    ableState: 0, //按钮是否可点击0 灰 1 绿
    token: '',
    packMoney: 0,//账户余额
    zAccount: '', //zfb
    submitAble: true
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
   * 提现
   */
  withdraw: function() {
    if (!this.data.value || Number(this.data.value) === 0) {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none'
      })
      return;
    }
    if (!this.data.zAccount) {
      wx.showToast({
        title: '请输入支付宝账号',
        icon: 'none'
      })
      return;
    }
    if (this.data.value > this.data.packMoney) { //输入金额小于最低提现金额
      wx.showToast({
        title: '您的余额不足',
        icon: 'none'
      })
      return;
    }
    // this.wxWithdraw();//微信提现
    this.manualWithdraw();//人工提现
  },
  /**
   * 全部提现
   */
  withdrawAll: function() {
    var packMoney = this.data.packMoney
    this.setData({
      value: Number(packMoney).toFixed(2)
    })
    if (packMoney && this.data.zAccount) {
      this.setData({
        ableState: 1
      })
    }
  },
  /**
   * 输入金额 
   */
  watchInput: function(event) {
    if (!((/^\d+\.\d{0,1}$/).test(event.detail.value)) && !((/^\d+$/).test(event.detail.value))) {
      var index = event.detail.value.indexOf('.') + 3;
      var inputValue = event.detail.value.substring(0, index); //裁剪成两位
      inputValue = inputValue.replace(/\.{1,}/g, ".");
      this.setData({
        value: inputValue
      })
      return;
    }
    if (event.detail.value && this.data.zAccount) {
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
   * 获取用户账户信息
   */
  getAccount: function() {
    var that = this;
    app.packRequest({
      url: api.accountInfo,
      data: {
        token: this.data.token
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            that.setData({
              packMoney: res.data.data
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
  getTokenStorage: function() { //获取token
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        that.setData({
          token: res.data
        })
        that.getAccount();
      },
    })
  },
  /**
   * zfb账号
   */
  inputZfb: function(event) {
    this.setData({
      zAccount: event.detail.value
    })
    if (event.detail.value && this.data.value) {
      this.setData({
        ableState: 1
      })
    } else {
      this.setData({
        ableState: 0
      })
    }
  },
  /**
   * 微信提现
   */
  wxWithdraw: function () {
    if (this.data.submitAble) {
      this.setData({
        submitAble: false
      })
    } else {
      wx.showToast({
        title: '请稍等，正在提交数据中',
        icon: 'none'
      })
      return;
    }
    var that = this;
    app.packRequest({
      url: api.withdraw,
      data: {
        token: this.data.token,
        money: Number(this.data.value)
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            var animation = wx.createAnimation({
              duration: 300
            })
            animation.height(0).step();
            that.setData({
              withdrawState: 1,
              animationData: animation.export(),
            })
          } else {
            that.setData({
              submitAble: true
            })
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        } else {
          that.setData({
            submitAble: true
          })
          wx.showToast({
            title: '请求错误',
            icon: 'none'
          })
        }
      },
      fail: function () {
        that.setData({
          submitAble: true
        })
        wx.showToast({
          title: '请求错误',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 人工提现
   */
  manualWithdraw: function () {
    if (this.data.submitAble) {
      this.setData({
        submitAble: false
      })
    } else {
      wx.showToast({
        title: '请稍等，你的申请正在提交中',
        icon: 'none'
      })
      return;
    }
    var that = this;
    app.packRequest({
      url: api.manualWithdraw,
      data: {
        token: this.data.token,
        money: Number(this.data.value),
        remark: this.data.zAccount
      },
      method: 'POST',
      success: function (res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            var animation = wx.createAnimation({
              duration: 300
            })
            animation.height(0).step();
            that.setData({
              withdrawState: 1,
              animationData: animation.export(),
            })
          } else {
            that.setData({
              submitAble: true
            })
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        } else {
          that.setData({
            submitAble: true
          })
          wx.showToast({
            title: '请求错误',
            icon: 'none'
          })
        }
      },
      fail: function () {
        that.setData({
          submitAble: true
        })
        wx.showToast({
          title: '请求错误',
          icon: 'none'
        })
      }
    })
  }
})