import { crmDocument, ent, attr, $, _ } from '../common/crm'
let checkList = {}
export const component = function (id, value, text) {
  var checkValue = value
  var checkText = text
  if (checkList[id]) {
    return
  }
  if (!checkValue) {
    checkValue = id + '_value'
  }
  if (!checkText) {
    checkText = id + '_text'
  }
  ent.hide([checkValue, checkText])
  attr(id).mode(0)
  var html = $(' <div style="border: 1px solid #CCCCCC;margin: 5px 0px 5px 24px;padding: 5px;" ></div>')
  var opts = attr(id).getOpts()
  var options = opts.options
  var values = attr(checkValue).val() || ''
  var vals = values.split('|')
  var CheckChange = function () {
    var check = html.find('input:checked')
    var val = check.map(function (index, item) { return item.value }).toArray().join('|')
    var texts = check.next().map(function (index, item) { return $(item).text() }).toArray().join(';')
    attr(checkValue).val(val).change()
    attr(checkText).val(texts).change()
  }
  options.forEach(function (item) {
    if (!item.text) {
      return
    }
    var checkbox = $('<input  style="border-top: medium none; border-right: medium none; width: 25px; border-bottom: medium none; border-left: medium none; align: left" type="checkbox" value="' + item.value + '">')
    html.append(checkbox)
    if (_.contains(vals, item.value + '')) {
      checkbox.attr('checked', 'checked')
    }
    checkbox.bind('change', CheckChange)
    html.append('<label>' + item.text + '</label>')
  })
  $('#' + id, crmDocument).hide().before(html)
  checkList[id] = 1
}
export default component
