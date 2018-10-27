var api = require('../../utils/api.js');
var wxRequest = require('../../utils/wxRequest.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    types: [],
    imageSrc: '/images/idCard.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    wx.getStorage({
      key: 'user',
      success: function(res) {
        that.setData({
          user: res.data
        })
        that.showTypes(res.data.type)
      },
    })
  },
  showTypes: function(userType) {
      var that = this
      wxRequest.get(api.getTypes, e => {
        if (e.status == 1) {
          var typesD = e.msg
          var types = []
          var state = 0;
          //分割数组
          if (userType && userType.length>0)
          userType= userType.split("|")
          for (var i = 0; i < typesD.length; i++) {
            state=0
            if(userType)
              for(var j=0;j<userType.length;j++){
                //判断i是否在user中
                if (userType[j] == typesD[i].sValue)
                  state=1
              }
            types.push({
              typeId: typesD[i].systemId,
              state: state,
              typeName: typesD[i].sValue
            })
          }
          that.setData({
            types: types
          })
        }
      });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  typeTap: function(e) {
    var id = e.target.dataset.id
    var types = this.data.types
    for (var i = 0; i < types.length; i++) {
      if (id == types[i].typeId) {
        if (types[i].state == 1)
          types[i].state = 0
        else
          types[i].state = 1
        break
      }
    }
    this.setData({
      types: types
    })
  },
  //双向绑定
  nameInputChange: function (e) {
    var user = this.data.user
    user.name = e.detail.detail.value
    this.setData({
      user
    })
  },
  phoneInputChange: function (e) {
    var user = this.data.user
    user.phone = e.detail.detail.value
    this.setData({
      user
    })
  },
  submit: function(val) {
    if (val.name.length < 1) {
      wx.showModal({
        title: '提示',
        content: '请认真填写真实姓名',
        showCancel: false
      })
      return
    }
    if(val.phone.length!=11){
      wx.showModal({
        title: '提示',
        content: '请输入正确手机号',
        showCancel:false
      })
      return
    }
    
    wx.showLoading({
      title: '正在修改数据',
    })
    var types =[]
    for(var i=0;i<this.data.types.length;i++){
      if (this.data.types[i].state==1)
        types.push(this.data.types[i].typeName)
    }
    types=types.join("|")
    console.log(types)
    wxRequest.post(api.editInfo,{
      phone:val.phone,
      types:types,
      name:val.name
    },e =>{
      wx.hideLoading();
      if(e.status==1){
        wx.showToast({
          title: '修改成功',
        })
        wx.setStorageSync("isChange", true)
        wx.switchTab({
          url: '/pages/user/user',
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '修改信息失败',
          showCancel:false
        })
      }
    });
  },
  imageTap:function(){
    var that=this
    wx.chooseImage({
      success: function(res) {
        that.setData({
          imageSrc: res.tempFilePaths
        })
      },
    })
  },
  formSubmit: function(e) {
    var val = this.data.user
    var that=this
    var imagesrc = this.data.imageSrc[0]
    if(imagesrc.search("//tmp")!=-1){
      wx.showLoading({
        title: '正在上传身份证',
      })
      wxRequest.uploadFile(api.uploadIdCard, imagesrc,'idCard',e=>{
        wx.hideLoading()
         if(e.status==1){
           that.submit(val)
         }else{
           wx.showModal({
             title: '提示',
             content: '上传图片失败',
             showCancel:false
           })
         }
      });
      return;
    }
    that.submit(val);
  }
})