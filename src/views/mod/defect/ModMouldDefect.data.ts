import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
  // {
  //   title: '父级节点',
  //   align: 'center',
  //   dataIndex: 'pid',
  // },
  // {
  //   title: '是否有子节点',
  //   align: 'center',
  //   dataIndex: 'hasChild',
  // },
  {
    title: '分类代码',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '分类描述',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: '分类名称',
    align: 'center',
    dataIndex: 'name',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '分类代码',
    field: 'code',
    component: 'JInput',
  },
  {
    label: '分类名称',
    field: 'name',
    component: 'JInput',
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '父级节点',
    field: 'pid',
    component: 'JTreeSelect',
    componentProps: {
      dict: 'mod_mould_defect,name,id',
      pidField: 'pid',
      pidValue: '0',
      hasChildField: 'has_child',
    },
  },
  // {
  //   label: '是否有子节点',
  //   field: 'hasChild',
  //   component: 'Input',
  // },
  {
    label: '分类代码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入分类代码!' }];
    },
  },
  {
    label: '分类名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入分类代码!' }];
    },
  },
  {
    label: '分类描述',
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

// 高级查询数据
export const superQuerySchema = {
  code: { title: '分类代码', order: 2, view: 'text', type: 'string' },
  name: { title: '分类名称', order: 4, view: 'text', type: 'string' },
  description: { title: '分类描述', order: 3, view: 'text', type: 'string' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
