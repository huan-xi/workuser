var auth = require('../../utils/auth.js');
var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    types:[],
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      this.refresh()
  },
  refresh:function(hiddle=false){
    if(!hiddle)
    wx.showLoading({
      title: '正在获取信息',
    })
    wxRequest.get(api.getInfo, e => {
      if(hiddle)
      wx.stopPullDownRefresh()
      wx.hideLoading()
      if(e.status==1){
        var user = e.msg
        var info = []
        if (user.info && user.info.length > 0)
          info = info.concat(user.info.split('|'))
        wx.setStorageSync('user', user);
        this.setData({
          user: user,
          types: info
        })
      }else{
      /*  //获取失败
        wx.showModal({
          title: '警告',
          content: '获取数据失败，请重新登入再试',
          showCancel:false
        })
        wx.setStorageSync("Token", "")
        getApp().globalData.token=''*/
      }
    })
  },
  call(){
    wxRequest.get(api.getPhone,res=>{
      if(res.status==1){
        wx.makePhoneCall({
          phoneNumber: res.msg,
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '没有客服信息',
          showCancel:false
        })
      }
    })
  },
  clear: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '清除缓存将会退出登入，确定要清除吗？',
      success: e => {
        if (e.confirm)
          that.exit()
      }
    })
  },
  exit: function (e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
    getApp().globalData.token = ''
    wx.clearStorageSync()
  },
  toEdit: function (e) {
    wx.navigateTo({
      url: '/pages/update/index',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refresh(true)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that=this;
    auth.isLogin(() => {
        that.refresh()
    });
    //刷新数据(是否更新)    
    wx.getStorage({
      key: 'isChange',
      success: function(res) {
        if(res.data){
          wx.setStorageSync('isChange', false)
          //刷新数据
          that.refresh()
        }
      },
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: "同城找工作小程序",
      path: '/pages/index/index'
    }
  },
})