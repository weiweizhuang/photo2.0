const {
  severRequest
} = require("../../api/index");
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    severRequest("getAboutDeveloper", {
      key: "wxApp"
    }).then(res => {
      this.setData({
        content: res.data.content,
        title: res.data.title
      })
      let content = res.data.content;
      WxParse.wxParse('content', 'html', content, this, 5);
    })
  },
})