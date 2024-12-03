import { FormSchema } from '/@/components/Table';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';

//表单数据
export const formSchema: FormSchema[] = [
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '工单号',
    field: 'code',
    component: 'Input',
  },

  {
    label: '工单类型',
    field: 'type_dictText',
    component: 'Input',
  },
  {
    label: '生产类型',
    field: 'produceType_dictText',
    component: 'Input',
  },
  {
    label: '车间',
    field: 'workShopId_dictText',
    component: 'Input',
  },
  {
    label: '产品编码',
    field: 'prodId_dictText',
    component: 'Input',
  },
  {
    label: '产品名称',
    field: 'prodName_dictText',
    component: 'Input',
  },
  {
    label: '工艺路线',
    field: 'wkfId_dictText',
    component: 'Input',
  },
  {
    label: '状态',
    field: 'status',
    component: 'Input',
    show: false,
  },
  {
    label: '状态',
    field: 'status_dictText',
    component: 'Input',
  },
  {
    label: '生产批次',
    field: 'batch',
    component: 'InputNumber',
  },
  {
    label: '计划数量',
    field: 'qty',
    component: 'InputNumber',
  },
  {
    label: '已下发数',
    field: 'dispatchedQty',
    component: 'InputNumber',
  },
  {
    label: '投入数量',
    field: 'inputedQty',
    component: 'InputNumber',
  },
  {
    label: '产出数量',
    field: 'completedQty',
    component: 'InputNumber',
  },
  {
    label: '报废数量',
    field: 'scrapedQty',
    component: 'InputNumber',
  },
  {
    label: '计划开始日期',
    field: 'planStartTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
    },
  },
  {
    label: '计划完工日期',
    field: 'planCompleteTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
    },
  },
  {
    label: '实际开工时间',
    field: 'acStartTime',
    component: 'DatePicker',
  },
  {
    label: '实际完工时间',
    field: 'acCompleteTime',
    component: 'DatePicker',
  },
  {
    label: '物料成本',
    field: 'materialCost',
    component: 'InputNumber',
  },
  {
    label: '模板方案',
    field: 'templateId_dictText',
    component: 'Input',
  },
  {
    label: '包装规则',
    field: 'packRuleId_dictText',
    component: 'Input',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '关闭人',
    field: 'closeBy_dictText',
    component: 'Input',
    ifShow: ({ values }) => {
      return values.status === 'ClosedInAdvance' || values.status === 'Closed';
    },
  },
  {
    label: '关闭时间',
    field: 'closeTime',
    component: 'DatePicker',
    ifShow: ({ values }) => {
      return values.status === 'ClosedInAdvance' || values.status === 'Closed';
    },
  },
  {
    label: '关闭原因',
    field: 'closeReason',
    component: 'InputTextArea',
    ifShow: ({ values }) => {
      return values.status === 'ClosedInAdvance' || values.status === 'Closed';
    },
    colProps: { span: 24 },
  },
];

//子表表格配置
export const mesMoBomJVxeColumns: JVxeColumn[] = [
  {
    title: '物料编码',
    key: 'prodId_dictText',
    type: JVxeTypes.input,
  },
  {
    title: '物料名称',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
  },
  {
    title: '是否关键料',
    key: 'isKeypart',
    type: JVxeTypes.slot,
    align: 'center',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    width: 120,
    slotName: 'mustSwitch',
  },
  {
    title: '需求量',
    key: 'requireQty',
    type: JVxeTypes.inputNumber,
    width: 100,
  },
  {
    title: '单位用量',
    key: 'qty',
    type: JVxeTypes.inputNumber,
    width: 100,
  },
  {
    title: '单位',
    key: 'unitId_dictText',
    type: JVxeTypes.input,
    width: 100,
  },
  {
    title: '损耗率',
    key: 'lossRate',
    type: JVxeTypes.inputNumber,
    width: 100,
  },
  {
    title: '已备料',
    key: 'preparedQty',
    type: JVxeTypes.inputNumber,
    width: 100,
  },
  {
    title: '已领料',
    key: 'issuedQty',
    type: JVxeTypes.inputNumber,
    width: 100,
  },
  {
    title: '已使用',
    key: 'usedQty',
    type: JVxeTypes.inputNumber,
    width: 100,
  },
  {
    title: '位置',
    key: 'location',
    type: JVxeTypes.input,
  },
  {
    title: '描述',
    key: 'description',
    type: JVxeTypes.textarea,
  },
  {
    title: '顺序',
    key: 'sequence',
    type: JVxeTypes.inputNumber,
    width: 100,
  },
];

export const mesMoStationJVxeColumns: JVxeColumn[] = [
  {
    title: '工序',
    key: 'wfsId_dictText',
    type: JVxeTypes.input,
  },
  {
    title: '是否开始节点',
    key: 'isStart',
    type: JVxeTypes.slot,
    align: 'center',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    width: 120,
    slotName: 'mustSwitch',
  },
  {
    title: '是否打印流转卡',
    key: 'isPrintSn',
    type: JVxeTypes.slot,
    align: 'center',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    width: 120,
    slotName: 'mustSwitch',
  },
  {
    title: '加工物料',
    key: 'prodId_dictText',
    type: JVxeTypes.input,
  },
  {
    title: '物料名称',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
  },
  {
    title: '顺序',
    key: 'sequence',
    type: JVxeTypes.inputNumber,
  },
];

export const mesMoStationBomJVxeColumns: JVxeColumn[] = [
  {
    title: '工序',
    key: 'wfsId_dictText',
    type: JVxeTypes.input,
  },
  {
    title: '物料编码',
    key: 'prodId_dictText',
    type: JVxeTypes.input,
  },
  {
    title: '物料名称',
    key: 'prodName_dictText',
    type: JVxeTypes.input,
  },
  {
    title: '是否关键料',
    key: 'isKeypart',
    type: JVxeTypes.slot,
    align: 'center',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    width: 120,
    slotName: 'mustSwitch',
  },
  {
    title: '用量',
    key: 'qty',
    type: JVxeTypes.inputNumber,
    width: 100,
  },
  {
    title: '单位',
    key: 'unitId_dictText',
    type: JVxeTypes.input,
    width: 120,
  },
  {
    title: '管控方式',
    key: 'controlModel_dictText',
    type: JVxeTypes.input,
    width: 120,
  },
  {
    title: '位置',
    key: 'location',
    type: JVxeTypes.input,
    width: 120,
  },
  {
    title: '顺序',
    key: 'sequence',
    type: JVxeTypes.inputNumber,
    width: 100,
  },
];
