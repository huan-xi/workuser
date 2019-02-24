var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
var util = require('../../utils/util.js')
const { $Message } = require('../../component/base/index');
var page = 1
var size = 5
var total = 0
var key = ''
Page({
  data: {
    positions: [],
    isLoading: false,
    tip: "",
    notice: '',
    loop: false,
    images: [],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 5000, //自动切换时间间隔
    duration: 1000, //滑动动画时长
  },
  positionTap: function(e) {
      wx.navigateTo({
        url: `/pages/jobinfo/index?id=${e.currentTarget.id}`,
      })
  },
  getNotice() {
    wxRequest.get(api.getNotice, e => {
      if (e.status == 1) {
        var loop = false
        if (e.msg.length > 20)
          loop = true
        this.setData({
          notice: e.msg,
          loop,
        })
      }
    })
  },
  search(e){
    page = 1
    wx.showLoading({
      title: '正在搜索',
    })
    this.data.positions = []
    this.refresh()
  },
  searchInput(e){
   key=e.detail.value
  },
  prePic(e){
    let index = e.target.id
    let imageIndex = e.target.dataset.index
    let imgs = this.data.positions[index].images
    let img_src=[]
    for(let i=0;i<imgs.length;i++)
    {
      img_src.push(imgs[i].src)
    }
   wx.previewImage({
     urls: img_src,
     current:img_src[imageIndex]
   })
  },
  getBanners() {
    let that =this
    wxRequest.get(api.getBanners, function(e) {
      let images = []
      if (e.status == 1) {
        for (let i = 0; i < e.msg.length; i++) {
          images.push(JSON.parse(e.msg[i].s_value))
        }
        that.setData({
          images,
        })
      }
    })
  },
  onLoad: function() {
    this.getNotice()
    this.getBanners()
    page = 1
    this.data.positions = []
    this.refresh(true)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getNotice()
    this.getBanners()
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
    wxRequest.get(api.getJobs(page, size,key), function(e) {
      if (e.status == 1) {
        if (isPull)
          wx.stopPullDownRefresh()
          wx.hideLoading()
        total = e.msg.total
        if(page==1){
          $Message({
            content: '已找到'+total+'条工作信息',
          })
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
  confirm: function(e) {
    key = e.detail.value
    page = 1
    this.data.positions = []
    this.refresh()
  }
})