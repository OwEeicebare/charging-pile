const api = require('../../utils/api.js');
var app = getApp();
// pages/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activedMoney: '',
    noCoupon: {
      imageSrc: '../../images/home/img_recharge.svg',
      tips: '充值成功'
    },
    rechargeState: 0, //0 失败 1 成功
    animationData: {},
    ableState: 0, //按钮是否可点击0 灰 1 绿
    value: '',
    coupon: [], //优惠券列表
    popShow: false,
    token: '',
    packMoney: 0,
    pays: [], //充值金额列表
    submitAble: true, //是否可点击充值按钮
    timer: null, //定时器
    timeNum: 0, //30s后提醒充值失败
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
    this.getRechargeMoney();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.hideLoading();
    clearTimeout(this.data.timer);
    this.setData({
      timeNum: 0
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.hideLoading();
    clearTimeout(this.data.timer);
    this.setData({
      timeNum: 0
    })
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
   * 修改充值金额
   */
  changeMoney: function(event) {
    var money = event.target.dataset.money ? Number(event.target.dataset.money) : event.currentTarget.dataset.money ? Number(event.currentTarget.dataset.money) : '';
    if (!money) {
      return;
    }
    this.setData({
      activedMoney: money,
      value: money,
      ableState: 1
    })
  },
  /**
   * 充值
   */
  recharge: function() {
    if (!this.data.value) {
      wx.showToast({
        title: '请输入充值金额',
        icon: 'none'
      })
      return;
    }
    if (!((/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/).test(this.data.value))) {
      wx.showToast({
        title: '充值金额格式错误',
        icon: 'none'
      })
      return;
    }
    //发起微信支付
    var that = this;
    var timestamp = Date.parse(new Date()) / 1000 + '';
    //统一下单
    this.getpreOrder(this.data.value);
  },
  /**
   * 统一下单
   */
  getpreOrder: function(input) {
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
      url: api.gerPreOrderId,
      data: {
        token: this.data.token,
        money: input
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            wx.requestPayment({
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonceStr,
              package: res.data.data.package,
              signType: 'MD5',
              paySign: res.data.data.paySign,
              success: function(result) {
                that.setData({
                  submitAble: true
                })
                that.sendResult(res.data.data.transactionId);
              },
              fail: function(error) {
                that.setData({
                  submitAble: true
                })
              }
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
      }
    })
  },
  /**
   * 输入金额
   */
  inputMoney: function(event) {
    if (event.detail.value) {
      if (!((/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/).test(event.detail.value))) {
        wx.showToast({
          title: '充值金额格式错误',
          icon: 'none'
        })
      }
      this.setData({
        ableState: 1
      })
    } else {
      this.setData({
        ableState: 0
      })
    }
    this.setData({
      activedMoney: '',
      value: event.detail.value
    })
  },
  /**
   * 关闭弹窗
   */
  closePopUp: function(event) {
    var id = event.target.dataset.couponid ? event.target.dataset.couponid : event.currentTarget.dataset.couponid ? event.currentTarget.dataset.couponid : 0;
    if (this.data.coupon.length === 1 && event.target.dataset.operate || event.currentTarget.dataset.operate) {
      this.setData({
        popShow: false
      })
    }
    for (var i = 0; i < this.data.coupon.length; i++) {
      if (Number(id) === this.data.coupon[i].id) {
        this.data.coupon.splice(i, 1);
        this.setData({
          coupon: this.data.coupon
        })
        return;
      }
    }
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
   * 支付成功发送信息给后台  成功支付返回充值优惠券
   */
  sendResult: function(transactionId) {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    app.packRequest({
      url: api.rechargeCoupons,
      method: 'POST',
      data: {
        token: this.data.token,
        transactionId: transactionId
      },
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (Number(res.data.status) === 0) {
            if (that.data.timeNum <= 60) {
              that.getResult(transactionId);
            } else {
              wx.hideLoading();
              clearTimeout(that.data.timer);
              that.setData({
                timeNum: 0
              })
              wx.showToast({
                title: '充值失败，请联系值班管理员',
                icon: 'none'
              })
            }
          } else if (res.data.status == 1) {
            wx.hideLoading();
            clearTimeout(that.data.timer);
            var animation = wx.createAnimation({
              duration: 300
            })
            animation.height(0).step();
            that.setData({
              popShow: true,
              coupon: res.data.data instanceof Array && res.data.data.length ? res.data.data : [],
              rechargeState: 1,
              animationData: animation.export()
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        } else {
          clearTimeout(that.data.timer);
          wx.showToast({
            title: '请求错误',
            icon: 'none'
          })
        }
      },
      fail: function() {
        wx.hideLoading();
        clearTimeout(that.data.timer);
      }
    })
  },
  /**
   * 获取充电金额列表
   */
  getRechargeMoney: function() {
    var that = this;
    app.packRequest({
      url: api.rechargeMoney,
      method: 'POST',
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            var pays = [];
            for (var i in res.data.data) {
              if (i !== 'id') {
                pays.push({
                  money: res.data.data[i]
                });
              }
            }
            that.setData({
              pays: pays
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
   * 若是获取优惠券未成功 则隔几秒再请求
   */
  getResult: function(transactionId) {
    this.setData({
      timeNum: this.data.timeNum + 1,
      timer: setTimeout(() => {
        this.sendResult(transactionId);
      }, 500)
    })
  }
})