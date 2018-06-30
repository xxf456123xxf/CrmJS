import { crmDocument, $ } from '../common/crm'
export const component = function (id, msg) {
  if (!$('#' + id, crmDocument).parents('tr').prev().hasClass('tips')) {
    $('#' + id, crmDocument).parents('tr').before('<tr height="24" class="tips"><td></td><td><span style="color:red" class="ms-crm-Inline-Value">' + msg + '</span></td></tr>')
  }
}
export default component
