import config from 'config.js'
module.exports={
  //图片地址
  getImageSrc:function(){
    return config.getImageHost
  },
  //获取公司信息
  getVenderInfo: function(e){
    return config.getDomain + `/public/getVenderInfo?id=${e}`
  },
  //接单
  orderPosition: config.getDomain + "/user/orderPosition",
  //修改信息
  editInfo: config.getDomain + "/user/editInfo",
  getInfo: config.getDomain +"/user/getInfo",
  //上传图片
  uploadIdCard: config.getDomain + "/user/uploadIdCard",
  //取消订单
  cancelOrder: function(id){
    return config.getDomain + `/user/cancelOrder?orderId=${id}`
  },
  //删除订单
  deleteOrder: function (id) {
    return config.getDomain + `/user/deleteOrder?orderId=${id}`
  },
  //完成订单
  finishOrder: function (id) {
    return config.getDomain + `/user/finishOrder?orderId=${id}`
  },
  //获取用户所有订单
  getOrders:function(page,size){
    return config.getDomain+ `/user/getOrders?page=${page}&size=${size}`
  },
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
  //搜索
  search: function (page, size,key) {
    return config.getDomain + `/public/search?page=${page}&size=${size}&key=${key}`
  },
  //提交反馈信息
  feedback: config.getDomain + "/public/feedback",
  //获取客服信息
  getServiceInfo: config.getDomain + "/public/getServiceInfo",
  //get notice
  getNotice: config.getDomain + "/public/getUserNotice"
}