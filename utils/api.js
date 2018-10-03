import config from 'config.js'
module.exports={
  //图片地址
  getImageSrc:function(){
    return config.getImageHost
  },
  //修改信息
  editInfo: config.getDomain + "/user/editInfo",
  getInfo: config.getDomain +"/user/getInfo",
  //上传图片
  uploadIdCard: config.getDomain + "/user/uploadIdCard",
  //登入地址
  login: config.getDomain + "/login",
  //获取全部职位信息
  getPositions:function(page,size){
    return config.getDomain+ `/public/getPositions?page=${page}&size=${size}`
  },
  //获取全部工种
  getTypes: config.getDomain + "/public/getTypes",
  //获取全部职位详细信息
  getPosition: function (id) {
    return config.getDomain + `/public/getPosition?id=${id}`
  },

}