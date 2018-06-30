import {
  ent,
  attr,
  // grid,
  request,
  // submit,
  // reqSync,
  // crmWindow,
  // crmDocument,
  isRole,
  dialog
} from '../common/crm'
class newEntity {
  onload () {
    var name = attr('new_name')
    name.val('name') // 赋值
    name.val() // 取值 => name
    name.change(this.nameChange) // 绑定chagne事件
    name.removechange(this.nameChange) // 移除change事件
    name.change() // change事件
    name.clear() // 清除值
    name.default('name') // 默认值
    name.disabled() // 禁用
    name.disabled(0) // 启用
    name.focus() // 设置焦点
    name.hide() // 隐藏
    name.show() // 显示
    name.getValue() // 同CRM获取值
    name.isDirty() // 判断是否修改
    name.mode() // 设置提交模式
    name.refresh() // 刷新字段值
    name.required() // 必填
    name.text() // 获取文本值

    attr('ownerid').user() // 用户设置当前登录人
    attr('ownerid').setLookup('systemuser', ent.id, '管理员') // lookup时赋值
    var fetchXml = ''
    attr('new_productid').addCustomView('可选产品', fetchXml, ['new_name']) // 添加自定义视图
    attr('new_productid').addFilter(this.productCustomFilter) // 产品视图添加filter条件

    attr('new_productid').setByVal(['new_productname', ['name', 'ownerid$empty']], ['new_name', 'ownerid'], request.lookupById) // 产品查找产品名称赋值、ownerid为null时不赋值,会触发change事件

    var drop = attr('new_type').getOpts()
    drop.optVal([100000000]) // 只显示下拉值100000000
    // drop.optVal([100000001]) // 只显示下拉值100000001
    // drop.remove([100000001]) // 移除下拉值100000001

    console.log(`ent.id:${ent.id}`) // 实体id
    console.log(`ent.name:${ent.name}`) // 实体name
    console.log(`ent.userid:${ent.userid}`) // 用户id
    console.log(`ent.username:${ent.username}`) // 用户名
    ent.isowner() // 当前负责人等于登录人
    ent.isValid() // 验证窗体是否必填
    ent.refresh() // 刷新窗体数据或者列表数据
    ent.refRibbon() // 刷新ribbon

   // ent.reload() // 重新加载页面
    // ent.save() // 保存
    ent.disabled(['new_name'])
    /* or */
    ent.disabled('new_name') // 禁用
    ent.disabledAll() // 禁用全部
    ent.hide(['new_name']) // 隐藏
    ent.show(['new_name']) // 显示
    ent.Tabs(['new_name'], 'show').Tabs('required') // 显示并必填

    isRole('角色判断')

    dialog.msg('提示') // 提示
    // 弹出全屏
    // dialog.modal({ title: '标题', area: ['100%', '100%'], offset: ['0px', '0px'] }, {
    //   url: 'HtmlDemo',
    //   data () {
    //     return { id: ent.id }
    //   },
    //   methods: {
    //     success () {
    //       dialog.alert('操作成功!')
    //       ent.refresh()
    //     }
    //   }
    // })

    request.lookupById(attr('ownerid').getValue(), ['fullname']).then(resp => {
      console.log(resp)
    })
    // const url = ''
    // request.post(url).then((resp) => {
    //   console.log(resp)
    // })
  }
  productCustomFilter () {
    return `<filter type='and'><condition attribute='new_name' operator='like' value='%产品%' /></filter>`
  }
  nameChange () {

  }
  onsave () {}
}
export default new newEntity()
