import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '申请单号',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'desceiption',
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return render.renderDict(text, 'mod_scrap_apply_status', true);
    },
  },
  {
    title: '审批人',
    align: 'center',
    dataIndex: 'approveBy_dictText',
  },
  {
    title: '审批时间',
    align: 'center',
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
    label: '申请单号',
    field: 'code',
    component: 'JInput',
  },
  {
    label: '描述',
    field: 'desceiption',
    component: 'JInput',
  },
  {
    label: '状态',
    field: 'status',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'mod_scrap_apply_status',
    },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '申请单号',
    field: 'code',
    component: 'Input',
    dynamicDisabled: true,
    ifShow: ({ values }) => {
      return !!values.id;
    },
  },
  {
    label: '描述',
    field: 'desceiption',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
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
export const modMouldScrapItemColumns: BasicColumn[] = [
  {
    title: '模具',
    align: 'center',
    dataIndex: 'mouldId_dictText',
  },
  {
    title: '净值',
    align: 'center',
    dataIndex: 'netValue',
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
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
];
//子表表格配置
export const modMouldScrapItemJVxeColumns: JVxeColumn[] = [
  {
    title: '报废申请',
    key: 'applyId',
    type: JVxeTypes.hidden,
  },
  {
    title: '报废申请',
    key: 'mouldId',
    type: JVxeTypes.hidden,
  },
  {
    title: '模具',
    key: 'mouldCode_dictText',
    type: JVxeTypes.popupCustom,
    method: 'get',
    url: '/mod/type/listModMouldByMainId',
    params: {
      isEnable: 'Y',
    },
    columns: [
      {
        title: '模具编码',
        align: 'center',
        dataIndex: 'code',
      },
      {
        title: '模具名称',
        align: 'center',
        dataIndex: 'name',
      },
      {
        title: '状态',
        align: 'center',
        dataIndex: 'status_dictText',
      },
      {
        title: '存放位置',
        align: 'center',
        dataIndex: 'location',
      },
    ],
    queryInfo: [
      {
        field: 'code',
        label: '模具编码',
        mode: 'single',
        view: 'string',
      },
      {
        field: 'name',
        label: '模具名称',
        mode: 'single',
        view: 'string',
      },
    ],
    rowKey: 'code',
    labelKey: 'name',
    placeholder: '请输入${title}',
    linkmap: [{ id: 'mouldId' }],
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '净值',
    key: 'netValue',
    type: JVxeTypes.inputNumber,
    width: '150px',
    placeholder: '请输入${title}',
    defaultValue: '0',
  },
  {
    title: '报废原因',
    key: 'reason',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '附件',
    key: 'attachments',
    type: JVxeTypes.file,
    width: '200px',
  },
  {
    title: '备注',
    key: 'remark',
    type: JVxeTypes.input,
    width: '150px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
];

// 高级查询数据
export const superQuerySchema = {
  code: { title: '申请单号', order: 0, view: 'text', type: 'string' },
  desceiption: { title: '描述', order: 1, view: 'text', type: 'string' },
  status: { title: '状态', order: 2, view: 'text', type: 'string' },
  approveBy: { title: '审批人', order: 3, view: 'text', type: 'string' },
  approveTime: { title: '审批时间', order: 4, view: 'datetime', type: 'string' },
  remark: { title: '备注', order: 5, view: 'text', type: 'string' },
  //子表高级查询
  modMouldScrapItem: {
    title: '模具报废明细表',
    view: 'table',
    fields: {
      mouldId: { title: '设备', order: 1, view: 'text', type: 'string' },
      netValue: { title: '净值', order: 2, view: 'number', type: 'number' },
      reason: { title: '报废原因', order: 3, view: 'text', type: 'string' },
      attachments: { title: '附件', order: 4, view: 'text', type: 'string' },
      remark: { title: '备注', order: 5, view: 'text', type: 'string' },
    },
  },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
