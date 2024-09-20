import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '分类代码',
    align: 'left',
    dataIndex: 'code',
  },
  {
    title: '分类名称',
    align: 'left',
    dataIndex: 'name',
  },
  {
    title: '分类描述',
    align: 'center',
    dataIndex: 'description',
  },
];
//子列表数据
export const defectCategoryListItemColumns: BasicColumn[] = [
  {
    title: '小类代码',
    align: 'left',
    dataIndex: 'code',
  },
  {
    title: '小类名称',
    align: 'left',
    dataIndex: 'name',
  },
  {
    title: '小类描述',
    align: 'center',
    dataIndex: 'description',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '分类代码',
    field: 'code',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '分类名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '分类代码',
    field: 'code',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入分类代码!' }];
    },
  },
  {
    label: '分类名称',
    field: 'name',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入分类名称!' }];
    },
  },
  {
    label: '分类描述',
    field: 'description',
    component: 'InputTextArea',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
//表单数据
export const itemFormSchema: FormSchema[] = [
  {
    label: '小类代码',
    field: 'code',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入分类代码!' }];
    },
  },
  {
    label: '小类名称',
    field: 'name',
    component: 'Input',
    dynamicRules: () => {
      return [{ required: true, message: '请输入分类名称!' }];
    },
  },
  {
    label: '小类描述',
    field: 'description',
    component: 'InputTextArea',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
