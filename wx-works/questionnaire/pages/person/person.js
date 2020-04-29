let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   

  },

 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let reg = /(\d{3})\d{12}(\d{2})/
    let cardNo = app.globalData.cardNo;
    let result = cardNo.replace(reg, "$1******$2")
    this.setData({
      accessToken: app.globalData.accessToken,
      nickname: app.globalData.nickname,
      avatar: app.globalData.avatar,
      cardNo: result
    })
  },

  handleLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  untyingUser(){
     wx.navigateTo({
       url: '/pages/untying/untying',
     })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})