var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var util = require('../../utils/util.js')
var page = 1
var size = 5
var total = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    isLoading: false,
    tip: ""
  },
  refresh: function(isPull) {
    var that = this
    wxRequest.get(api.getOrders(page, size), e => {
      if (isPull)
        wx.stopPullDownRefresh()
      if (e.status == 1) {
        var orders = e.msg.rows
        total = e.msg.total
        //返回状态信息状态过滤
        for (var i = 0; i < orders.length; i++) {
          switch (orders[i].pOrder.status) {
            case '1':
              orders[i].notFinish = true
              orders[i].pOrder.status = '接单成功，请赶快前往工厂'
              break
            case '4':
              orders[i].cancel = true
              orders[i].pOrder.status = '您已取消'
              break
            case '3':
              orders[i].notCom = true
              orders[i].pOrder.status = '已完成'
              break
            case '6':
              orders[i].notCom = true
              orders[i].pOrder.status = '已结束'
              break
            case '8':
              orders[i].pOrder.status = '工厂已取消'
              break
          }
        }
        //放回信息时间过滤
        for (var i = 0; i < orders.length; i++) {
          orders[i].position.time = util.formatTime(new Date(orders[i].position.time))
        }
        orders = that.data.orders.concat(orders)
        that.setData({
          tip: '没有更多数据了',
          isLoading: false,
          orders: orders
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onPullDownRefresh: function() {
    page = 1
    this.data.orders = []
    this.refresh(true)
  },
  orderTap: function(e) {
    wx.navigateTo({
      url: `/pages/getJob/getJob?id=${e.currentTarget.id}&&isOrder=1`,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    page = 1
    this.data.orders = []
    this.refresh()
  },
  callTap: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.id
    })
  },
  cancelTap: function(e) {
    var id = e.target.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '每天只能取消一次订单，您确定要取消吗',
      success: e => {

        if (e.confirm) {
          wx.showLoading({
            title: '正在取消订单',
          })
          wxRequest.get(api.cancelOrder(id), e => {
            wx.hideLoading()
            if (e.status == 1) {
              wx.showToast({
                title: '取消成功',
              })
              page = 1
              this.data.orders = []
              that.refresh()
            } else {
              if (e.msg)
                wx.showModal({
                  title: '提示',
                  content: e.msg,
                  showCancel: false
                })
              else {
                wx.showModal({
                  title: '提示',
                  content: '提交异常',
                })
              }
            }
          })
        }
      }
    })
  },
  deleteTap: function(e) {
    var id = e.target.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '删除订单后将不会再显示，确定删除吗',
      success: e => {
        if (e.confirm) {
          wx.showLoading({
            title: '正在删除订单',
          })
          wxRequest.get(api.deleteOrder(id), e => {
            wx.hideLoading()
            if (e.status == 1) {
              wx.showToast({
                title: '删除成功',
              })
              page = 1
              this.data.orders = []
              that.refresh()
            } else {
              if (e.msg)
                wx.showModal({
                  title: '提示',
                  content: e.msg,
                  showCancel: false
                })
              else {
                wx.showModal({
                  title: '提示',
                  content: '提交异常',
                })
              }
            }
          })
        }
      }
    })
  },
  finishTap: function(e) {
    var id = e.target.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定此订单已完成吗',
      success: e => {
        if (e.confirm) {
          //提交完成请求
          wx.showLoading({
            title: '正在提交请求',
          })
          wxRequest.get(api.finishOrder(id), e => {
            wx.hideLoading()
            if (e.status == 1) {
              wx.showToast({
                title: '订单已完成',
              })
              page = 1
              this.data.orders = []
              that.refresh()
            } else {
              if (e.msg)
                wx.showModal({
                  title: '提示',
                  content: e.msg,
                  showCancel: false
                })
              else {
                wx.showModal({
                  title: '提示',
                  content: '提交异常',
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    if (total % size == 0 && page >= total / size) return
    if (page > total / size) return
    page++
    this.refresh()
  },
})