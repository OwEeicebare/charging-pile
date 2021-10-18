// pages/orderDetail/orderDetail.js
const api = require('../../utils/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailObj: {

      soc: 0,
      electricity: 0,
      eleVoltage: 0,
      rechMoney: '0.00',
      residueTime: 0,
      percent: 0,

      eleQuantity: 0,
      couponsMoney: '0.00',
      praDeuctMoney: '0.00',
      realityDeductMoney: '0.00'
    }, //详情对象
    orderId: 0,
    type: 'ing', //订单类型
    token: '',
    overMask: false, //结束充电蒙版
    timer: null, //定时器
    // goOn: false, //是否继续充电
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderId: options.detail_id,
      type: options.type
    })
    // console.log(this.data.type);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    this.getTokenStorage();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.timer);
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
   * 继续充电
   */
  goOnCharge: function() {
    // this.setData({
    //   goOn: true
    // })
    wx.navigateTo({
      url: '../battery/battery?eleNumber=' + this.data.detailObj.eleNumber,
      // + '&goon=true'
    })
  },
  /**
   * 获取token
   */
  getTokenStorage: function() {
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        that.setData({
          token: res.data
        })
        that.getOrderDetail();
      },
    })
  },
  /**
   * 获取订单详情
   */
  getOrderDetail: function() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (this.data.type === 'ing') {
      this.getIngOrder();
      this.setData({
        timer: setInterval(() => {
          this.getIngOrder();
        }, 5000)
      })
    } else if (this.data.type === 'finish') {
      this.getFinishOrder(this.data.orderId);
    } else {
      wx.hideLoading();
      wx.switchTab({
        url: '../../pages/orders/orders',
      })
    }
  },
  /**
   * 进行中订单详情
   */
  getIngOrder: function() {
    var that = this;
    app.packRequest({
      url: api.ingDetail,
      data: {
        orderNumber: this.data.orderId
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {//有数据
            if (res.data.data.endOrderId) {//订单结束
              wx.showLoading({
                title: '加载中',
              })
              clearInterval(that.data.timer);
              that.setData({
                type: 'finish'
              });
              that.getFinishOrder(res.data.data.endOrderId);
              return;
            }
            var oldDetails = that.data.detailObj;
            var details = res.data.data ? res.data.data : null;
            if (details) {
              details.rechMoney = details.rechMoney.toFixed(2);
              if (details.percent == 0 && oldDetails.percent != 0) {//判断当前percent为0 上一条数据percent不为0 取上一条数据
                details = oldDetails;
              }
            } else {
              details.rechMoney = '0.00';
            }
            that.setData({
              detailObj: details
            })
            wx.setStorage({
              key: 'ingDetails',
              data: details,
            })
          } else {//异常情况下 比如与电桩通讯失败 使用上一次保存的数据 
            wx.getStorage({
              key: 'ingDetails',
              success: function(res) {
                if (res.data.orderNumber === this.data.orderId)
                that.setData({
                  detailObj: res.data
                })
              },
            })
          }
        } else {
          clearInterval(that.data.timer);
          wx.showToast({
            title: '请求错误',
            icon: 'none'
          })
        }
      },
      fail: function(err) {
        wx.hideLoading();
        clearInterval(that.data.timer);
      }
    })
  },
  /**
   * 已完成订单详情
   */
  getFinishOrder: function(orderId) {
    var that = this;
    app.packRequest({
      url: api.finishedDetail,
      data: {
        orderNumber: orderId
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            var endDetails = res.data.data ? res.data.data : null;
            if (endDetails) {
              endDetails.praDeuctMoney = endDetails.praDeuctMoney.toFixed(2);
              endDetails.realityDeductMoney = endDetails.realityDeductMoney.toFixed(2);
              endDetails.couponsMoney = endDetails.couponsMoney.toFixed(2);
            } else {
              endDetails.praDeuctMoney = '0.00';
              endDetails.realityDeductMoney = '0.00';
              endDetails.couponsMoney = '0.00';
            }
            that.setData({
              detailObj: endDetails
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
   * 结束充电
   */
  enquireOver: function() {
    var that = this;
    wx.showModal({
      content: '是否结束充电',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#666',
      confirmText: '确定',
      confirmColor: '#000',
      success: function(res) {
        if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: 'none'
          })
        } else {
          that.overCharge();
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '请退出重新操作',
          icon: 'none'
        })
      }
    })
  },
  overCharge: function() {
    this.setData({
      overMask: true
    });
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    app.packRequest({
      url: api.overRecharge,
      data: {
        serialId: this.data.orderId
      },
      method: 'POST',
      success: function(res) {
        console.log('结束充电', res);
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            wx.hideLoading();
            clearInterval(that.data.timer);
            wx.showToast({
              title: '充电结束',
              icon: 'none',
              success: function() {
                that.setData({
                  type: 'finish',
                  overMask: false
                });
                that.getFinishOrder(res.data.data);
              }
            })
          } else {
            wx.hideLoading();
            clearInterval(that.data.timer);
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
            that.setData({
              overMask: false
            })
          }
        } else {
          wx.hideLoading();
          clearInterval(that.data.timer);
          wx.showToast({
            title: '请求错误',
            icon: 'none'
          })
          that.setData({
            overMask: false
          })
        }
      },
      fail: function() {
        clearInterval(that.data.timer);
        wx.hideLoading();
        wx.showToast({
          title: '网络请求超时',
          icon: 'none'
        })
        that.setData({
          overMask: false
        })
      }
    })
  }
})