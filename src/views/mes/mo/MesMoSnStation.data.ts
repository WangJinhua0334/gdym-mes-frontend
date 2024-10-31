import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  // {
  //   title: '工单',
  //   align: 'center',
  //   dataIndex: 'moId_dictText',
  // },
  // {
  //   title: '派工单',
  //   align: 'center',
  //   dataIndex: 'moPlanId_dictText',
  // },
  // {
  //   title: '加工产品',
  //   align: 'center',
  //   dataIndex: 'prodId_dictText',
  // },
  // {
  //   title: '流转卡',
  //   align: 'center',
  //   dataIndex: 'snId_dictText',
  // },
  // {
  //   title: '流转卡',
  //   align: 'center',
  //   dataIndex: 'sn_dictText',
  // },
  {
    title: '工艺工序',
    align: 'center',
    dataIndex: 'wfsId_dictText',
    width: 150,
  },
  {
    title: '工序',
    align: 'center',
    dataIndex: 'stationId_dictText',
    width: 150,
  },
  {
    title: '顺序',
    align: 'center',
    dataIndex: 'sequence',
    width: 100,
  },
  {
    title: '数量',
    align: 'center',
    dataIndex: 'qty',
    width: 100,
  },
  {
    title: '投入数量',
    align: 'center',
    dataIndex: 'inputQty',
    width: 100,
  },
  {
    title: '完工数量',
    align: 'center',
    dataIndex: 'completeQty',
    width: 100,
  },
  {
    title: '报废数量',
    align: 'center',
    dataIndex: 'scrapQty',
    width: 100,
  },
  {
    title: '不良数量',
    align: 'center',
    dataIndex: 'ngQty',
    width: 100,
  },
  {
    title: '不良次数',
    align: 'center',
    dataIndex: 'ngCout',
    width: 100,
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    width: 100,
    customRender: ({ text }) => {
      return render.renderDict(text, 'lot_status', true);
    },
  },
  {
    title: '工位',
    align: 'center',
    dataIndex: 'wkpIds_dictText',
  },
  {
    title: '操作员',
    align: 'center',
    dataIndex: 'operateBys_dictText',
  },
  {
    title: '计划开始时间',
    align: 'center',
    dataIndex: 'planStartTime',
  },
  {
    title: '计划完工时间',
    align: 'center',
    dataIndex: 'planCompleteTime',
  },
  {
    title: '实际开工时间',
    align: 'center',
    dataIndex: 'acStartTime',
  },
  {
    title: '实际完工时间',
    align: 'center',
    dataIndex: 'acCompleteTime',
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '工单',
    field: 'moId',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入工单!' }];
    },
  },
  {
    label: '派工单',
    field: 'moPlanId',
    component: 'Input',
  },
  {
    label: '加工产品',
    field: 'prodId',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入加工产品!' }];
    },
  },
  {
    label: '流转卡',
    field: 'snId',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入流转卡!' }];
    },
  },
  {
    label: '流转卡',
    field: 'sn',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入流转卡!' }];
    },
  },
  {
    label: '工艺工序',
    field: 'wfsId',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入工艺工序!' }];
    },
  },
  {
    label: '工序',
    field: 'stationId',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入工序!' }];
    },
  },
  {
    label: '顺序',
    field: 'sequence',
    component: 'InputNumber',
  },
  {
    label: '数量',
    field: 'qty',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入数量!' }];
    },
  },
  {
    label: '完工数量',
    field: 'completeQty',
    component: 'InputNumber',
  },
  {
    label: '报废数量',
    field: 'scrapQty',
    component: 'InputNumber',
  },
  {
    label: '不良数量',
    field: 'ngQty',
    component: 'InputNumber',
  },
  {
    label: '不良次数',
    field: 'ngCout',
    component: 'InputNumber',
  },
  {
    label: '状态',
    field: 'status',
    component: 'Input',
  },
  {
    label: '工位',
    field: 'wkpIds',
    component: 'Input',
  },
  {
    label: '操作员',
    field: 'operateBys',
    component: 'Input',
  },
  {
    label: '计划开始时间',
    field: 'planStartTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '计划完工时间',
    field: 'planCompleteTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '实际开工时间',
    field: 'acStartTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '实际完工时间',
    field: 'acCompleteTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'Input',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

// 高级查询数据
export const superQuerySchema = {
  moId: { title: '工单', order: 0, view: 'text', type: 'string' },
  moPlanId: { title: '派工单', order: 1, view: 'text', type: 'string' },
  prodId: { title: '加工产品', order: 2, view: 'text', type: 'string' },
  snId: { title: '流转卡', order: 3, view: 'text', type: 'string' },
  sn: { title: '流转卡', order: 4, view: 'text', type: 'string' },
  wfsId: { title: '工艺工序', order: 5, view: 'text', type: 'string' },
  stationId: { title: '工序', order: 6, view: 'text', type: 'string' },
  sequence: { title: '顺序', order: 7, view: 'number', type: 'number' },
  qty: { title: '数量', order: 8, view: 'number', type: 'number' },
  completeQty: { title: '完工数量', order: 9, view: 'number', type: 'number' },
  scrapQty: { title: '报废数量', order: 10, view: 'number', type: 'number' },
  ngQty: { title: '不良数量', order: 11, view: 'number', type: 'number' },
  ngCout: { title: '不良次数', order: 12, view: 'number', type: 'number' },
  status: { title: '状态', order: 13, view: 'text', type: 'string' },
  wkpIds: { title: '工位', order: 14, view: 'text', type: 'string' },
  operateBys: { title: '操作员', order: 15, view: 'text', type: 'string' },
  planStartTime: { title: '计划开始时间', order: 16, view: 'datetime', type: 'string' },
  planCompleteTime: { title: '计划完工时间', order: 17, view: 'datetime', type: 'string' },
  acStartTime: { title: '实际开工时间', order: 18, view: 'datetime', type: 'string' },
  acCompleteTime: { title: '实际完工时间', order: 19, view: 'datetime', type: 'string' },
  remark: { title: '备注', order: 20, view: 'text', type: 'string' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
