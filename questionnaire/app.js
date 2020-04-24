let config = require('./config.js')
App({
  onLaunch: function () {
  },
  // 提示信息
  prompt: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      confirmText: "确定"
    })
  },
  // toast方法
  toast(msg = "") {
    wx.showToast({
      title: msg,
      icon: "none"
    })
  },
  //获取授权码，//检查是否有授权码
  authorize() {
    let that = this;
    //let openId = wx.getStorageSync("openId")
    return new Promise((resolve, reject) => {
      resolve();
      wx.login({
        success: ({
          code
        }) => {
          that.request({
            url: "base/patient/wechat/login",
            method:"post",
            data: {
              code,
            }
          })
            .then((res) => {
              if (res.code == "200") {
                that.globalData.accessToken=res.dataList[0]
                that.brocast({
                  path: "pages/index/index",
                  method: "initData"
                })
                return  res.dataList[0];
              }
            })
        },
        fail: () => {
          this.prompt("获取基本信息错误,请重新打开小程序");
          wx.reLaunch();
        }
      });
    })
  },
  request(option = {
    headers: {},
    url: "",
    method:"GET"
  }) {
    let self = this;
    let token = self.globalData.accessToken;
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '数据加载中',
      })
      wx.request({
        url: option.url.indexOf("http") > -1 ? option.url : config.domain + option.url,
        header: Object.assign({
          "content-Type": config.contentType,
          "appid":"wx14ada5b5ff820f7b",
          "access-token": token,
          "service-id":2000
        }, option.headers),
        method: option.method,
        data: JSON.stringify(option.data),
        complete(res) {
          wx.hideLoading();
          switch (res.statusCode) {
            case 200:
              switch (res.data.code) {
                case 200:
                break;
                case 618:
                  wx.redirectTo({
                    url: '/pages/login/login',
                  });
                  reject({
                    code: '618'
                  })
                  break;
                case 500:
                  self.toast("请求数据失败")
                  reject({
                    code: '500'
                  })
                  break;
                default:
                  self.toast(res.data.message)
                  reject({
                    code: res.data.code
                  })
                  
              }
              resolve(res.data);
              break;
            case 404:
              self.toast("访问数据不存在");
              reject({
                code: 404
              })
              break;
            case 500:
              self.toast("服务器错误");
              reject({
                code: 500
              })
              break;
            default:
              self.toast("网络或服务器错误~")
              reject({
                code: 500
              })
              wx.hideLoading();
          }
        }
      })
    })
  },
  request2(option = {
    headers: {},
    url: "",
    method: "GET"
  }) {
    let self = this;
    let token = self.globalData.accessToken;
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '数据加载中',
      })
      wx.request({
        url: option.url.indexOf("http") > -1 ? option.url : "http://121.36.46.3/" + option.url,
        header: Object.assign({
          "content-Type": config.contentType,
          "appid": "wx14ada5b5ff820f7b",
          "access-token": token,
          "service-id": 2000
        }, option.headers),
        method: option.method,
        data: JSON.stringify(option.data),
        complete(res) {
          wx.hideLoading();
         
          switch (res.statusCode) {
            case 200:
              switch (res.data.code) {
                case 618:
                  wx.redirectTo({
                    url: '/pages/login/login',
                  });
                  reject({
                    code: '618'
                  })
                  break;
                case 500:
                  self.toast("请求数据失败")
                  reject({
                    code: '500'
                  })
                  break;
              }
              resolve(res.data);
              break;
            case 404:
              self.toast("访问数据不存在");
              reject({
                code: 404
              })
              break;
            case 500:
              self.toast("服务器错误");
              reject({
                code: 500
              })
              break;
            default:
              self.toast("网络或服务器错误~")
              reject({
                code: 500
              })
              wx.hideLoading();
          }
        }
      })
    })
  },
  //广播
  brocast({
    path = "",
    params = {},
    method = "receive"
  }) {
    let pages = getCurrentPages();
    console.log(pages)
    //广播
    if (path == "") {
      pages.forEach(page => {
        if (typeof page[method] == 'function') {
          page[method]();
        }
      })
      //单播
    } else {
      let cupage = pages.find(page => page.route == path);
      if (cupage && cupage[method]) {
        cupage[method]();
      } else {
        console.warn(`单播页面[:${path}]没有找到或者没有[${method}]`);
      }
    }
  },
  globalData: {
    userInfo: null,
    accessToken:"",
    nickname:"",
    avatar:"",
    cardNo:""
  }
})