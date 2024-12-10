import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '分类代码',
    align: 'left',
    dataIndex: 'code',
    width: 200,
  },
  {
    title: '分类名称',
    align: 'left',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '分类描述',
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
    label: '父级节点',
    field: 'pid',
    component: 'JTreeSelect',
    componentProps: {
      dict: 'eam_defect_category,name,id',
      pidField: 'pid',
      pidValue: '0',
      hasChildField: 'has_child',
    },
  },
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
