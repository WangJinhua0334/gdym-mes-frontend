import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
  },
  {
    title: '名称',
    align: 'center',
    sorter: true,
    dataIndex: 'name',
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: '位置',
    align: 'center',
    sorter: true,
    dataIndex: 'location',
  },
  {
    title: '是否锁定',
    align: 'center',
    dataIndex: 'isLock',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
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
  {
    label: '是否锁定',
    field: 'isLock',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
      checkedChildren: '是',
      unCheckedChildren: '否',
    },
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
    component: 'Input',
  },
  {
    label: '位置',
    field: 'location',
    component: 'Input',
  },
  {
    label: '是否锁定',
    field: 'isLock',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
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

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
