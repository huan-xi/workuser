var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var util = require('../../utils/util.js')
var page=1
var size=5
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[]
  },
  refresh:function(){
    var that=this
    wx.showLoading({
      title: '正在获取数据',
    })
    wxRequest.get(api.getOrders(page, size), e => {
      wx.hideLoading()
      if(e.status==1){
        var orders = e.msg.rows
        //返回状态信息状态过滤
        for(var i=0;i<orders.length;i++){
          if(orders[i].status==1){
            orders[i].notFinish=true
            orders[i].status = '接单成功，请赶快前往工厂'
          }
          else if (orders[i].status==4)
            {
            orders[i].cancel=true  
            orders[i].status = '已取消'
            }
          else if (orders[i].status==3)
            {
            orders[i].notCom = true
            orders[i].status = '已完成'
            }
        }
        //放回信息时间过滤
        for(var i=0;i<orders.length;i++){
          orders[i].workTime = util.formatTime(new Date(orders[i].workTime))
        }
        that.setData({
          orders:orders
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '提交异常',
          showCancel:false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.refresh()
  },
  callTap:function(){
    wx.makePhoneCall({
      phoneNumber: '17680504804',
      success:e=>{
        
      },
      fail:e=>{
        
      }
    })
  },
  cancelTap:function(e){
    var id=e.target.id
    var that =this
    wx.showModal({
      title: '提示',
      content: '每天只能取消一次订单，您确定要取消吗',
      success:e =>{
        
        if(e.confirm){
          wx.showLoading({
            title: '正在取消订单',
          })
          wxRequest.get(api.cancelOrder(id),e=>{
            wx.hideLoading()
            if(e.status==1){
              wx.showToast({
                title: '取消成功',
              })
              that.refresh()
            }else{
              if(e.msg)
              wx.showModal({
                title: '提示',
                content: e.msg,
                showCancel:false
              })
              else{
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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