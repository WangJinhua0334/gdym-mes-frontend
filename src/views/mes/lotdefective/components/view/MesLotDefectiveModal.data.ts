import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';

//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '不良单号',
    field: 'code',
    component: 'Input',
  },
  {
    label: '流转卡/序列号',
    field: 'lotSn',
    component: 'Input',
  },
  {
    label: '数量',
    field: 'lotQty',
    component: 'InputNumber',
  },

  {
    label: '工单',
    field: 'moId_dictText',
    component: 'Input',
  },
  {
    label: '来源类型',
    field: 'sourceType_dictText',
    component: 'Input',
  },
  {
    label: '来源单号',
    field: 'sourceCode',
    component: 'Input',
  },
  {
    label: '任务单',
    field: 'moPlanId_dictText',
    component: 'Input',
  },
  {
    label: '工艺工序',
    field: 'wfsId_dictText',
    component: 'Input',
  },
  {
    label: '工序',
    field: 'stationId_dictText',
    component: 'Input',
  },

  {
    label: '缺陷代码',
    field: 'defectId_dictText',
    component: 'Input',
  },
  {
    label: '缺陷数量',
    field: 'defectQty',
    component: 'Input',
  },
  {
    label: '缺陷备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '检验人',
    field: 'inspBy_dictText',
    component: 'Input',
  },
  {
    label: '检验时间',
    field: 'inspTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '状态',
    field: 'status_dictText',
    component: 'Input',
  },
  {
    label: '处理方式',
    field: 'handleMethod_dictText',
    component: 'Input',
  },
  {
    label: '报废数量',
    field: 'scrapQty',
    component: 'Input',
  },

  {
    label: '处理人',
    field: 'handleBy_dictText',
    component: 'Input',
  },
  {
    label: '处理时间',
    field: 'handleTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '处理意见',
    field: 'handleDesc',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },

  {
    label: '附件',
    field: 'attachments',
    component: 'JUpload',
    componentProps: {
      maxCount: 10,
    },
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
