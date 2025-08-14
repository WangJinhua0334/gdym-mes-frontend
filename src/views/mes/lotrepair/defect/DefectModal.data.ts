import { FormSchema } from '/@/components/Table';

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '缺陷代码',
    field: 'defectId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '缺陷数量',
    field: 'defectQty',
    component: 'InputNumber',
    defaultValue: 0,
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请输入缺陷数量!' }];
    },
  },
  {
    label: '缺陷描述',
    field: 'defectDesc',
    component: 'Input',
    componentProps: {},
  },
  {
    label: '不良原因',
    field: 'defectReasonId',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'bas_defect_reason,description,id',
    },
  },
  {
    label: '报废数量',
    field: 'scrapQty',
    component: 'InputNumber',
    defaultValue: 0,
    componentProps: {},
    dynamicRules: ({ model, schema, values }) => {
      return [
        { pattern: /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/, message: '请输入正确的数量!' },
        {
          validator: (_, value) => {
            const defectQty = values.defectQty; // 获取不良数量
            if (value > defectQty) {
              return Promise.reject(new Error('报废数量不能大于不良数量!'));
            }
            return Promise.resolve();
          },
        },
      ];
    },
    dynamicDisabled: ({ model, schema, values }) => {
      return !values.defectQty || values.defectQty <= 0;
    },
  },
  {
    label: '报废原因',
    field: 'scrapReason',
    component: 'Input',
    componentProps: {},
  },
  {
    label: '维修内容',
    field: 'repairDesc',
    component: 'InputTextArea',
    colProps: { span: 24 },
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请输入维修内容!' }];
    },
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
