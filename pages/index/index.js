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
    tip: ""
  },
  positionTap: function(e) {
    wx.navigateTo({
      url: `/pages/getJob/getJob?id=${e.currentTarget.id}`,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
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
    wxRequest.get(api.search(page, size, key), function(e) {
      if (e.status == 1) {
        if (isPull)
          wx.stopPullDownRefresh()
        total = e.msg.total
        for (var i = 0; i < e.msg.rows.length; i++) {
          e.msg.rows[i].time = util.formatTime(new Date(e.msg.rows[i].time))
        }
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