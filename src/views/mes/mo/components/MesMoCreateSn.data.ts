import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '工单ID',
    field: 'moId',
    component: 'Input',
    show: false,
  },
  {
    label: '工单号',
    field: 'moId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '车间',
    field: 'workShopId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '产品编码',
    field: 'prodId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '产品名称',
    field: 'prodName_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '工单数量',
    field: 'moQty',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '已分配数量',
    field: 'createdQty',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '计划开始日期',
    field: 'planStartTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请选择计划开始日期!' }, { ...rules.startTime(model.planCompleteTime, true)[0] }];
    },
  },
  {
    label: '计划完工日期',
    field: 'planCompleteTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请选择计划完工日期!' }, { ...rules.endTime(model.planStartTime, true)[0] }];
    },
  },
  {
    label: '分配数量',
    field: 'qty',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入分配数量!' }];
    },
  },
  {
    label: '批次数量',
    field: 'batchQty',
    defaultValue: '1',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入批次数量!' }];
    },
  },
  {
    label: '开始框/托(号)',
    field: 'num',
    defaultValue: '1',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入开始框/托(号)!' }];
    },
  },
  {
    label: '是否记录唯一码',
    field: 'isUniqSn',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: { dictCode: 'is_open' },
    ifShow: false,
    // ifShow: ({ values }) => {
    //   return values.batchQty > 1;
    // },
  },
];
