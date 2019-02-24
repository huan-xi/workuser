import config from 'config.js'
module.exports={
  //修改信息
  editInfo: config.getDomain + "/user/info",
  getInfo: config.getDomain +"/user/info",
  //登入地址
  login: config.getDomain + "/token/user",
  //获取job详细信息
  getJobInfo:function(id){
    return config.getDomain+ `/job/${id}`
  },
  //获取全部工种
  getTypes: config.getDomain + "/values/TYPES",
  //获取banner
  getBanners:config.getDomain + "/values/BANNER",

  getJobs: function (page, size,key) {
    return config.getDomain + `/jobs/?page=${page}&size=${size}&key=${key}`
  },
  //获取客服信息
  getPhone: config.getDomain + "/value/KF_PHONE",
  //get notice
  getNotice: config.getDomain + "/value/NOTICE_USER",
  //点赞
  goodJob(id){
    return config.getDomain + `/user/good/${id}`
  }
}