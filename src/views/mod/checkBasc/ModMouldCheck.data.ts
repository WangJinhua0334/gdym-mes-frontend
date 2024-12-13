import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '是否启用',
    align: 'center',
    dataIndex: 'isEnable',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '点检周期(天)',
    align: 'center',
    dataIndex: 'cycle',
  },
  {
    title: '提前预警(时)',
    align: 'center',
    dataIndex: 'alarm',
  },
  {
    title: '责任人',
    align: 'center',
    dataIndex: 'responsibleBy_dictText',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '编码',
    field: 'code',
    component: 'JInput',
  },
  {
    label: '名称',
    field: 'name',
    component: 'JInput',
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
    label: '点检周期(天)',
    field: 'cycle',
    component: 'InputNumber',
    defaultValue: 10,
  },
  {
    label: '提前预警(时)',
    field: 'alarm',
    component: 'InputNumber',
    defaultValue: 24,
  },
  {
    label: '责任人',
    field: 'responsibleBy',
    component: 'JSelectUser',
    componentProps: {
      maxTagCount: 1,
      isRadioSelection: true,
    },
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请选择责任人!' }];
    },
  },
  {
    label: '是否启用',
    field: 'isEnable',
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
//子表单数据
//子表列表数据
export const modMouldCheckItemColumns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '点检位置',
    align: 'center',
    dataIndex: 'location',
  },
  {
    title: '点检方式',
    align: 'center',
    dataIndex: 'method',
  },
  {
    title: '点检标准',
    align: 'center',
    dataIndex: 'standard',
  },
];
//子表表格配置
export const modMouldCheckItemJVxeColumns: JVxeColumn[] = [
  {
    title: '方案Id',
    key: 'checkId',
    type: JVxeTypes.hidden,
    width: '200px',
  },
  {
    title: '编码',
    key: 'code',
    type: JVxeTypes.input,
    width: '150px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '名称',
    key: 'name',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '点检位置',
    key: 'location',
    type: JVxeTypes.input,
    width: '180px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '点检方式',
    key: 'method',
    type: JVxeTypes.input,
    width: '180px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '点检标准',
    key: 'standard',
    type: JVxeTypes.input,
    width: '180px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
];

// 高级查询数据
export const superQuerySchema = {
  code: { title: '编码', order: 0, view: 'text', type: 'string' },
  name: { title: '名称', order: 1, view: 'text', type: 'string' },
  isEnable: { title: '是否启用', order: 2, view: 'textarea', type: 'string' },
  cycle: { title: '点检周期', order: 3, view: 'number', type: 'number' },
  alarm: { title: '提前预警', order: 4, view: 'number', type: 'number' },
  responsibleBy: { title: '责任人', order: 5, view: 'text', type: 'string' },
  //子表高级查询
  modMouldCheckItem: {
    title: '模具点检方案项目',
    view: 'table',
    fields: {
      code: { title: '编码', order: 1, view: 'text', type: 'string' },
      name: { title: '名称', order: 2, view: 'text', type: 'string' },
      location: { title: '点检位置', order: 3, view: 'text', type: 'string' },
      method: { title: '点检方式', order: 4, view: 'text', type: 'string' },
      standard: { title: '点检标准', order: 5, view: 'text', type: 'string' },
    },
  },
};
//模具数据
export const modMouldColumns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '描述',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '是否启用',
    align: 'center',
    dataIndex: 'isEnable',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '存放位置',
    align: 'center',
    dataIndex: 'location',
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return render.renderDict(text, 'mod_status', true);
    },
  },
  {
    title: '是否自动生成点检计划',
    align: 'center',
    dataIndex: 'isAutoCheckPlan',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '点检状态',
    align: 'center',
    dataIndex: 'checkStatus',
    customRender: ({ text }) => {
      return render.renderDict(text, 'mod_check_status', true);
    },
  },
  {
    title: '点检次数',
    align: 'center',
    dataIndex: 'checkTimes',
  },
  {
    title: '点检时间',
    align: 'center',
    dataIndex: 'checkTime',
  },
  {
    title: '下次点检时间',
    align: 'center',
    dataIndex: 'checkNextTime',
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
