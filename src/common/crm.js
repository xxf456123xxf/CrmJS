import _ from 'underscore'
import $ from 'jQuery'
import crmContext from '../crmContext'
import ajax from './ajax'
// import req from './request'
import role from './role'
import dialog from './dialog'
const crmDocument = window.parent.document
const crmWindow = window.parent
var crm = {}
var newCrmContext = new crmContext(crmWindow.Xrm, { Sys: crmWindow.Sys })
crm.attr = newCrmContext.attr.bind(newCrmContext)
crm.entity = newCrmContext.entity
crm.process = newCrmContext.process
crm.crmGridList = newCrmContext.crmGridList.bind(newCrmContext)
const request = ajax.asyn()// 异步请求
const submit = ajax.submit() // 提交时显示加载层
const reqSync = ajax.sync()// 同步请求
const ent = crm.entity // CRM窗体操作
const attr = crm.attr // CRM字段操作
const grid = crm.crmGridList // CRM子网格操作
const process = crm.process // CRM业务流程操作
const isRole = role.isRole // 权限
window.ajax = ajax
window.submit = submit
window.reqSync = reqSync
window.isRole = isRole
window.crm = crm
export { ent, attr, process, grid, _, request, submit, reqSync, $, crmWindow,
 crmDocument, isRole, dialog}
