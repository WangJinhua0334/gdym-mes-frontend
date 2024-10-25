import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '逾期单号',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '工单',
    align: 'center',
    dataIndex: 'moId_dictText',
  },
  {
    title: '产品',
    align: 'center',
    dataIndex: 'prodId_dictText',
  },
  {
    title: '产品名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return render.renderDict(text, 'mes_overdue_status', true);
    },
  },
  {
    title: '逾期类型',
    align: 'center',
    dataIndex: 'overdueType_dictText',
  },
  {
    title: '逾期说明',
    align: 'center',
    dataIndex: 'overdueDesc',
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
    label: '产品',
    field: 'prodQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '工单号',
    field: 'moQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '逾期类型',
    field: 'overdueType',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'mes_overdue_type',
    },
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'status',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'mes_overdue_status',
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '逾期单号',
    field: 'code',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '工单',
    field: 'moId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '产品',
    field: 'prodId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '产品名称',
    field: 'prodName_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '逾期类型',
    field: 'overdueType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'mes_overdue_type',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择逾期类型!' }];
    },
  },
  {
    label: '逾期说明',
    field: 'overdueDesc',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入逾期说明!' }];
    },
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
