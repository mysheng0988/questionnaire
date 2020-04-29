let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"暂无任务",
    checkList:[],
    isModals:true,
    isPopup:false,
    isOpen:false,
    arrTitle: ["GAD-7筛查量表", "汉密尔顿焦虑量表（HAMA）", "惊恐障碍严重度量表（PDSS）", "PHQ-9筛查量表", "汉密尔顿抑郁量表(HAMD)", "斯坦福急性应激反应问卷（SASRQ）", "简易自评量表SCL - 90", "阿森斯失眠量表（AIS）", "营养不良通用筛查表（MUST）", "社会适应能力量表"
      , "生活满意度量表（SWLS）", "压力自评量表（SSQ-53）", "YALE-BROWN强迫量表", "防御方式问卷DSQ", "A型行为问卷", "应付方式问卷", "青少年生活事件量表（ASLEC）", "抑郁性质问卷", "焦虑性质问卷", "家庭亲密度与适应性量表", "领悟社会支持量表(PSSS)",
      "父母教养方式评价量表（EMBU）", "特质应对方式问卷（TCSQ）", "营养初次问诊表", "创伤后应激障碍自评量表（PCL-C）", "躯体化症状自评量表", "生活事件量表（ＬＥＳ）", "抑郁自评量表SDS", "焦虑自评量表SAS", "贝克抑郁自评量表", "焦虑抑郁筛查量表（HADS）"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let paramArr=[];
    if(options.q){
      let scan_url = decodeURIComponent(options.q);
      paramArr = scan_url.split("patient/")[1];
      paramArr = paramArr.split("/");
    }
    this.setData({
      paramArr,
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      checkList:[]
    })
    if (app.globalData.accessToken!=""){
      
      this.initData()
    }else{
      this.setData({
        isPopup: true,
        isOpen:true,
      })
      app.authorize()
    }
  },
  async initData(){
    let patientId = await this.getUsrInfoData();
    this.getMedicalRecord(patientId)
  },
  getUsrInfoData(){
        return app.request({
          url: "base/patient/wechat/info",
          method: "get",
          data: {}
        }).then(res => {
          if (res.code == 200) {
            app.globalData.nickname = res.dataList[0].nickname;
            app.globalData.avatar = res.dataList[0].headImageUrl;
            app.globalData.cardNo = res.dataList[0].cardNo;
            return app.globalData.patientId = res.dataList[0].uid
          }
        })
  },
  getMedicalRecord(patientId){
    let checkList = [];
    return app.request({
      url: "ips/medicalRecord/patientId/" + patientId,
      method: "get",
      data: { }
    }).then(res => {
      if(res.code==200){
        let title ="问卷"
        let data=res.dataList[0];
        let examinationStatus = data.examinationStatus;
        let completeScaleNoList = data.completeScaleNoList;
        let completeQuestionnaire = data.completeQuestionnaire;
        let siblingsNumber = data.patientVO.siblingsNumber;
        app.globalData.scaleNoList = data.scaleNoList;
        if (data.examinationStatus == 20 ){
          if (data.questionnaireNo===1){
            let obj={
              name:"初筛首访问卷",
              id: data.questionnaireNo,
              complete: completeQuestionnaire,
            };
            checkList.push(obj)
          }else{
            let obj = {
              name: "首访问卷",
              id: data.questionnaireNo,
              complete: completeQuestionnaire,
            };
            checkList.push(obj)
          }
        } else if (data.examinationStatus == 30){
            title = "量表"
          let scaleNoList = data.scaleNoList;
          for(let item of scaleNoList){
            let num=item;
            if (item==2201){
               num=22;
            }
            let obj={
              name:this.data.arrTitle[num-1],
              id:item,
              complete: completeScaleNoList.includes(item)
            }
            checkList.push(obj)
          }

        } else{
          title="暂无任务"
        }

        this.setData({
          title,
          examinationStatus,
          scaleNoList: data.scaleNoList,
          checkList,
          siblingsNumber,
          completeScaleNoList,
          completeQuestionnaire,
          patientId: data.patientId,
          medicalRecordId: data.id,
        })
      }
    })
  },
  hideModal(){
      this.setData({
        isModals:true,
      })
  },
  hideModalPopup(){
    this.setData({
      isOpen:false
    })
   
    setTimeout(()=>{
      this.setData({
        isPopup: false,
      })
    },600)
  },
  handleLogin(){
    this.setData({
      isPopup: false,
      isOpen: false
    })

    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  openPopup(){
    this.setData({
      isPopup: true,
      isOpen:true,
    })
  },
  changeScale(){
    this.setData({
      isModals: false,
    })
  },
  answerProblem(e){
    let id = e.currentTarget.dataset.id;
    let medicalRecordId = this.data.medicalRecordId;
    let patientId = this.data.patientId;
    if(this.data.title=="问卷"){
      wx.navigateTo({
        url: '/pages/answer/answer?id=' + id + "&medicalRecordId=" + medicalRecordId + "&patientId=" + patientId
      })
    }else{
      wx.navigateTo({
        url: '/pages/scale/scale?id=' + id + "&medicalRecordId=" + medicalRecordId + "&patientId=" + patientId
      })
    }
   
  },
  setUserName(e) {
    let _this = this;
    var username = e.detail.value;
    _this.setData({
      username: username,
    })
  }, 
  setPassword(e) {
    let _this = this;
    var password = e.detail.value;
    _this.setData({
      password: password,
    })
  }, 
  userConfirm(){
    let that=this;
    let siblingsNumber = this.data.siblingsNumber;
    let user={
      username: this.data.username,
      password:this.data.password
    } 
    app.request({
      url: 'base/user/login',
      method: 'post',
      data: user
    }).then(res=>{
      if(res.code==200){
        that.setData({
          isModals: true,
        })
        wx.navigateTo({
          url: '/pages/scale/select/select?medicalRecordId=' + this.data.medicalRecordId + "&siblingsNumber=" + siblingsNumber,
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