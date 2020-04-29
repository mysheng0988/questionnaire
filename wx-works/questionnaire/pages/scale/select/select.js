let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let medicalRecordId = options.medicalRecordId;
    let selectedList = app.globalData.scaleNoList;
    let siblingsNumber = options.siblingsNumber;
    app.request({
      url: "static/scale/scaleType.json",
      method: "get",
      data: {}
    }).then(res => {
      let list = res.data;
      for(let item of list){
        for (let item2 of item.children){
          item2.checked = selectedList.includes(item2.id)
        }
      }
      this.setData({
        medicalRecordId,
        siblingsNumber,
        list: list,
        listCur: list[0]
      })
    });
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

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  checkedData(e){
      let id=e.currentTarget.dataset.id;
      let index=e.currentTarget.dataset.index;
    let list = this.data.list;
    if (list[id].children[index].checked) {
      list[id].children[index].checked = false;
    } else {
      for (let item of list[id].children) {
        item.checked = false;
      }
      list[id].children[index].checked = true;
    } 
    
      this.setData({
        list,
      })
  },
  VerticalMain(e) {
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },
  submitData(){
    let medicalRecordId = this.data.medicalRecordId;
    let data=[];
    for(let item of this.data.list){
      for(let item1 of item.children){
        if(item1.checked){
          if(item1.id==22){
            data.push(2201)
          }else{
            data.push(item1.id)
          }
         
        }
      }
    }
     app.request({
       url: 'ips/scale/scaleConfirm/'+medicalRecordId,
       method:"post",
       data:data
     }).then(res=>{
       if(res.code==200){
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