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
    pays: [],
    activeMoney: 0,
    chargeMoney: '', //充电金额
    setAble: false, //设置soc
    soc: '95',
    submitAble: 1, //是否已输入
    orderId: 0,
    token: '',
    ableState: 0, //是否可点击立即充电按钮
    submitCharge: true, //立即充电按钮是否可用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      eleNumber: options.eleNumber,
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
    this.getStationInfoStorage();
    this.getTokenStorage();
    this.getChargeMoney();
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
    //判断是否设置充电金额
    if (!this.data.chargeMoney) {
      wx.showToast({
        title: '请输入充电金额',
        icon: 'none'
      })
      return;
    }
    if (Number(this.data.chargeMoney) > Number(this.data.chargeInfo.balance)) { //充电金额大于当前余额
      wx.showToast({
        title: '余额不足，请及时充值',
        icon: 'none'
      })
      return;
    }
    if (this.data.submitCharge) {
      this.setData({
        submitCharge: false
      })
    } else {
      wx.showToast({
        title: '提交中...',
        icon: 'none'
      })
      return;
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    var data = {
      token: this.data.token,
      money: this.data.chargeMoney,
      emlNum: this.data.chargeInfo.eleNumber,
      soc: Number(this.data.soc)
    }
    app.packRequest({
      url: api.recharge,
      data: data,
      method: 'POST',
      success: function(res) {
        console.log('立即充电', res);
        wx.hideLoading();
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            if (res.data.data) {
              wx.redirectTo({
                url: '../orderDetail/orderDetail?detail_id=' + res.data.data + '&type=ing',
              })
            } else {
              that.setData({
                submitCharge: true
              })
              wx.showToast({
                title: '网络延迟，请退出查看我的订单',
                icon: 'none'
              })
            }
          } else {
            that.setData({
              submitCharge: true
            })
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        } else {
          that.setData({
            submitCharge: true
          })
          wx.showToast({
            title: '请求错误',
            icon: 'none'
          })
        }
      },
      fail: function() {
        that.setData({
          submitAble: true,
          submitCharge: true
        })
        wx.showToast({
          title: '与设备连接超时',
          icon: 'none'
        })
      }
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
      data: {
        stationId: this.data.stationInfo.id
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
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
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            that.setData({
              chargeInfo: res.data.data
            })
            that.data.chargeInfo.rating = that.data.chargeInfo.rating.toFixed(4);
            that.data.chargeInfo.balance = that.data.chargeInfo.balance.toFixed(2);
            that.setData({
              chargeInfo: that.data.chargeInfo
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
  changeMoney: function(event) {
    var index = event.target.dataset.index ? Number(event.target.dataset.index) : event.currentTarget.dataset.index ? Number(event.currentTarget.dataset.index) : '';
    if (!index) {
      return;
    }
    this.setData({
      activeMoney: index,
      chargeMoney: index,
      ableState: 1
    })
  },
  /**
   * 设置soc
   */
  setSoc: function() {
    this.setData({
      setAble: true
    })
  },
  /**
   * 监听输入
   */
  inputNumber: function(event) {
    if (event.detail.value) {
      this.setData({
        submitAble: 1
      })
    } else {
      this.setData({
        submitAble: 0
      })
    }
    this.setData({
      soc: event.detail.value
    })
  },
  /**
   * 确定设置soc
   */
  ensure: function() {
    this.setData({
      setAble: false
    })
  },
  /**
   * 关闭设置soc
   */
  closeSet: function() {
    this.setData({
      setAble: false
    })
  },
  /**
   * 监听自定义充电金额
   */
  setChargeMoney: function(event) {
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
      chargeMoney: event.detail.value
    })
  },
  /**
   * 获取充电金额列表
   */
  getChargeMoney: function() {
    var that = this;
    app.packRequest({
      url: api.chargeMoney,
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
  }
})