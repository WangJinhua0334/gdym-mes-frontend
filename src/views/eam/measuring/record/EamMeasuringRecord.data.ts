import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '量具编号',
    align: 'center',
    dataIndex: 'measuringCode_dictText',
    width: 150,
  },
  {
    title: '量具',
    align: 'center',
    dataIndex: 'measuringId_dictText',
    width: 150,
  },
  {
    title: '事件代码',
    align: 'center',
    dataIndex: 'eventCode_dictText',
    width: 150,
  },
  {
    title: '操作人',
    align: 'center',
    dataIndex: 'operateBy_dictText',
    width: 150,
  },
  {
    title: '操作时间',
    align: 'center',
    dataIndex: 'operateTime',
    width: 150,
    customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '量具名称',
    field: 'queryMeasuringName',
    component: 'Input',
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '量具',
    field: 'measuringId_dictText',
    component: 'Input',
  },
  {
    label: '事件代码',
    field: 'eventCode_dictText',
    component: 'Input',
  },
  {
    label: '操作人',
    field: 'operateBy_dictText',
    component: 'Input',
  },
  {
    label: '操作时间',
    field: 'operateTime',
    component: 'DatePicker',
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
