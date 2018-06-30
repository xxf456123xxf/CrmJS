import { ent, dialog } from '../common/crm.js'
class newEntity {
  demo () {
    var id = 1
    var tableData2 = [{
      date: '2018-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }]
    dialog.modal({ title: 'layer demo', area: ['100%', '100%'], offset: ['0px', '0px'] }, {
      url: 'newDemo/Table',
      data () {
        return {id, tableData2}
      },
      methods: {
        success () {
          dialog.alert('操作成功!')
          ent.refresh()
        }
      }
    })
  }

}
export default new newEntity()
