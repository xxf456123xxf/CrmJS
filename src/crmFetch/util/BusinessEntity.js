export default (function () {
    // Type: JavaScript Implementation of the Entity Class
  function BusinessEntity () {
    this.Id = null
    this.logicalName = null
    this.attributes = {}
  }
    // Getter for the attributes
    // E.g.: entity.getValue('accountid') or contact.getValue('parentaccountid', 'name')
  BusinessEntity.prototype.getValue = function (attrname, optProperty) {
    var attr = this.attributes[attrname]
    if (attr) {
      var attrType = attr.type
      switch (attrType) {
        case 'a:EntityReference':
          return (optProperty !== undefined) ? attr[optProperty] : attr.guid
        case 'a:OptionSetValue':
          return (optProperty !== undefined) ? attr[optProperty] : attr.value
        default:
          return attr.value
      }
    }
    return null
  }
  return BusinessEntity
}())
