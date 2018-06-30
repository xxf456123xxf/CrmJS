import ajax from './ajax'
import _ from 'underscore'
const reqSync = ajax.sync()
const systemuserid = window.Xrm.Page.context.getUserId()
export const crmRole = {
  RoleList: [],
  crmRoleXml: [`<fetch mapping='logical' version='1.0'>
          <entity name='role'>
            <attribute name='name' />
            <link-entity name='systemuserroles' from='roleid' to='roleid' link-type='inner'>
             <filter>
              <condition attribute='systemuserid' operator='eq' value='${systemuserid}' />
            </filter>
            </link-entity>
          </entity>
        </fetch>`],
  init: function () {
    reqSync.fetch(crmRole.crmRoleXml).then(function (results) {
      crmRole.RoleList = _.chain(results).pluck('attributes').pluck('name').pluck('value').value()
    })
  },
  isRole: function (roleName) {
    if (crmRole.RoleList.length === 0) {
      crmRole.init()
    }
    return _.contains(crmRole.RoleList, roleName)
  },
  getRoleName: function () {
    if (crmRole.RoleList.length === 0) {
      crmRole.init()
    }
    return crmRole.RoleList
  }
}
export default crmRole
