var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var util = require('../../utils/util.js')
var page=1
var size=10
var total=0
Page({
  data: {
    scrollTop: 0,
    scrollHeight: 0,
    hideHeader: true,
    refreshTime: '', // 刷新的时间 
    positions: [],
  },
  positionTap: function(e) {
    wx.navigateTo({
      url: `/pages/getJob/getJob?id=${e.currentTarget.id}`,
    })
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    page=1
    var that = this
      wxRequest.get(api.getPositions(page, size), function (e) {
      wx.stopPullDownRefresh()
        total = e.msg.total
        for (var i = 0; i < e.msg.rows.length; i++) {
          e.msg.rows[i].time = util.formatTime(new Date(e.msg.rows[i].time))
        }
        that.setData({
          positions: e.msg.rows
        })
      })
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    var that = this
    console.log(page)
    if(total%10==0&&page>=total/size) return
    if(page > total/size ) return
    page++
    wx.showLoading({
      title: '正在加载数据',
    }),
      wxRequest.get(api.getPositions(page, 10), function (e) {
        wx.hideLoading()
        for (var i = 0; i < e.msg.rows.length; i++) {
          e.msg.rows[i].time = util.formatTime(new Date(e.msg.rows[i].time))
        }
      var positions = that.data.positions.concat(e.msg.rows)
        that.setData({
          positions: positions
        })
      })
  },
  refresh:function(){
    var that=this
    wx.showLoading({
      title: '正在加载数据',
    }),
      wxRequest.get(api.getPositions(page, size), function (e) {
        wx.hideLoading()
        total=e.msg.total
        for (var i = 0; i < e.msg.rows.length; i++) {
          e.msg.rows[i].time = util.formatTime(new Date(e.msg.rows[i].time))
        }
        that.setData({
          positions: e.msg.rows
        })
      })
  },
  onLoad: function() {
    var that = this
    var date = new Date();
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight,
          refreshTime: date.toLocaleTimeString()
        })
      }
    });
   that.refresh();
  }
})