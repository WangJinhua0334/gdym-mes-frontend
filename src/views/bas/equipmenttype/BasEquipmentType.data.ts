import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code',
    width: 200,
  },
  {
    title: '名称',
    align: 'center',
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

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
