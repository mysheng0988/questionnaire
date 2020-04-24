let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    percent: 100,
    data: "",
    problemData: "",
    questionNum: 0,
    questionLength: 0,
    num: 0,
    roleType:0,
    minusStatus: 'disable'
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
    let data = options.id;
    app.request({
      url: "static/scale/scale" + data + ".json",
      method: "get",
      data: {}
    }).then(res => {
      let questionLength = res.data.problem.length;
      let questionNum = this.data.questionNum;
      let percent = Math.ceil((questionNum + 1) / questionLength * 100)
      console.log(percent)
      if (percent > 100) {
        percent = 100;
      }
      this.setData({
        percent,
        data: res.data,
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
  roleTypeChange(e){
    let problemData = this.data.problemData.answer = [500, 500]
    let data = this.data.data;
    data.problem[this.data.questionNum] = problemData;
    this.setData({
      roleType: e.detail.value,
      data,
    })
   
  },
  handleSymptomChange(e) {
    let index = e.currentTarget.dataset.index;
    let answer = e.detail.value;
    let data = this.data.data;
    let problemData = this.data.problemData;
    problemData.data[index].answer = answer;
    data.problem[this.data.questionNum] = problemData;
    this.setData({
      data: data,
      problemData,
    })
  },
  symptomData(e) {
    let selectedData = e.detail.value;
    let problemData = this.data.problemData;
    for (let item of problemData.symptom){
      for (let select of selectedData){
        if (item.question == select){
          item.checked = true;
        }
      }
    }
    problemData.data = [];
    for (let item of selectedData) {
      let param = {
        "question": item,
        "answers": [
          "没有：不存在",
          "轻度：偶有几天存在或尚能忍受",
          "中度：一半天数存在或希望缓解",
          "重度：几乎每天存在或较难忍受",
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
  },
  handleChange(e) {
    let answer = e.detail.value;
    let data = this.data.data;
    data.problem[this.data.questionNum].answer = answer;
    this.setData({
      data: data
    })
    setTimeout(() => {
      this.nextQuestion();
    }, 500)
  },
  handleChangeFather(e){
    let answer = e.detail.value;
    let data = this.data.data;
    data.problem[this.data.questionNum].answer[0] = answer;
    this.setData({
      data: data
    })
  },
  handleChangeMother(e) {
    let answer = e.detail.value;
    let data = this.data.data;
    data.problem[this.data.questionNum].answer[1] = answer;
    this.setData({
      data: data
    })
  },
  prevQuestion() {
    if (this.data.questionNum <= 0) {
      app.toast("当前是第一题")
    } else {
      let questionNum = this.data.questionNum - 1;
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

  },
  nextQuestion() {
    if (this.data.questionNum < this.data.questionLength - 1) {
      if (this.data.problemData.data && this.data.problemData.data.length > 0) {
        for (let item of this.data.problemData.data) {
          if (item.answer === "" && !item.type) {
            app.toast("请选择答案");
            return
          } else {
            if (this.data.problemData.data[0].answer < 0) {
              app.toast("请选择发生次数,没有选0");
              return
            } else if (item.answer === "" && item.type && item.type != '2' && this.data.problemData.data[0].answer > 0) {
              console.log(item.type)
              console.log(item.answer)
              app.toast("请选择答案");
              return
            }
          }
        }
      }
      if (this.data.data.type == 4 && this.data.roleType == 0) {
        if (this.data.problemData.answer.includes(500)) {
          app.toast("请选择答案");
          return
        }
      } else if (this.data.data.type == 4 && this.data.roleType == 1) {
        if (this.data.problemData.answer[0] == 500) {
          app.toast("请选择答案");
          return
        }
      } else if (this.data.data.type == 4 && this.data.roleType == 2) {
        if (this.data.problemData.answer[1] == 500) {
          app.toast("请选择答案");
          return
        }
      } else if(this.data.problemData.answer === "" && this.data.data.type == 1){
        app.toast("请选择答案")
        return
      }
        let questionNum = this.data.questionNum + 1;
        let percent = Math.ceil((questionNum + 1) / this.data.questionLength * 100)
        if (percent > 100) {
          percent = 100;
        }
        this.setData({
          selectedData:[],
          percent,
          questionNum: questionNum,
          problemData: this.data.data.problem[questionNum]
        })
     
      

    } else {
      app.toast("最后一题了")
    }
  },
  bindremark(e){
    var answer = e.detail.value;
    let problemData= this.data.problemData;
    problemData.data[4].answer=answer;
    let data=this.data.data;
    data.problem[this.questionNum] = problemData;
    console.log(problemData)
    this.setData({
      problemData,
      data,
    })
  },
  /*点击减号*/
  bindMinus: function () {
    var num = this.data.num;
    if (num > 0) {
      num--;
    }
    var minusStatus = num > 0 ? 'normal' : 'disable';
    let problemData = this.data.problemData;
    problemData.data[0].answer = num
    let data = this.data.data;
    data.problem[this.questionNum] = problemData;
    this.setData({
      num: num,
      problemData,
      data,
      minusStatus: minusStatus
    })
  },
  /*点击加号*/
  bindPlus: function () {
    var num = this.data.num;
    num++;
    var minusStatus = num > 0 ? 'normal' : 'disable';
    let problemData=  this.data.problemData;
    problemData.data[0].answer = num;
    let data = this.data.data;
    data.problem[this.questionNum] = problemData;
    this.setData({
      num: num,
      data,
      problemData,
      minusStatus: minusStatus
    })
  },
  /*输入框事件*/
  bindManual: function (e) {
    var num = e.detail.value;
    var minusStatus = num > 0 ? 'normal' : 'disable';
    let problemData = this.data.problemData;
    problemData.data[0].answer = num
    let data = this.data.data;
    data.problem[this.questionNum] = problemData;
    this.setData({
      num: num,
      problemData,
      data,
      minusStatus: minusStatus
    })
  },
  submitData() {
    if (this.data.data.type == 1 && this.data.problemData.answer === "") {
      app.toast("请选择答案!")
      return;
    }
    let param = {
      scaleId: this.data.data.id,
      scaleNo: this.data.data.id,
      medicalRecordId: this.data.medicalRecordId,
      patientId: this.data.patientId,
      questionResultList: [],
      resultContent: JSON.stringify(this.data),
    }
    for (let item of this.data.data.problem) {
      let qr = {
        optionOrderList: [],
        optionValue: [],
        returnValue: [],
        remark: "",
        order: "",
      }
      if (this.data.data.type == 1) {
        qr.optionOrderList.push(item.answer);
        qr.optionValue.push(item.answers[item.answer]);
        qr.returnValue.push(item.question);
        qr.order = item.questionNum;
      } else if (this.data.data.type == 3) {
        if (item.data.length != 0) {
          for (let itemData of item.data) {
            qr.optionOrderList.push(itemData.answer);
            qr.optionValue.push(itemData.answers[item.answer]);
            qr.returnValue.push(itemData.question);
            qr.order = item.questionNum;
          }
        } else {
          qr.optionOrderList.push(0);
          qr.optionValue.push("无");
          qr.returnValue.push("");
          qr.order = item.questionNum;
        }

      } else if (this.data.data.type == 4) {
        qr.optionOrderList.push(item.answer[0]);
        qr.optionOrderList.push(item.answer[1]);
        qr.optionValue.push(item.answers[item.answer[0]]);
        qr.optionValue.push(item.answers[item.answer[1]]);
        qr.returnValue.push(item.question);
        qr.order = item.questionNum;

      } else {
        for (let itemData of item.data) {
          if (itemData.type != "2") {
            let answer = itemData.answer == "" ? 0 : itemData.answer;
            qr.optionOrderList.push(answer);
          } else {
            qr.remark = itemData.answer;
          }
          qr.returnValue.push(item.question);
          qr.order = item.questionNum;
        }
      }
      param.questionResultList.push(qr);
    }
     
    app.request({
      url: "ips/scale/submit",
      method: "post",
      data: param
    }).then(res => {
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