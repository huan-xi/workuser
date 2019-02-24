var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var util = require('../../utils/util.js')
let job_id;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    job: {},
  },
  call: function(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.job.shop.phone,
    })
  },
  prePic:function(e){
    let index = e.target.id
    let images = this.data.job.images
    let img_src = []
    for (let i = 0; i < images.length; i++) {
      img_src.push(images[i].src)
    }
    wx.previewImage({
      urls: img_src,
      current: img_src[index]
    })
  },
  toThere: function(e) {
    let address = this.data.job.shop.address
    wx.openLocation({
      latitude: address.latitude,
      longitude: address.longitude,
      address: address.address_desc
    })
  },
  goodJob(){
    wxRequest.get(api.goodJob(job_id),e=>{
      wx.showModal({
        title: '提示',
        content: e.msg,
        showCancel:false
      })
    });
  },
  share: function() {
    wx.showShareMenu({
      fail:function(res){
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    job_id = options.id
    this.refresh()
  },
  refresh(hiddle) {
    wx.showLoading({
      title: '正在加载数据',
    })
    var that = this;
    wx.hideLoading();
    wxRequest.get(api.getJobInfo(job_id), function(e) {
      wx.hideLoading();
      if (hiddle) wx.stopPullDownRefresh()
      if (e.status == 1) {
        that.setData({
          job: e.msg
        })
      } else {
        //获取错误
      }
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.refresh(true)
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: this.data.job.job_desc,
      path: '/pages/jobinfo/index?id=' + job_id
    }
  },
})