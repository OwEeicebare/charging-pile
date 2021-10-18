const api = require('utils/api.js');
//app.js
App({
  onLaunch: function() {
    // 更新版本
    this.updateMiniApp();
    // this.watchClear();

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log('登录成功', res);
        this.getToken(res.code);
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.navigateTo({
            url: '/subpackage/login/login'
          })
        }
      }
    })
  },
  onShow: function () {
    // 更新版本
    this.updateMiniApp();
    // this.watchClear();

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log('登录成功', res);
        this.getToken(res.code);
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.navigateTo({
            url: '/subpackage/login/login'
          })
        }
      }
    })
  },
  onHide: function () {
    //退出小程序到后台 清除storage
    wx.clearStorage();
  },
  globalData: {
    userInfo: null,
    token: '',
  },
  packRequest(opt) { //拦截请求
    opt.data = opt.data || {};
    opt.header = opt.header || {
      'content-type': 'application/json'
    };
    opt.dataType = opt.dataType || 'json';
    opt.responseType = opt.responseType || 'text'
    opt.success = opt.success || function() {};
    opt.fail = opt.fail || function(err){
      wx.hideLoading();
    };
    wx.request({
      url: opt.url,
      data: opt.data,
      header: opt.header,
      method: opt.method,
      dataType: opt.dataType,
      responseType: opt.responseType,
      success: opt.success,
      fail: opt.fail
    })
  },
  getToken(code) { //获取token
    var that = this;
    var string = '"' + code + '"';
    this.packRequest({
      url: api.login,
      data: string,
      method: 'POST',
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            wx.setStorage({
              key: 'token',
              data: res.data.data.token,
            })
            that.globalData.token = res.data.data.token;
            that.getHasPhone(res.data.data.token);
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
  getHasPhone(token) { //验证是否绑定手机号
    this.packRequest({
      url: api.hasPhone,
      data: "'" + token + "'",
      method: 'POST',
      success: function(res) {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          wx.setStorage({
            key: 'has-phone',//0为无手机号 1为有手机号
            data: res.data.status,
          })
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
   * 请求是否可充电
   */
  requestCharge: function (eleNumber) {
    this.packRequest({
      url: api.charge,
      data: {
        token: this.globalData.token,
        eleNumber: eleNumber
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode >= 200 && res.statusCode < 400) {
          if (res.data.status == 1) {
            var url = '/subpackage/battery/battery?eleNumber=' + eleNumber;
            // if (orderId) {
            //   url = url + '&orderId=' + orderId;
            // }
            wx.redirectTo({
              url: url
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
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: '网络连接超时',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 更新版本问题
   */
  updateMiniApp: function () {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      console.log('是否有版本更新', res.hasUpdate);
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  },
  /**
   * 监听小程序运行内存过高，清除部分内存
   */
  watchClear: function () {
    wx.onMemoryWarning(function () {
      console.log('内存不足')
      wx.removeStorageSync('logs');
    })
  }
})