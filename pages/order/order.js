// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  callTap:function(){
    wx.makePhoneCall({
      phoneNumber: '17680504804',
      success:e=>{
        
      },
      fail:e=>{
        wx.showModal({
          title: '提示',
          content: `拨打电话失败请手动拨打`,
        })
      }
    })
  },
  cancelTap:function(e){
    wx.showModal({
      title: '提示',
      content: '每天只能取消一次订单，您确定要取消吗',
      success:e =>{
        if(e.confirm){
          console.log("取消")
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