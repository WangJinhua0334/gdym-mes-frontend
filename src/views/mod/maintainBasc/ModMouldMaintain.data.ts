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
    title: '保养周期(天)',
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
    label: '保养周期(天)',
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
export const modMouldMaintainItemColumns: BasicColumn[] = [
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
    title: '保养位置',
    align: 'center',
    dataIndex: 'location',
  },
  {
    title: '保养方式',
    align: 'center',
    dataIndex: 'method',
  },
  {
    title: '保养标准',
    align: 'center',
    dataIndex: 'standard',
  },
];
//子表表格配置
export const modMouldMaintainItemJVxeColumns: JVxeColumn[] = [
  {
    title: '方案id',
    key: 'maintainId',
    type: JVxeTypes.hidden,
    width: '150px',
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
    title: '保养位置',
    key: 'location',
    type: JVxeTypes.input,
    width: '180px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '保养方式',
    key: 'method',
    type: JVxeTypes.input,
    width: '180px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '保养标准',
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
  isEnable: { title: '是否启用 是否启用', order: 2, view: 'textarea', type: 'string' },
  cycle: { title: '保养周期 保养周期（天）', order: 3, view: 'number', type: 'number' },
  alarm: { title: '提前预警 提前预警（小时）', order: 4, view: 'number', type: 'number' },
  responsibleBy: { title: '责任人', order: 5, view: 'text', type: 'string' },
  //子表高级查询
  modMouldMaintainItem: {
    title: '模具保养方案项目',
    view: 'table',
    fields: {
      maintainId: { title: '方案Id', order: 0, view: 'text', type: 'string' },
      code: { title: '编码', order: 1, view: 'text', type: 'string' },
      name: { title: '名称', order: 2, view: 'text', type: 'string' },
      location: { title: '保养位置', order: 3, view: 'text', type: 'string' },
      method: { title: '保养方式', order: 4, view: 'text', type: 'string' },
      standard: { title: '保养标准', order: 5, view: 'text', type: 'string' },
    },
  },
};

//模具详情数据
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
    title: '是否自动生成保养计划',
    align: 'center',
    dataIndex: 'isAutoMaintainPlan',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '保养状态',
    align: 'center',
    dataIndex: 'maintainStatus',
    customRender: ({ text }) => {
      return render.renderDict(text, 'mod_maintain_status', true);
    },
  },
  {
    title: '保养次数',
    align: 'center',
    dataIndex: 'maintainTimes',
  },
  {
    title: '保养时间',
    align: 'center',
    dataIndex: 'maintainTime',
  },
  {
    title: '下次保养时间',
    align: 'center',
    dataIndex: 'maintainNextTime',
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
