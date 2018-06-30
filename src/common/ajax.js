import $ from 'jQuery'
import _ from 'underscore'
import crmFetch from '../crmFetch/main'
import dialog from './dialog'
import dataHelper from './dataHelper'
var oDataEndpointUrl = window.Xrm.Page.context.prependOrgName('/XRMServices/2011/OrganizationData.svc/')
var ajax = function (type, baseurl) {
  // type =  1 异步
  // type = 2  submit
  // type = 3 同步
  var oasync = type !== 3
  var req = {
    baseurl: baseurl,
    type: type,
    isSubmit: 0,
    setBaseUrl: function (url) {
      if (/^\//.test(url) || /^http/.test(url)) {
        return url
      }
      if (req.baseurl) {
        return req.baseurl + url
      } else {
        return url
      }
    },
    setsubmit: function (state) {
      if (arguments.length === 0) {
        return this.isSubmit
      }
      this.isSubmit = state
    },
    get: function (url, data, option) {
      var opt = $.extend(option, { async: oasync, type: 'get' })
      return req.post(url, data, opt)
    },
    post: function (requrl, data, o) {
      if (this.type === 2) {
        if (this.setsubmit() === 1) {
          return $.Deferred()
        }
        dialog.load()
        req.setsubmit(1)
      }
      var url = this.setBaseUrl(requrl)
      var optDefault = {
        contentType: 'application/json; charset=utf-8',
        type: 'post',
        async: oasync
      }
      var option = $.extend(optDefault, o)
      var Data = data || {}
      Data = option.type === 'get' ? $.param(Data) : JSON.stringify(Data)
      var def = $.Deferred()
      $.ajax({
        type: option.type,
        async: option.async,
        contentType: option.contentType,
        dataType: option.datatype,
        url: encodeURI(url),
        beforeSend: function (XMLHttpRequest) {
          XMLHttpRequest.setRequestHeader('Accept', 'application/json')
          if (option && typeof option.beforeSend === 'function') {
            option.beforeSend(XMLHttpRequest)
          }
        },
        data: Data
      }).then((res) => {
        if (req.type === 2) {
          dialog.loadClose()
          req.setsubmit(0)
        }
        def.resolve(res)
      },
          function (xhr, status, statusText) {
            if (req.type === 2) {
              dialog.loadClose()
              req.setsubmit(0)
            }
            if (_.isObject(xhr.responseJSON)) {
              if (xhr.responseJSON.error) {
                dialog.msg(xhr.responseJSON.error.message.value)
              } else if (xhr.responseJSON.errorMessage) {
                dialog.msg(xhr.responseJSON.errorMessage)
              } else {
                dialog.msg(xhr.responseJSON.Message)
              }
            } else {
              dialog.msg(xhr.status + '  ' + xhr.statusText)
            }
            def.reject(xhr, status, statusText)
          })
      return def
    },
    fetchExec: function () {
      var def = $.Deferred()
      this.exec.apply(null, arguments).then(function (results) {
        if (results !== null) {
          def.resolve(results)
        }
      }, function onFetchError (xhr) {
        var errormsg = $(xhr.responseXML).find('Message').text() || xhr
        dialog.error(errormsg)
        def.reject(errormsg)
      })
      return def
    },
    fetch: function (fetchXml) {
      var xml = fetchXml
      Array.isArray(xml) && (xml = xml.join(''))
      return req.fetchExec.apply({ exec: crmFetch.Fetch }, [xml])
    },
    GetById: function (name, id, column) {
      var def = $.Deferred()
      this.fetchExec.apply({ exec: crmFetch.GetById }, [name, id, column]).then(function (results) {
        var attrs = dataHelper.attrs(results)
        def.resolve(attrs, results)
      })
      return def
    },
    lookupById: function (arr, columns) {
      if (!_.isArray(arr) || arr.length === 0 || !_.isObject(arr[0])) {
        var def = $.Deferred()
        _.defer(function () {
          def.reject()
        })
        return def
      }
      return req.GetById(arr[0].entityType, arr[0].id, columns)
    },
    update: function (entity, id, data) {
      var url = oDataEndpointUrl + '/' + entity + 'Set' + (id ? '(guid\'' + id + '\')' : '')
      return req.post(url, data, {
        beforeSend: function (XMLHttpRequest) {
          id && XMLHttpRequest.setRequestHeader('X-HTTP-Method', 'MERGE')
        }
      })
    },
    delete: function (entity, id) {
      var url = oDataEndpointUrl + '/' + entity + 'Set(guid\'' + id + '\')'
      return req.post(url, '', {
        beforeSend: function (XMLHttpRequest) {
          XMLHttpRequest.setRequestHeader('X-HTTP-Method', 'DELETE')
        }
      })
    },
    fetchAll: function () {
      return req.fetchExec.apply({ exec: crmFetch.FetchAll }, arguments)
    }
  }
  var fetchSync = {
    fetch: function (fetchXml) {
      var xml = fetchXml
      Array.isArray(xml) && (xml = xml.join(''))
      var def = $.Deferred()
      var res = crmFetch.FetchSync.apply(fetchSync, [xml.toLocaleString()])
      def.resolve(res)
      return def
    },
    GetById: function (name, id, column) {
      var def = $.Deferred()
      var results = crmFetch.GetByIdSync(name, id, column)
      var attrs = dataHelper.attrs(results)
      def.resolve(attrs, results)
      return def
    },
    lookupById: function (arr, columns) {
      if (!_.isArray(arr) || arr.length === 0 || !_.isObject(arr[0])) {
        var def = $.Deferred()
        _.defer(function () {
          def.reject()
        })
        return def
      }
      return fetchSync.GetById(arr[0].entityType, arr[0].id, columns)
    }
  }
  if (type === 3) {
    $.extend(req, fetchSync)
  }
  return req
}
var asyn = ajax.bind(ajax, 1)
var submit = ajax.bind(ajax, 2)
var reqSync = ajax.bind(ajax, 3)
export default { asyn, submit, sync: reqSync }
