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
      success:e=>{
        console.log(e)
      }
    })
  },
  refresh:function(){
    wx.showLoading({
      title: '正在获取信息',
    })
    wxRequest.get(api.getInfo, e => {
      wx.hideLoading()
      if(e.status==1){
        var user = e.msg
        console.log(user)
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