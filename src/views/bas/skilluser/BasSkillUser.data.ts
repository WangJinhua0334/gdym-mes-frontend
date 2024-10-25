import { BasicColumn, FormSchema } from '/@/components/Table';
import { JVxeColumn, JVxeTypes } from '/@/components/jeecg/JVxeTable/types';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '工号',
    align: 'center',
    sorter: true,
    dataIndex: 'workNo',
    width: 200,
  },
  {
    title: '姓名',
    align: 'center',
    sorter: true,
    dataIndex: 'realname',
    width: 200,
  },
  {
    title: '账号状态',
    align: 'center',
    sorter: true,
    dataIndex: 'status_dictText',
    width: 200,
  },
  {
    title: '职务',
    align: 'center',
    sorter: true,
    dataIndex: 'post_dictText',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '工号',
    field: 'workNo',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '姓名',
    field: 'realname',
    component: 'JInput',
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '工号',
    field: 'workNo',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '姓名',
    field: 'realname',
    component: 'Input',
    dynamicDisabled: true,
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
//子表单数据
//子表列表数据
export const basSkillUserColumns: BasicColumn[] = [
  {
    title: '技能编码',
    align: 'center',
    dataIndex: 'skillId_dictText',
    width: 150,
  },
  {
    title: '技能名称',
    align: 'center',
    dataIndex: 'skillName_dictText',
    width: 150,
  },
  {
    title: '技能等级',
    align: 'center',
    dataIndex: 'skillLevelId_dictText',
    width: 150,
  },
  {
    title: '等级名称',
    align: 'center',
    dataIndex: 'skillLevelName_dictText',
    width: 150,
  },
  {
    title: '附件',
    align: 'center',
    dataIndex: 'attachments',
    slots: { customRender: 'fileSlot' },
  },
];
//子表表格配置
export const basSkillUserJVxeColumns: JVxeColumn[] = [
  {
    title: '技能编码',
    key: 'skillId',
    type: JVxeTypes.selectDictCustomSearch,
    width: '200px',
    method: 'get',
    url: '/skill/basSkill/list',
    params: { column: 'code', order: 'asc', /*code: '${code}',*/ searchFields: 'code,name' },
    columns: [
      {
        name: '编号',
        code: 'code',
      },
      {
        name: '名称',
        code: 'name',
      },
    ],
    rowKey: 'id',
    labelKey: 'code',
    linkmap: [{ name: 'skillName_dictText' }],
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
  },
  {
    title: '技能名称',
    key: 'skillName_dictText',
    width: '200px',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '技能等级id',
    key: 'skillId',
    type: JVxeTypes.hidden,
  },
  {
    title: '等级',
    key: 'skillLevelId',
    type: JVxeTypes.selectDictCustomSearch,
    width: '200px',
    method: 'get',
    url: '/skill/basSkill/queryBasSkillLevelPageByMainId',
    params: { column: 'level', order: 'asc', skillId: '${skillId}' },
    columns: [
      {
        name: '等级',
        code: 'level',
      },
      {
        name: '等级名称',
        code: 'name',
      },
    ],
    rowKey: 'id',
    labelKey: 'level',
    linkmap: [{ name: 'skillLevelName_dictText' }],
    placeholder: '请输入${title}',
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
  },
  {
    title: '等级名称',
    key: 'skillLevelName_dictText',
    width: '200px',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '附件',
    key: 'attachments',
    type: JVxeTypes.file,
    token: true,
    responseName: 'message',
    width: '200px',
    placeholder: '请选择文件',
    defaultValue: '',
  },
];
