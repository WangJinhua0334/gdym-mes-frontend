import { FormSchema } from '/@/components/Table';

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '关闭原因',
    field: 'closeReason',
    component: 'InputTextArea',
    colProps: { span: 24 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入关闭原因!' }];
    },
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
