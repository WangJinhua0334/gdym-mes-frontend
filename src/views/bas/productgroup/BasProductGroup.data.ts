import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '编码',
    align: 'left',
    sorter: true,
    dataIndex: 'code',
    width: 200,
  },
  {
    title: '名称',
    align: 'center',
    sorter: true,
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '描述',
    align: 'center',
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
    label: '名称',
    field: 'name',
    component: 'JInput',
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
      dict: 'bas_product_group,name,id',
      pidField: 'pid',
      pidValue: '0',
      hasChildField: 'has_child',
      condition: '{ "sys_org_code": "#{sys_org_code}%" }',
    },
  },
  {
    label: '编码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入编码!' }];
    },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入名称!' }];
    },
  },
  {
    label: '描述',
    field: 'description',
    component: 'Input',
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
