import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';

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
    componentProps: {},
    dynamicRules: ({ model, schema, values }) => {
      return [{ pattern: /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/, message: '请输入正确的数量!' }];
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
