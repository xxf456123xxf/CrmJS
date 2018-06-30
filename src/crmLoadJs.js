// crm实体窗体加载js  加载的js可以在web资源  也可以是外部文件
// var main = window.masterWindow(); //获取主窗体
// var loadJs = function (url, id) {
//    $(`script#${id}`).length == 0 && window.loadScriptAdv(url, id);
// } //异步加载 如果存在id相同则不加载
//! function(){
// }
import role from './common/role'
role.init()
Date.prototype.Format = function (fmt) { // author: meizz
  var o = {
    'M+': this.getMonth() + 1,                 // 月份
    'd+': this.getDate(),                    // 日
    'h+': this.getHours(),                   // 小时
    'm+': this.getMinutes(),                 // 分
    's+': this.getSeconds(),                 // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds()             // 毫秒
  }
  var FMT = fmt
  if (/(y+)/.test(FMT)) {
    FMT = FMT.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(FMT)) {
      FMT = FMT.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return FMT
}
Date.prototype.addDays = function (days) {
  var date = new Date()
  var milliseconds = this.getTime() + days * 24 * 60 * 60 * 1000
  date.setTime(milliseconds)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
