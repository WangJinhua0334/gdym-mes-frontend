import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '抽样标准编码',
    align: 'center',
    sorter: true,
    width: 150,
    dataIndex: 'code',
  },
  {
    title: '抽样标准描述',
    align: 'center',
    sorter: true,
    dataIndex: 'description',
  },
  {
    title: '是否启用',
    align: 'center',
    sorter: true,
    width: 150,
    dataIndex: 'isEnable',
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
    label: '抽样标准编码',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '抽样标准描述',
    field: 'description',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '是否启用',
    field: 'isEnable',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'is_open',
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '抽样标准编码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入抽样标准编码!' }];
    },
  },
  {
    label: '抽样标准描述',
    field: 'description',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入抽样标准描述!' }];
    },
  },
  {
    label: '是否启用',
    field: 'isEnable',
    component: 'JSwitch',
    componentProps: {},
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
