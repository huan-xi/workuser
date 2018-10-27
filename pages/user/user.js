var auth = require('../../utils/auth.js');
var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    types:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (getApp().globalData.token){
      this.refresh()
    }
  },
  tosaveTap: function(e) {
    wx.navigateTo({
      url: '/pages/editUser/editUser',
    })
  },
  retryTap:function(e){
    this.refresh()
  },
  refresh:function(isPull=false){
    if(!isPull)
    wx.showLoading({
      title: '正在获取信息',
    })
    wxRequest.get(api.getInfo, e => {
      if(isPull)
      wx.stopPullDownRefresh()
      wx.hideLoading()
      if(e.status==1){
        var user = e.msg
        var types = []
        if (user.type&&user.type.length > 0)
          types = types.concat(user.type.split('|'))
        if (user.valid == "2") {
          user.valid = '已通过认证'
        } else if (user.valid == "1") {
          user.valid = '待验证'
        } else {
          user.valid = '未上传'
        }
        wx.setStorageSync('user', user);
        this.setData({
          user: user,
          types: types
        })
      }else{
        //获取失败
        wx.showModal({
          title: '警告',
          content: '获取数据失败，请重新登入再试',
          showCancel:false
        })
        wx.setStorageSync("Token", "")
        getApp().globalData.token=''
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
  logout: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要退出吗？',
      success: e => {
        if (e.confirm)
          that.exit()
      }
    })
  },
  toEdit: function (e) {
    wx.navigateTo({
      url: '/pages/editUser/editUser',
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
  
})