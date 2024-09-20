import { FormSchema } from '/@/components/Table';

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
