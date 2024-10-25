import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '策略编码',
    align: 'center',
    dataIndex: 'code',
    width: 150,
  },
  {
    title: '策略名称',
    align: 'center',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '部门',
    align: 'center',
    dataIndex: 'deptId_dictText',
    width: 150,
  },
  {
    title: '策略内容',
    align: 'center',
    dataIndex: 'content',
    width: 150,
  },
  {
    title: '策略周期(月/次)',
    align: 'center',
    dataIndex: 'cycleTimes',
    width: 150,
  },
  {
    title: '策略方式',
    align: 'center',
    dataIndex: 'strategyMethod_dictText',
    width: 150,
  },
  {
    title: '是否启用',
    align: 'center',
    dataIndex: 'isEnable',
    width: 120,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '策略编码',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '策略名称',
    field: 'name',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '责任部门',
    field: 'deptId',
    component: 'JSelectDept',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue } = formActionType;
      return {
        sync: true,
        multiple: false,
      };
    },
  },
  {
    label: '策略方式',
    field: 'strategyMethod',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'pis_strategy_method',
    },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '策略编码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入策略编码!' }];
    },
  },
  {
    label: '策略名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入策略名称!' }];
    },
  },
  {
    label: '责任部门',
    field: 'deptId',
    component: 'JSelectDept',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue } = formActionType;
      return {
        sync: true,
        multiple: false,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择部门!' }];
    },
  },
  {
    label: '策略内容',
    field: 'content',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入策略内容!' }];
    },
  },
  {
    label: '策略周期(月/次)',
    field: 'cycleTimes',
    component: 'InputNumber',
    defaultValue: 1,
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入策略周期(月/次)!' }];
    },
  },
  {
    label: '策略方式',
    field: 'strategyMethod',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'pis_strategy_method',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择策略方式!' }];
    },
  },
  {
    label: '是否启用',
    field: 'isEnable',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: { dictCode: 'is_open' },
  },
  {
    label: '备注',
    field: 'remark',
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
