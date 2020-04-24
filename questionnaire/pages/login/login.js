let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    RadioType: 1,
    phoneNumber: "",
    securityCode: "",
    phDisabled: false,
    verifyWord: '获取验证码',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onReady: function (options) {

  },
  
  setCardNo(e){
    let _this = this;
    var cardNo = e.detail.value;
    _this.setData({
      cardNo,
    })
  },
  // 获取密码
  securityCode(e) {
    let _this = this;
    var password = e.detail.value;
    _this.setData({
      password: password,
    })
  }, 
  

 







  //用户登录
  loginUser(e) {
    var that = this;
    var password = that.data.password;
    var cardNo = that.data.cardNo;
    //用户按了允许授权按钮
    var data = e.detail.userInfo;
    var nickName = data.nickName;
    var avatar = data.avatarUrl;
    var sex = data.gender;
    var city = data.city;
    var province = data.province;
    
    wx.login({
      success(res) {
        if (res.code) {
          let code = res.code;
          app.request({
            url: "base/patient/wechat/login",
            method: "post",
            data: {
              cardNo: cardNo,
              city: city,
              code: code,
              gender: sex,
              headImageUrl: avatar,
              nickname: nickName,
              password: password,
              province: province,
            }
          }).then(res => {
              if(res.code==200){
                app.globalData.accessToken=res.dataList[0];
                wx.switchTab({
                  url: '/pages/index/index',
                })
              }
          });
        
        }
      }
    })
  },
 
})