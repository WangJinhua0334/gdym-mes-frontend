import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    sorter: true,

    dataIndex: 'code',
  },
  {
    title: '描述',
    align: 'center',
    sorter: true,

    dataIndex: 'description',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '编码',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '描述',
    field: 'description',
    component: 'JInput',
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '编码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入编码!' }];
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入描述!' }];
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
//子表单数据
//子表列表数据
export const basDefectColumns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',

    dataIndex: 'code',
  },
  {
    title: '描述',
    align: 'center',

    dataIndex: 'description',
  },
];
//子表表格配置
export const basDefectJVxeColumns: JVxeColumn[] = [
  {
    title: '编码',
    key: 'code',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [
      { required: true, message: '${title}不能为空' },
      { pattern: 'only', message: '${title}不能重复' },
    ],
  },
  {
    title: '描述',
    key: 'description',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
];
