import { attr, ent } from '../common/crm.js'
class newEntity {
  onload () {
    attr('new_istotalgoal').change(this.onIstotalgoalChange, 1)
  }
  onIstotalgoalChange () {
    var istotalgoal = attr('new_istotalgoal').val()
    if (istotalgoal) {
      attr('new_totalgoal').hide().required(0)
      attr('new_year').show().required()
      ent.show('tab_6')
    } else {
      attr('new_year').hide().required(0)
      attr('new_totalgoal').show().required()
      ent.hide('tab_6')
    }
  }
}
export default new newEntity()
