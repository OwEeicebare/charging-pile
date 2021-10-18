var app = getApp();
const api = require('../../utils/api.js');
// pages/orders/orders.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeType: 'ing', //订单类型
    ingList: [],
    finishList: [],
    noCoupon: {
      imageSrc: '../../images/home/img_empty.svg',
      tips: '无订单记录，快去充电吧~'
    },
    currentFinishPage: 1,
    limit: 5,
    isBottom: false, //是否到底 不能再加载数据
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    touchBottom: false, //是否触底请求
    timer: null, //定时器
    finishCount: 0, //完成列表总数
    firstLoadList: true, //第一次加载首页订单
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
    clearInterval(this.data.timer);
    this.setData({
      currentFinishPage: 1,
      touchBottom: false,
      activeType: 'ing'
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.timer);
    this.setData({
      currentFinishPage: 1,
      touchBottom: false,
      activeType: 'ing'
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
    if (this.data.activeType === 'finish') {
      if (this.data.isBottom) {
        wx.showToast({
          title: '已经到底啦',
          icon: 'none'
        })
      } else {
        wx.showLoading({
          title: '加载中',
        })
        var currPageAble = this.data.finishCount > (this.data.currentFinishPage * this.data.limit);
        this.setData({
          touchBottom: true,
          currentFinishPage: currPageAble ? (this.data.currentFinishPage + 1) : this.data.currentFinishPage
        })
        this.getFinishedOrders();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 切换订单类型
   */
  switchType: function(event) {
    var orderType = event.currentTarget.dataset.type ? event.currentTarget.dataset.type : event.target.dataset.type ? event.target.dataset.type : '';
    if (!orderType) {
      return;
    }
    if (orderType === 'ing') {
      clearInterval(this.data.timer);
      this.getIngOrders();
      this.setData({
        timer: setInterval(() => {
          this.getIngOrders();
        }, 5000),
        currentFinishPage: 1,
        touchBottom: false
      })
    } else if (orderType === 'finish') {
      clearInterval(this.data.timer);
      this.getFinishedOrders();
    }
    this.setData({
      activeType: orderType
    })
  },
  /**
   * 订单详情
   */
  toDetail: function(event) {
    var detailId = event.currentTarget.dataset.detailid ? event.currentTarget.dataset.detailid : event.target.dataset.detailid ? event.target.dataset.detailid : 0;
    var state = event.currentTarget.dataset.state ? event.currentTarget.dataset.state : event.target.dataset.state ? event.target.dataset.state : 0;
    if (this.data.activeType === 'ing' && state != 1) {
      return;
    }
    if (!detailId) {
      wx.showToast({
        title: '数据错误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.navigateTo({
      url: '../../subpackage/orderDetail/orderDetail?detail_id=' + detailId + '&type=' + this.data.activeType,
    })
  },
  /**
   * 进行中的订单列表
   */
  getIngOrders: function() {
    var that = this;
    app.packRequest({
      url: api.ingOrders,
      data: {
        token: this.data.token,
        orderKey: "eleState"
      },
      method: 'POST',
      success: function(result) {
        wx.hideLoading();
        if (result.statusCode >= 200 && result.statusCode < 400) {
          if (result.data.status == 1) {
            if (!that.data.firstLoadList) {
              //非第一次加载数据
              var oldList = that.data.ingList;
              var newList = result.data.data;
              if (!(newList instanceof Array) || !newList.length) {
                that.setData({
                  ingList: []
                })
                return;
              }
              var retIngList = that.dealNewListData(newList, oldList);
              that.setData({
                ingList: retIngList
              })
            } else {
              //第一次加载数据，不处理issuccess为0的状态 
              that.setOnShowList(result.data.data);
            }
          }
          if (that.data.ingList.length === 0) {
            clearInterval(that.data.timer);
            wx.removeStorage({//清除列表缓存
              key: 'ingList'
            })
          } else {
            wx.setStorage({//缓存起来
              key: 'ingList',
              data: that.data.ingList,
            })
          }
        } else {
          clearInterval(that.data.timer);
          wx.showToast({
            title: '请求错误',
            icon: 'none'
          })
        }
        that.setData({
          firstLoadList: false
        })
      },
      fail: function() {
        wx.hideLoading();
        clearInterval(that.data.timer);
      }
    })
  },
  /**
   * 处理进行中列表数据中issuccess为0 取值取上一次的值 
   */
  dealNewListData: function(newList, oldList) {
    for (var i = 0; i < newList.length; i++) {
      if (!newList[i].isSuccess) {//与电桩通讯失败
        for (var j = 0; j < oldList.length; j++) {
          if (oldList[j].orderNumber === newList[i].orderNumber && oldList[j].isSuccess == 1) {//找同一条订单 并且上一条数据是与电桩通讯成功的数据
            newList.splice(i, 1, oldList[j]);
          }
        }
      }
    }
    return newList;
  },
  /**
   * 处理onshow情况下是否含有缓存数据 如果有inglist 并且 issuccess 赋值给inglist
   * inglist i issuccess 0
   */
  setOnShowList: function (data) {
    var that = this;
    if (!(data instanceof Array)) {
      this.setData({
        ingList: []
      })
      return;
    }
    wx.getStorage({
      key: 'ingList',
      success: function(res) {//有缓存
        var storageList = res.data;
        for (var i = 0; i < data.length; i++) {
          if (data[i].isSuccess == 0) {//与电桩通讯失败
            for (var j = 0; j < storageList.length; j++) {
              if (storageList[j].orderNumber === data[i].orderNumber && storageList[j].isSuccess == 1) {
                //同一条订单 并且缓存的数据是与电桩通讯成功的数据
                data.splice(i,1,storageList[j]);
              }
            }
          }
        }
        that.setData({
          ingList: data
        })
      },
      fail: function (err) {
        that.setData({
          ingList: data
        })
      }
    })
  },
  /**
   * 已完成的订单列表
   */
  getFinishedOrders: function() {
    wx.showLoading({
      title: '加载中'
    })
    var that = this;
    app.packRequest({
      url: api.finishedOrders,
      data: {
        token: this.data.token,
        page: this.data.currentFinishPage,
        limit: this.data.limit,
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            var currentCount = that.data.currentFinishPage * that.data.limit;
            var list = that.data.finishList;
            if (that.data.touchBottom) { //已触发分页
              list = res.data.data ? list.concat(res.data.data) : list.concat([]);
            } else {
              list = res.data.data ? res.data.data : [];
            }
            for (var i = 0; i < list.length; i++) {
              list[i].praDeuctMoney = Number(list[i].praDeuctMoney).toFixed(2);
            }
            that.setData({
              finishList: list,
              isBottom: currentCount < res.data.count ? false : true,
              finishCount: res.data.count
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
   * 获取token
   */
  getTokenStorage: function() {
    this.setData({
      firstLoadList: true
    })
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        wx.showLoading({
          title: '加载中'
        })
        clearInterval(that.data.timer);
        that.setData({
          token: res.data
        })
        if (that.data.activeType === 'ing') {
          that.getIngOrders();
          that.setData({
            timer: setInterval(() => {
              that.getIngOrders();
            }, 5000)
          })
        } else if (that.data.activeType === 'finish') {
          that.getFinishedOrders();
        }
      },
    })
  },
})