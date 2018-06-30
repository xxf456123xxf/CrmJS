import { _ } from 'underscore'
const dataHelper = {
  attrs: function (entity) {
    if (_.isArray(entity)) {
      return _.map(entity, dataHelper.attrs)
    }
    return _.mapObject(entity.attributes, function (val) {
      return val.value || val.guid
    })
  },
  attrsName: function (entity) {
    if (_.isArray(entity)) {
      return _.map(entity, dataHelper.attrsName)
    }
    return _.mapObject(entity.attributes, function (val) {
      return val.name || val.value || val.guid
    })
  }
}
export default dataHelper
