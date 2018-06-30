// import 'layer'
import $ from 'jQuery'
import { winTop } from './winTop'
const layer = winTop.layer
const winDialog = {
  msg: function (msg) {
    window['alert'](msg)
  },
  alert: function (msg) {
    window['alert'](msg)
         // layer.alert(msg, { title: false, closeBtn: false, shadeClose: 1 })
  },
  load: function () {
         // commons.layer.load(2);
  },
  loadClose: function () {
         // commons.layer.closeAll('loading');
  },
  confirm: function (msg) {
    window['confirm'](msg)
         // var def = $.Deferred();
         // commons.layer.confirm(msg, { title: false, closeBtn: false }, function(index) {
         //     commons.layer.close(index);
         //     def.resolve();
         // }, function() {
         //     def.reject();
         // });
         // return def;
  },
  prompt: function () {
        // console.log(msg, formType)
         // var def = $.Deferred();
         // commons.layer.prompt({
         //     title: msg,
         //     formType: formType || 0 //prompt风格，支持0-2
         // }, function(pass, index) {
         //     commons.dialog.close(index);
         //     def.resolve(pass);
         // });
         // return def;
  },
  close: function () {
        // console.log(index)
         // commons.layer.close(index);
  },
  closeAll: function () {
        // console.log(type)
         // commons.layer.closeAll(type)
  },
  modal: function () {
        // console.log(obj)
  },
  openModal: function () {

  },
  error: function () {
        // console.error(msg)
  }
}
const layDialog = {
  msg: function (msg) {
    layer.msg(msg)
  },
  alert: function (msg) {
    layer.alert(msg, { title: false, closeBtn: false, shadeClose: 1 })
  },
  load: function () {
    layer.load(2)
  },
  loadClose: function () {
    layer.closeAll('loading')
  },
  confirm: function (msg) {
    var def = $.Deferred()
    layer.confirm(msg, { title: false, closeBtn: false }, function (index) {
      layer.close(index)
      def.resolve()
    }, function () {
      def.reject()
    })
    return def
  },
  prompt: function (msg, formType, value) {
    var def = $.Deferred()
    layer.prompt({
      title: msg,
      value: value || '',
      formType: formType || 0 // prompt风格，支持0-2
    }, function (pass, index) {
      dialog.close(index)
      def.resolve(pass)
    })
    return def
  },
  open: function () {
    return layer.open.apply(layer, arguments)
  },
  close: function (index) {
    layer.close(index)
  },
  closeAll: function (type) {
    layer.closeAll(type)
  },
  modal: function (obj, vueConfig) {
    if (vueConfig) {
      obj.url = '/isv/ModalLayer/index.html?v=' + new Date() + '#/' + vueConfig.url
    }
    var data = {
      type: 2,
      title: obj.title,
      shadeClose: true,
      shade: 0.8,
      area: ['450px', '90%'],
      content: obj.url,
      success: function (layero, index) {
        if (vueConfig) {
          var iframeWin = winTop[layero.find('iframe')[0]['name']]

          if (typeof iframeWin.vueLoad === 'function') {
            iframeWin.vueLoad(vueConfig)
            $('#crmContentPanel', winTop.document).hide()
          }
        }
      },
      end: function () {
        $('#crmContentPanel:hidden', winTop.document).show()
      }
    }
    data = $.extend(data, obj)
    return layer.open(data)
  },
  openModal: function (obj, vueConfig) {
    var url = '/isv/ModalLayer/index.html?v=' + new Date() + '#/' + vueConfig.url
    var openWin = window.open(url, '_blank')
    openWin.onload = function () {
      openWin.vueLoad(vueConfig)
      openWin.document.title = obj.title
    }
  },
  error: function (msg) {
    layDialog.alert(msg)
  }
}
let dialog = winDialog
if (layer) {
  dialog = layDialog
}
export { winDialog, dialog }
export default dialog
