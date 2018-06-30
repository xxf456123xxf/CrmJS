import { ent, isRole } from '../common/crm.js'
class newEntity {
  onload () {
    if (isRole('财务人员')) {
      ent.disabled(['new_actualamount', 'new_actualtime'], 0)
    }
  }
}
export default new newEntity()
