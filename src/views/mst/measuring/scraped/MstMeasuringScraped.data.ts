import { FormSchema } from '/@/components/Table';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '报废原因',
    field: 'scrapedReason',
    component: 'InputTextArea',
    colProps: { span: 24 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入报废原因!' }];
    },
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '量具型号Id',
    field: 'typeId',
    component: 'Input',
    show: false,
  },
  //TODO 传递默认值Scraped标识符给后端进行报废操作
  {
    label: '状态',
    field: 'status',
    component: 'Input',
    show: false,
    defaultValue: 'Scraped',
  },
];
