import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '报废单号',
    field: 'code',
    component: 'Input',
  },
  {
    label: '工单',
    field: 'moId_dictText',
    component: 'Input',
  },
  {
    label: '生产任务',
    field: 'moPlanId_dictText',
    component: 'Input',
  },
  {
    label: '产品编码',
    field: 'prodId_dictText',
    component: 'Input',
  },
  {
    label: '产品名称',
    field: 'prodName_dictText',
    component: 'Input',
  },
  {
    label: '来源',
    field: 'scrapType_dictText',
    component: 'Input',
  },
  {
    label: '来源单号',
    field: 'lotInspId_dictText',
    component: 'Input',
  },
  {
    label: '缺陷',
    field: 'defectId_dictText',
    component: 'Input',
  },
  {
    label: '缺陷数量',
    field: 'defectQty',
    component: 'Input',
  },
  {
    label: '报废数量',
    field: 'scrapQty',
    component: 'Input',
  },

  {
    label: '流转卡号',
    field: 'lotSn',
    component: 'Input',
  },
  {
    label: '工序',
    field: 'wfsId_dictText',
    component: 'Input',
  },
  {
    label: '状态',
    field: 'status_dictText',
    component: 'Input',
  },

  {
    label: '报废原因',
    field: 'scrapReason',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '提交人',
    field: 'submitBy_dictText',
    component: 'Input',
  },
  {
    label: '提交时间',
    field: 'submitTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '结果',
    field: 'result_dictText',
    component: 'Input',
  },
  {
    label: '审核人',
    field: 'checkBy_dictText',
    component: 'Input',
  },
  {
    label: '审核时间',
    field: 'checkTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '审核备注',
    field: 'checkRemark',
    component: 'InputTextArea',
    colProps: { span: 24 },
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
