//index.js
//获取应用实例
var MD5 = require('../../utils/md5.js');
const app = getApp()
var langFrom = ['en', 'zh', 'fra', 'ara', 'est', 'bul', 'pl', 'dan', 'de', 'ru', 'fra', 'fin', 'kor', 'nl', 'cs', 'rom', 'pt', 'slo', 'th', 'wyw', 'spa', 'el', 'hu', 'it', 'yue', 'cht', 'vie'];

var langTo = ['en', 'zh', 'fra', 'ara', 'est', 'bul', 'pl', 'dan', 'de', 'ru', 'fra', 'fin', 'kor', 'nl', 'cs', 'rom', 'pt', 'slo', 'th', 'wyw', 'spa', 'el', 'hu', 'it', 'yue', 'cht', 'vie'];

const appid = '20180711000184633';
const key = 'bMqUxINCxcoIU6cU_ZJF';

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    arrayFrom: ['英语', '中文', '法语', '阿拉伯语', '爱沙尼亚语', '保加利亚语', '波兰语', '丹麦语', '德语', '俄语', '法语', '芬兰语', '韩语', '荷兰语', '捷克语', '罗马尼亚语', '葡萄牙语', '斯洛文尼亚语',
      '泰语', '文言文', '西班牙语', '希腊语', '匈牙利语', '意大利语', '粤语', '中文繁体', '越南语'],
    arrayTo: ['英语', '中文', '法语', '阿拉伯语', '爱沙尼亚语', '保加利亚语', '波兰语', '丹麦语', '德语', '俄语', '法语', '芬兰语', '韩语', '荷兰语', '捷克语', '罗马尼亚语', '葡萄牙语', '斯洛文尼亚语',
      '泰语', '文言文', '西班牙语', '希腊语', '匈牙利语', '意大利语', '粤语', '中文繁体', '越南语'],
    indexFrom: 1,
    indexTo: 0,
    size: 0,
    words: "中文",
    wordsTotranslate: "",
    wordFrom: "zh",
    wordTo: "en",
    DisplayResult: "none",
    DisplayButton: "block",
    DisplayAudio: "none",
    src: ""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  myTest: function(e){
    console.log("show testclean");
    this.setData({
      size: 23,
      wordsTotranslate: e.detail.value,
      DisplayResult: "none",
      DisplayButton: "block",
      DisplayAudio: "none"

    })
  },

  changefrom: function (e) {
    console.log(langFrom[e.detail.value]);
    var v = MD5.md5("AAAAAAAAAAAAAAAAA");
    console.log('v=====' + v);
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexFrom: e.detail.value,
      wordFrom: langFrom[e.detail.value]
    })
  },


  changeto: function (e) {
    console.log(langTo[e.detail.value]);
    this.setData({
      indexTo: e.detail.value,
      wordTo: langTo[e.detail.value]
    })
    if (this.data.wordsTotranslate != "") {
      var target = "";
      console.log(this.data.wordFrom);
      console.log(this.data.wordTo);
      console.log(this.data.wordsTotranslate);

      if (this.data.wordFrom != this.data.wordTo && this.data.wordsTotranslate != "") {
        this.setData({
          loading: true
        })
        console.log("send");
        var salt = (new Date).getTime();
        var str1 = appid + this.data.wordsTotranslate + salt + key;
        var sign = MD5.md5(str1);
        wx.request({
          url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
          data: {
            q: this.data.wordsTotranslate,
            From: this.data.wordFrom,
            To: this.data.wordTo,
            appid: appid,
            salt: salt,
            sign: sign
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data);
            target = res.data;

          }
        })
        setTimeout(() => (function (str, that) {
          //console.log("lala")
          if (str != "") {
            // console.log("yes");
            that.setData({
              loading: false,
              DisplayResult: "block",
              DisplayButton: "none",
              resultRords: str,
              src: "http://tts.baidu.com/text2audio?lan=" + that.data.wordTo + "&ie=UTF-8&text=" + str
            })
            if (that.data.wordTo == "zh" || that.data.wordTo == "en") {
              that.setData({
                DisplayAudio: "block"
              })
            }
            else {
              that.setData({
                DisplayAudio: "none"
              })
            }
          }
        })(target, this), 1000)
      }
    }
  },
  showClear: function (e) {
    console.log("show testclean");
    this.setData({
      size: 23,
      wordsTotranslate: e.detail.value,
      DisplayResult: "none",
      DisplayButton: "block",
      DisplayAudio: "none"

    })
  },
  clearWords: function () {
    console.log("clean");
    this.setData({
      words: "",
      wordsTotranslate: "",
      size: 0,
      DisplayResult: "none",
      DisplayButton: "block",
      DisplayAudio: "none",
      loading: false
    })
  },
  send: function (e) {

    var target = "";
    console.log(this.data.wordFrom);
    console.log(this.data.wordTo);
    console.log(this.data.wordsTotranslate);

    if (this.data.wordFrom != this.data.wordTo && this.data.wordsTotranslate != "") {
      this.setData({
        loading: true
      })
      console.log("send");
      var salt = (new Date).getTime();
      var str1 = appid + this.data.wordsTotranslate + salt + key;
      var sign = MD5.md5(str1);
      wx.request({
        url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
        data: {
          q: this.data.wordsTotranslate,
          From: this.data.wordFrom,
          To: this.data.wordTo,
          appid: appid,
          salt: salt,
          sign: sign
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data);
          target = res.data;

        }
      })
      setTimeout(() => (function (str, that) {
        //console.log("lala")
        if (str != "") {
          // console.log("yes");
          that.setData({
            loading: false,
            DisplayResult: "block",
            DisplayButton: "none",
            resultRords: str,
            src: "http://tts.baidu.com/text2audio?lan=" + that.data.wordTo + "&ie=UTF-8&text=" + str
          })
          if (that.data.wordTo == "zh" || that.data.wordTo == "en") {
            that.setData({
              DisplayAudio: "block"
            })
          }
          else {
            that.setData({
              DisplayAudio: "none"
            })
          }
        }
      })(target, this), 1000)
    }

  },
  onShareAppMessage: function () {
    return {
      title: '意语词典',
      desc: '打开微信轻松翻译',
      path: '/pages/index/index'
    }
  },
})
