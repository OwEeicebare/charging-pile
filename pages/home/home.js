var app = getApp();
const api = require('../../utils/api.js');
const format = require('../../utils/util.js');
// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listShow: false, //充电列表是否显示
    rules: null, //计费规则
    showType: '', //当前popup
    ingList: [], //正在充电列表
    banner: [], //轮播图
    coupon: [], //优惠券列表
    stationInfo: null, //站点信息
    directBase: {
      dcCount: 0,
      dcUsable: 0
    }, //直流基本信息
    exchangeBase: {
      acCount: 0,
      acUsable: 0
    }, //交流基本信息
    currentEleFee: 0, //当前费用信息
    hasPhone: 0, //是否已授权手机号
    token: '', //token
    listStationShow: false, //电站下拉选择
    stationList: [], //电站列表
    eleList: null, //直流电桩列表
    alEleList: null, //交流电桩列表
    timer: null, //定时器
    firstLoadList: true, //第一次加载首页订单
  },

  /**
   * 生命周期函数--监听页面加载 一次性
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
    //获取站点信息
    // 站点状态 1 正常开放 2 暂停开放
    this.getStationInfo();
    this.getHasPhoneStorage();
    this.getTokenStorage();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      listShow: false,
      showType: '',
      listStationShow: false
    })
    clearInterval(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.setData({
      listShow: false,
      showType: '',
      listStationShow: false
    })
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
   * 扫码
   */
  scan: function() {
    this.judgeAuthor(this.scanCode);
  },
  /**
   * 手动输入电桩号
   */
  handInput: function() {
    this.judgeAuthor(this.handInputTo);

  },
  /**
   * 关闭列表及说明
   */
  closeList: function(event) {
    if (event.target.dataset.operate || event.currentTarget.dataset.operate) {
      this.setData({
        listShow: false,
        showType: ''
      })
    }
  },
  /**
   * 打开交流直流列表
   */
  openList: function(event) {
    var type = event.currentTarget.dataset.type ? event.currentTarget.dataset.type : event.target.dataset.type ? event.target.dataset.type : '';
    if (!type) {
      return;
    }
    if (type === 'alternating') { //交流
      this.setData({
        showType: 'aList',
        listShow: true
      })
    } else if (type === 'straight') { //直流
      this.setData({
        showType: 'sList',
        listShow: true
      })
    }
  },
  /**
   * 打开计费规则
   */
  openRules: function(event) {
    if (this.data.rules && this.data.rules.list instanceof Array && this.data.rules.list.length) {
      this.setData({
        showType: 'rules',
        listShow: true
      })
    } else {
      wx.showToast({
        title: '暂无数据',
        icon: 'none'
      })
    }
  },
  /**
   * 关闭弹窗
   */
  closePopUp: function(event) {
    var id = event.target.dataset.couponid ? event.target.dataset.couponid : event.currentTarget.dataset.couponid ? event.currentTarget.dataset.couponid : 0;
    if (this.data.coupon.length === 1 && event.target.dataset.operate || event.currentTarget.dataset.operate) {
      this.setData({
        listShow: false
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
   * 打开地图
   */
  toMap: function() {
    wx.openLocation({
      latitude: Number(this.data.stationInfo.northPoint),
      longitude: Number(this.data.stationInfo.eastPoint),
      scale: 18
    })
  },
  /**
   * 获取电桩信息
   */
  getStationInfo: function() {
    var that = this;
    app.packRequest({
      url: api.stationInfo,
      method: 'POST',
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            that.setData({
              stationList: res.data.data instanceof Array && res.data.data.length ? res.data.data : []
            })
            //保存站点信息
            if (res.data.data instanceof Array && res.data.data.length) {
              that.saveStationInfo(res.data.data);
              //获取电桩基本信息
              that.getElePile();
              that.getFeeRules();
              that.getCurrentFee();
              that.getBanner(); //获取轮播图
            }
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
   * 获取电桩基本信息
   */
  getElePile: function() {
    var that = this;
    app.packRequest({
      url: api.elePile,
      data: {
        stationId: this.data.stationInfo.id
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1 && res.data.data) {
            that.setData({
              directBase: {
                dcCount: res.data.data.dcCount,
                dcUsable: res.data.data.dcUsable
              },
              exchangeBase: {
                acCount: res.data.data.acCount,
                acUsable: res.data.data.acUsable
              }
            })
            that.setData({
              eleList: {
                type: '直流',
                list: res.data.data.dcEleDetailInfo ? res.data.data.dcEleDetailInfo : []
              },
              alEleList: {
                type: '交流',
                list: res.data.data.acEleDetailInfo ? res.data.data.acEleDetailInfo : []
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
   * 获取所有站桩信息 1是直流 2是交流
   */
  getElePileAllInfo: function(eleTypeId) {
    var that = this;
    app.packRequest({
      url: api.elePileAllInfo,
      data: {
        eleTypeId: eleTypeId,
        stationId: this.data.stationInfo.id
      },
      method: 'POST',
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            if (!(res.data.data instanceof Array) || (res.data.data instanceof Array && res.data.data.length === 0)) {
              wx.showToast({
                title: '无数据',
                icon: 'none'
              })
              that.setData({
                showType: '',
                eleList: null,
              })
              return;
            }
            that.setData({
              showType: eleTypeId === 1 ? 'sList' : eleTypeId === 2 ? 'aList' : '',
              eleList: {
                type: eleTypeId === 1 ? '直流' : eleTypeId === 2 ? '交流' : '',
                list: res.data.data ? res.data.data : []
              },
              listShow: true
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
      },
      fail: function() {
        wx.hideLoading();
        wx.showToast({
          title: '网络请求异常，请稍后重试',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 获取计费规则
   */
  getFeeRules: function() {
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
                list: res.data.data ? res.data.data : []
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
      },
      fail: function() {
        wx.showToast({
          title: '网络请求异常，请稍后重试',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 获取当前电费信息
   */
  getCurrentFee: function() {
    var that = this;
    app.packRequest({
      url: api.eleCost,
      data: {
        id: this.data.stationInfo.id,
        timeInfo: format.hours(new Date())
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (!res.data) {
            wx.showToast({
              title: '请求错误',
              icon: 'none'
            })
            return;
          }
          if (res.data.status == 1) {
            that.setData({
              currentEleFee: res.data.data ? res.data.data.eleCost : 0
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
   * 是否授权
   */
  judgeAuthor: function(executeF) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              app.globalData.userInfo = res.userInfo
            }
          })
          executeF();
        } else {
          wx.navigateTo({
            url: '../../subpackage/login/login'
          })
        }
      }
    })
  },
  getHasPhoneStorage: function() { //获取是否授权手机号
    var that = this;
    wx.getStorage({
      key: 'has-phone',
      success: function(res) {
        that.setData({
          hasPhone: Number(res.data)
        })
      },
    })
  },
  scanCode: function() { //扫码
    var that = this;
    if (this.data.stationInfo && this.data.stationInfo.stateId === 2) {
      wx.showToast({
        title: '该站点正在维护中...',
        icon: 'none'
      })
      return;
    }
    if (this.data.hasPhone) {
      wx.scanCode({
        onlyFromCamera: true,
        scanType: ['qrCode'],
        success: function(res) {
          app.requestCharge(res.result);
        },
        fail: function(res) {

        }
      })
    } else {
      wx.navigateTo({
        url: '../../subpackage/bindPhone/bindPhone'
      })
    }
  },
  getTokenStorage: function() { //获取token
    this.setData({
      firstLoadList: true
    })
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        that.setData({
          token: res.data,
          timer: setInterval(() => {
            that.getHomeOrders();
          }, 5000)
        })
        that.getHomeCoupons();
        that.getHomeOrders();
      },
    })
  },
  handInputTo: function() { //点击手动输入电桩号
    var that = this;
    if (this.data.stationInfo && this.data.stationInfo.stateId === 2) {
      wx.showToast({
        title: '该站点正在维护中...',
        icon: 'none'
      })
      return;
    }
    if (this.data.hasPhone) {
      wx.navigateTo({
        url: '../../subpackage/handInput/handInput',
      })
    } else {
      wx.navigateTo({
        url: '../../subpackage/bindPhone/bindPhone'
      })
    }
  },
  getBanner: function() { //获取轮播图
    var that = this;
    app.packRequest({
      url: api.banner,
      data: {
        stationId: this.data.stationInfo.id
      },
      method: 'POST',
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            that.setData({
              banner: res.data.data ? res.data.data : []
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
   * 获取优惠券列表
   */
  getHomeCoupons: function() {
    var that = this;
    app.packRequest({
      url: api.homeCoupon,
      data: '"' + this.data.token + '"',
      method: 'POST',
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            if (res.data.data instanceof Array && res.data.data.length) {
              that.setData({
                listShow: true,
                showType: 'popup',
                coupon: res.data.data
              })
            }
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
      },
      fail: function() {
        clearInterval(that.data.timer);
      }
    })
  },
  /**
   * 充电站的选择
   */
  openStationList: function() {
    this.setData({
      listStationShow: true
    })
  },
  /**
   * 选择电站
   */
  stationChange: function(e) {
    var id = e.target.dataset.id;
    if (!id) return;
    for (var i in this.data.stationList) {
      if (id == this.data.stationList[i].id) {
        this.setData({
          stationInfo: this.data.stationList[i],
          listStationShow: false
        })
        wx.setStorage({
          key: 'stationInfo',
          data: this.data.stationInfo,
        })
        //重新刷新数据
        this.getElePile();
        this.getFeeRules();
        this.getCurrentFee();
        this.getBanner(); //获取轮播图
        break;
      }
    }
  },
  /**
   * 关闭下拉选择
   */
  closeStation: function(e) {
    this.setData({
      listStationShow: false
    })
  },
  /**
   * get首页进行中订单
   */
  getHomeOrders: function() {
    var that = this;
    app.packRequest({
      url: api.ingOrders,
      data: {
        token: this.data.token,
        orderKey: "eleState"
      },
      method: 'POST',
      success: function(result) {
        if (result.statusCode >= 200 && result.statusCode < 400) {
          if (result.data.status == 1) {
            if (!that.data.firstLoadList) {
              //非第一次加载数据
              var oldList = that.data.ingList;
              var newList = result.data.data;
              if (!(newList instanceof Array) || !newList.length){
                that.setData({
                  ingList: []
                })
                return;
              }
              var retIngList = that.dealNewListData(newList, oldList);
              console.log('处理过后的首页数据', retIngList);
              that.setData({
                ingList: retIngList
              })
            } else {
              //第一次加载数据，不处理issuccess为0的状态 
              that.setData({
                ingList: result.data.data instanceof Array ? result.data.data : []
              })
            }
          }
          if (that.data.ingList.length === 0) { //无数据则清除定时器
            clearInterval(that.data.timer);
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
  dealNewListData: function (newList, oldList) {
    for (var i = 0; i < newList.length; i++) {
      if (!newList[i].isSuccess) {
        for (var j = 0; j < oldList.length; j++) {
          if (oldList[j].orderNumber === newList[i].orderNumber) {
            newList.splice(i,1,oldList[j]);
          }
        }
      }
    }
    return newList;
  },
  /**
   * 更新站点信息
   */
  saveStationInfo: function(data) {
    if (!this.data.stationInfo) {
      this.setData({
        stationInfo: data[0]
      })
      wx.setStorage({
        key: 'stationInfo',
        data: data[0],
      })
    } else {
      for (var i = 0; i < data.length; i++) {
        if (data[i].id === this.data.stationInfo.id) {
          this.setData({
            stationInfo: data[i]
          })
          wx.setStorage({
            key: 'stationInfo',
            data: data[i],
          })
          break;
        }
      }
    }
  }
})