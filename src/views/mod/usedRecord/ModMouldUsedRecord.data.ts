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
  },
  {
    title: '设备',
    align: 'center',
    dataIndex: 'equipId_dictText',
  },
  {
    title: '工位',
    align: 'center',
    dataIndex: 'wkpId_dictText',
  },
  {
    title: '上模人',
    align: 'center',
    dataIndex: 'startBy_dictText',
  },
  {
    title: '上模时间',
    align: 'center',
    dataIndex: 'startTime',
  },
  {
    title: '可用模穴数',
    align: 'center',
    dataIndex: 'cavityOk',
  },
  {
    title: '下模人',
    align: 'center',
    dataIndex: 'endBy_dictText',
  },
  {
    title: '下模时间',
    align: 'center',
    dataIndex: 'endTime',
  },
  {
    title: '使用次数',
    align: 'center',
    dataIndex: 'usedCount',
  },
  {
    title: '产量',
    align: 'center',
    dataIndex: 'production',
  },
  {
    title: '时长(小时)',
    align: 'center',
    dataIndex: 'duration',
  },
  {
    title: '是否下模',
    align: 'center',
    dataIndex: 'isLower',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '是否完好',
    align: 'center',
    dataIndex: 'isOk',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '是否保养',
    align: 'center',
    dataIndex: 'isMaintain',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '保养日期',
    align: 'center',
    dataIndex: 'maintainDate',
  },
  {
    title: '是否点检',
    align: 'center',
    dataIndex: 'isCheck',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '点检日期',
    align: 'center',
    dataIndex: 'checkDate',
  },
  {
    title: '上模文件',
    align: 'center',
    dataIndex: 'upperFile',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '下模文件',
    align: 'center',
    dataIndex: 'lowerFile',
    slots: { customRender: 'fileSlot' },
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
    label: '模具',
    field: 'mouldQuery',
    component: 'Input',
  },
  {
    label: '设备',
    field: 'equipQuery',
    component: 'Input',
  },
  {
    label: '工位',
    field: 'wkpQuery',
    component: 'Input',
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '模具',
    field: 'mouldId',
    component: 'Input',
    ifShow: false,
  },
  {
    label: '模具',
    field: 'mouldCode',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请扫描模具!' }];
    },
  },
  {
    label: '模具',
    field: 'mouldName',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '设备',
    field: 'equipId',
    component: 'Input',
    ifShow: false,
  },
  {
    label: '设备',
    field: 'equipCode',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请扫描设备!' }];
    },
  },
  {
    label: '设备',
    field: 'equipName',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '工位',
    field: 'wkpId',
    component: 'Input',
    ifShow: false,
  },
  {
    label: '工位',
    field: 'wkpIdName',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '可用模穴数',
    field: 'cavityOk',
    component: 'InputNumber',
  },
  {
    label: '使用次数',
    field: 'usedCount',
    component: 'InputNumber',
  },
  {
    label: '产量',
    field: 'production',
    component: 'InputNumber',
  },
  {
    label: '是否完好',
    field: 'isOk',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '是否保养',
    field: 'isMaintain',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '保养日期',
    field: 'maintainDate',
    component: 'DatePicker',
    componentProps: {
      showTime: false,
      valueFormat: 'YYYY-MM-DD',
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: '是否点检',
    field: 'isCheck',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '点检日期',
    field: 'checkDate',
    component: 'DatePicker',
    componentProps: {
      showTime: false,
      valueFormat: 'YYYY-MM-DD',
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: '上模文件',
    field: 'upperFile',
    component: 'JUpload',
  },
  {
    label: '下模文件',
    field: 'lowerFile',
    component: 'JUpload',
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

// 高级查询数据
export const superQuerySchema = {
  mouldId: { title: '模具', order: 0, view: 'text', type: 'string' },
  equipId: { title: '设备', order: 1, view: 'text', type: 'string' },
  wkpId: { title: '工位', order: 2, view: 'textarea', type: 'string' },
  startBy: { title: '上模人', order: 3, view: 'text', type: 'string' },
  startTime: { title: '上模时间', order: 4, view: 'datetime', type: 'string' },
  cavityOk: { title: '可用模穴数 上时的模穴数', order: 5, view: 'number', type: 'number' },
  endBy: { title: '下模人', order: 6, view: 'text', type: 'string' },
  endTime: { title: '下模时间', order: 7, view: 'datetime', type: 'string' },
  usedCount: { title: '使用次数 下模时的使用次数', order: 8, view: 'number', type: 'number' },
  production: { title: '产量', order: 9, view: 'number', type: 'number' },
  duration: { title: '时长 小时', order: 10, view: 'number', type: 'number' },
  isLower: { title: '是否下模', order: 11, view: 'text', type: 'string' },
  isOk: { title: '是否完好', order: 12, view: 'text', type: 'string' },
  isMaintain: { title: '是否保养', order: 13, view: 'text', type: 'string' },
  maintainDate: { title: '保养日期', order: 14, view: 'datetime', type: 'string' },
  isCheck: { title: '是否点检', order: 15, view: 'text', type: 'string' },
  checkDate: { title: '点检日期', order: 16, view: 'datetime', type: 'string' },
  remark: { title: '备注', order: 19, view: 'text', type: 'string' },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
