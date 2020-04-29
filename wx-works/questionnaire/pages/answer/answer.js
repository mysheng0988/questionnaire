let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    percent:100,
    data:"",
    problemData:"",
    questionNum: 0,
    questionLength: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let patientId = options.patientId;
    let medicalRecordId = options.medicalRecordId;
    this.setData({
      patientId,
      medicalRecordId
    })
    let data=options.id;
    app.request({
      url: "static/scale/scaleJson"+data+".json",
      method:"get",
      data:{}
    }).then(res=>{
      let questionLength = res.data.problem.length;
      let questionNum=this.data.questionNum;
      let percent = Math.ceil((questionNum + 1) / questionLength * 100)
      console.log(percent)
      if (percent > 100) {
        percent = 100;
      }
      this.setData({
        percent,
        data:res.data,
        problemData: res.data.problem[this.data.questionNum],
        questionLength,
      })
      console.log(res)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  handleSymptomChange(e){
    let index=e.currentTarget.dataset.index;
    let answer = e.detail.value;
    let data = this.data.data;
    let problemData = this.data.problemData;
    problemData.data[index].answer=answer;
    data.problem[this.data.questionNum] = problemData;
    this.setData({
      data: data,
      problemData,
    })
  },
  symptomData(e){
    let selectedData=e.detail.value;
    let problemData=this.data.problemData;
    problemData.data=[];
    for (let item of selectedData){
      let param={
        "question": item,
        "answers": [
          "无",
          "轻度",
          "中度",
          "重度",
          "极重"
        ],
        "answer": ""
      }
      problemData.data.push(param)
    }
    let data = this.data.data;
      data.problem[this.questionNum] = problemData
    this.setData({
      problemData: problemData,
      data,
    })
    console.log(e)
  },
  handleChange(e) {
    let answer=e.detail.value;
    let data=this.data.data;
    data.problem[this.data.questionNum].answer = answer;
    this.setData({
      data:data
    })
    setTimeout(() => {
      this.nextQuestion();
    }, 500)
  },
  prevQuestion() {
    if (this.data.questionNum <= 0) {
      app.toast("当前是第一题")
    } else {
      if (this.data.problemData.prevNum != 0) {
        let questionNum = this.data.problemData.prevNum;;
        let percent = Math.ceil((questionNum + 1) / this.data.questionLength * 100)
        if (percent > 100) {
          percent = 100;
        }
        this.setData({
          percent,
          questionNum: questionNum,
          problemData: this.data.data.problem[questionNum]
        })
      } else {
        // this.data.questionNum--;
        // this.data.problemData = this.data.problem[this.questionNum];
        let questionNum = this.data.questionNum-1;
        let percent=Math.ceil((questionNum+1)/this.data.questionLength*100)
        if(percent>100){
          percent=100;
        }
        this.setData({
          percent,
          questionNum: questionNum,
          problemData: this.data.data.problem[questionNum]
        })
      }

    }

  },
  nextQuestion() {
    if (this.data.questionNum < this.data.questionLength - 1) {
      if (this.data.problemData.data && this.data.problemData.data.length > 0) {
        for (let item of this.data.problemData.data) {
          if (item.answer === "") {
            app.toast("请选择答案");
            return
          }
        }
      }
      if (this.data.problemData.answer === "") {
        app.toast("请选择答案")
      } else {
        if (this.data.problemData.nextNum != 0 && this.data.problemData.answer === 0) {
          for (let x = this.data.questionNum + 1; x < this.data.problemData.nextNum; x++) {
            this.data.data.problem[x].answer = 0;
          }
          let questionNum = this.data.problemData.nextNum;
          let percent = Math.ceil((questionNum + 1) / this.data.questionLength * 100)
          if (percent > 100) {
            percent = 100;
          }
          this.setData({
            data:this.data.data,
            questionNum: questionNum,
            problemData: this.data.data.problem[questionNum]
          })
          
        } else {
          let questionNum = this.data.questionNum+1;
          let percent = Math.ceil((questionNum + 1) / this.data.questionLength * 100)
          if (percent > 100) {
            percent = 100;
          }
          this.setData({
            percent,
            questionNum: questionNum,
            problemData: this.data.data.problem[questionNum]
          })
        }
      }

    } else {
      app.toast("最后一题了")
    }
  },
  submitData() {
    if (this.data.problemData.answer === "") {
      this.app("请选择答案!")
      return;
    }
    let param = {
      questionnaireNo: this.data.data.id,
      medicalRecordId: this.data.medicalRecordId,
      patientId: this.data.patientId,
      questionResultList: [],
      resultContent: JSON.stringify(this.data.data),
    }
    for (let item of this.data.data.problem) {
      let qr = {}
      if (!item.symptom) {
        qr.optionOrder = item.answer;
        qr.optionValue = item.answers[item.answer];
        qr.order = item.questionNum;
      } else {
        let arr = [];
        let score = 0;
        for (let itemData of item.data) {
          arr.push(itemData.question)
          score = +itemData.answer;
        }
        qr.order = item.questionNum;
        qr.returnValue = arr.join(",");
        if (item.data.length > 0) {
          qr.optionOrder = Math.round(score / item.data.length);
        } else {
          qr.optionOrder = 0;
        }
      }
      param.questionResultList.push(qr);
    }
    app.request({
      url: "ips/questionnaire/submit",
      method: "post",
      data: param
    }).then(res => {
      if (res.code == 200) {
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