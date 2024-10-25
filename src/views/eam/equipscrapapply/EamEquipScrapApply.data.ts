import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '描述',
    align: 'center',
    dataIndex: 'desceiption',
  },
  {
    title: '报废申请人',
    align: 'center',
    dataIndex: 'createBy_dictText',
    width: 150,
  },
  {
    title: '报废申请时间',
    align: 'center',
    dataIndex: 'createTime',
    width: 150,
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    width: 150,
    customRender: ({ text }) => {
      return render.renderDict(text, 'equip_scrap_apply_status', true);
    },
  },
  {
    title: '审批人',
    align: 'center',
    width: 150,
    dataIndex: 'approveBy_dictText',
  },
  {
    title: '审批时间',
    align: 'center',
    width: 150,
    dataIndex: 'approveTime',
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '报废申请人',
    field: 'applicant',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '报废审批人',
    field: 'approval',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'equip_scrap_apply_status',
      showChooseOption: false,
      getPopupContainer: () => document.body,
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '描述',
    field: 'desceiption',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入描述!' }];
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
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
export const eamEquipScrapItemColumns: BasicColumn[] = [
  {
    title: '设备',
    align: 'center',
    dataIndex: 'equipId_dictText',
    width: 150,
  },
  {
    title: '净值',
    align: 'center',
    dataIndex: 'netValue',
    width: 150,
  },
  {
    title: '报废原因',
    align: 'center',
    dataIndex: 'reason',
  },
  {
    title: '附件',
    align: 'center',
    dataIndex: 'attachments',
    width: 150,
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
];
//子表表格配置
export const eamEquipScrapItemJVxeColumns: JVxeColumn[] = [
  {
    title: '设备编码',
    key: 'equipId',
    type: JVxeTypes.selectDictCustomSearch,
    method: 'get',
    url: '/equipment/eamEquipment/list',
    params: { column: 'createTime', order: 'desc', /*code: '${code}',*/ searchFields: 'code,name' },
    //pageSize: 10,
    //width: '200px',
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
    //multi: false,
    //maxTagCount: 4,
    linkmap: [{ name: 'equipName_dictText', value: 'old_value' }],
    placeholder: '请输入${title}',
    validateRules: [{ required: true, message: '${title}不能为空' }],
    formatter: ({ cellValue, row, column }) => {
      return row[column.params.key + '_dictText'] || cellValue;
    },
    width: '200px',
  },
  {
    title: '设备名称',
    key: 'equipName_dictText',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '原值',
    key: 'old_value',
    type: JVxeTypes.input,
    disabled: true,
  },
  {
    title: '净值',
    key: 'netValue',
    type: JVxeTypes.inputNumber,
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '报废原因',
    key: 'reason',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '附件',
    key: 'attachments',
    type: JVxeTypes.file,
    placeholder: '请上传${title}',
    defaultValue: '',
  },
  {
    title: '备注',
    key: 'remark',
    type: JVxeTypes.input,
    placeholder: '请输入${title}',
    defaultValue: '',
  },
];
