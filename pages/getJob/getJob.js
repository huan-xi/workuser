var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isOrder: false,
    isPosition: true,
    inputShowed: false,
    inputVal: "",
    positionInfo: {},
    vender: {
      address: "正在加载...",
      addressDesc: "正在加载..."
    }
  },
  toThere: function(e) {
    var vender = this.data.vender
    wx.openLocation({
      latitude: vender.latitude,
      longitude: vender.longitude,
      address: vender.addressDesc
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.isOrder && options.isOrder == 1) {
      var isOrder = true
      this.setData({
        isOrder:isOrder
      })
    }
    wx.showLoading({
      title: '正在加载数据',
    })
    var that = this;
    wxRequest.get(api.getPosition(options.id), function(e) {
      wx.hideLoading();
      if (e.msg.videoSrc)
        e.msg.videoSrc = api.getImageSrc() + e.msg.videoSrc
      e.msg.time = util.formatTime(new Date(e.msg.time))
      that.setData({
        positionInfo: e.msg
      })
      var id = e.msg.venderId;
      wxRequest.get(api.getVenderInfo(id), e => {
        that.setData({
          vender: e.msg
        })
      });
    });
  },

  doOrder: function(e) {
    var id = e.target.id
    console.log(id)
    wx.showModal({
      title: '提示',
      content: '确定要接此职位？',
      success: e => {

        if (e.confirm) {
          wx.showLoading({
            title: '正在添加订单',
          })
          wxRequest.post(api.orderPosition, {
            id
          }, e => {
            wx.hideLoading()
            if (e.status == 1) {
              wx.showModal({
                title: '提示',
                content: '接单成功',
                confirmText: '查看订单',
                success: e => {
                  if (e.confirm)
                    wx.switchTab({
                      url: '/pages/order/order',
                    })
                }
              })
            } else if (e.status == 3) {
              wx.showModal({
                title: '提示',
                content: e.msg,
                confirmText: '去填写',
                success: e => {
                  if (e.confirm) {
                    wx.switchTab({
                      url: '/pages/user/user',
                    })
                  }
                }
              })
            } else {
              if (e.msg) {
                wx.showModal({
                  title: '提示',
                  content: e.msg,
                  showCancel: false
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})