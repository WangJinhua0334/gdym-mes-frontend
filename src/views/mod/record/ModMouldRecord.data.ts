import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '模具',
    align: 'center',
    dataIndex: 'mouldId_dictText',
    width: 300,
  },
  {
    title: '事件代码',
    align: 'center',
    dataIndex: 'eventCode',
    customRender: ({ text }) => {
      return render.renderDict(text, 'mod_event_code', true);
    },
    width: 120,
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
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
    width: 300,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '模具',
    field: 'mouldQuery',
    component: 'Input',
  },
  {
    label: '操作人',
    field: 'userQuery',
    component: 'Input',
  },
  {
    label: '事件代码',
    field: 'eventCode',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'mod_event_code',
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'JInput',
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '模具',
    field: 'mouldId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '事件代码',
    field: 'eventCode_dictText',
    component: 'Input',
    dynamicDisabled: true,
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
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '备注',
    field: 'remark',
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
  mouldId: { title: '模具', order: 0, view: 'text', type: 'string' },
  eventCode: { title: '事件代码', order: 1, view: 'text', type: 'string' },
  operateBy: { title: '操作人', order: 2, view: 'text', type: 'string' },
  operateTime: { title: '操作时间', order: 3, view: 'datetime', type: 'string' },
  remark: { title: '备注', order: 4, view: 'text', type: 'string' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
