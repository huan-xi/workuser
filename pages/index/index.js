var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var util = require('../../utils/util.js')
var page = 1
var size = 5
var total = 0
var key = ''
Page({
  data: {
    positions: [],
    isLoading: false,
    tip: "",
    notice: '',
    loop: false,
    imgUrls: ['https://oss.shebuluo.cn/ben4rkq10ah.jpg', 'https://oss.shebuluo.cn/st93.png', 'https://oss.shebuluo.cn/ben4rkq10ah.jpg'],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 5000, //自动切换时间间隔
    duration: 1000, //滑动动画时长
  },
  positionTap: function(e) {
    wx.navigateTo({
      url: `/pages/getJob/getJob?id=${e.currentTarget.id}`,
    })
  },
  getNitice(){
    wxRequest.get(api.getNotice, e => {
      if (e.status == 1) {
        var loop = false
        if (e.msg.length > 20)
          loop = true
        this.setData({
          notice: e.msg,
          loop,
        })
      }
    })
  },
  onLoad: function() {
    this.getNitice()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getNitice()
    page = 1
    this.data.positions = []
    this.refresh(true)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    this.setData({
      tip: '正在加载',
      isLoading: true
    })
    if ((total % 10 == 0 && page >= total / size) || (page > total / size)) {
      that.setData({
        tip: '没有更多数据了',
        isLoading: false
      })
      return
    }
    page++
    this.refresh()
  },
  refresh: function(isPull) {
    var that = this
    wxRequest.get(api.getJobs(page, size), function(e) {
      if (e.status == 1) {
        if (isPull)
          wx.stopPullDownRefresh()
        total = e.msg.total
        var positions = that.data.positions.concat(e.msg.rows)
        that.setData({
          tip: '没有更多数据了',
          isLoading: false,
          positions: positions
        })
      } else {
        wx.showModal({
          title: '提示',
          content: e.msg,
          showCancel: false
        })
      }
    })
  },
  onShow: function() {
    page = 1
    this.data.positions = []
    this.refresh(true)
  },
  confirm: function(e) {
    key = e.detail.value
    page = 1
    this.data.positions = []
    this.refresh()
  }
})