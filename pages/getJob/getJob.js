var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPosition: true,
    imgUrls: [
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,  //是否显示面板指示点
    autoplay: true,      //是否自动切换
    interval: 3000,       //自动切换时间间隔
    duration: 1000,       //滑动动画时长
    inputShowed: false,
    inputVal: "",
    positionInfo:{},
    src:"https://huanxi-candy.oss-cn-qingdao.aliyuncs.com/image/head_img/df796c19-baf1-4c42-b55c-ea98ac256805.mp4"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   wx.showLoading({
     title: '正在加载数据',
   })
   var that=this;
    wxRequest.get(api.getPosition(options.id),function(e){
      wx.hideLoading();
      console.log(api.getImageSrc())
      e.msg.videoSrc = api.getImageSrc()+e.msg.videoSrc
      e.msg.time = util.formatTime(new Date(e.msg.time))
      that.setData({
        positionInfo:e.msg
      })
      console.log(that.data.positionInfo)
    });
  },
  positionTap: function (e) {
    this.setData({
      isPosition: true
    })
  },
  companyTap: function (e) {
    this.setData({
      isPosition: false
    })
  },
  doOrder:function(e){
    wx.showModal({
      title: '提示',
      content: '确定要接此职位？',
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

  }
})