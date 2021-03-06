let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isModals:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  hideModal() {
    this.setData({
      isModals: true,
    })
  },

  untyingAccount(){
    this.setData({
      isModals: false,
    })

  },
  userConfirm(){
    let that=this;
    app.request({
      url:"base/patient/wechat/unbind",
      method:"delete",
      data:{}
    }).then(res=>{
      if(res.code==200){
        that.setData({
          isModals:true,
        })
        app.globalData.accessToken="",
        app.globalData.nickname="",
        app.globalData.avatar= "",
          app.globalData.cardNo= ""
        wx.navigateBack({
          delta: 1
        })
      }
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