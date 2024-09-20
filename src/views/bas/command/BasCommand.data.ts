import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '代码',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '名称',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '动作',
    align: 'center',
    dataIndex: 'actionName_dictText',
  },
  {
    title: '是否启用',
    align: 'center',
    dataIndex: 'isEnable_dictText',
    /*customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y' },
        { text: '否', value: 'N' },
      ]);
    },*/
  },
  {
    title: '顺序',
    align: 'center',
    dataIndex: 'pageNumber',
    slots: { customRender: 'pageSeq' },
  },
  {
    title: '组件',
    align: 'center',
    dataIndex: 'component',
  },
  // {
  //  title: '展示位置',
  //  align:"center",
  //  dataIndex: 'location_dictText'
  // },
  {
    title: '展示位置（宽 * 高）',
    align: 'center',
    dataIndex: 'width',
    slots: { customRender: 'sizeSlot' },
  },
  // {
  //  title: '高度',
  //  align:"center",
  //  dataIndex: 'height'
  // },
  /*{
    title: '显示页头',
    align: 'center',
    dataIndex: 'isShowHeader_dictText',
  },*/
  /*{
    title: '显示页脚',
    align: 'center',
    dataIndex: 'isShowFooter_dictText',
  },*/
  /*{
    title: '自动加载',
    align: 'center',
    dataIndex: 'isAutoLoad_dictText',
  },*/
  // {
  //  title: '状态JS脚本',
  //  align:"center",
  //  dataIndex: 'script'
  // },
  // {
  //  title: '状态服务',
  //  align:"center",
  //  dataIndex: 'service'
  // },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '代码',
    field: 'code',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '动作',
    field: 'actionId',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'bas_action,name,id',
    },
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '代码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入代码!' }, { ...rules.duplicateCheckRule('bas_command', 'code', model, schema)[0] }];
    },
    colProps: { span: 24 },
  },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入名称!' }];
    },
    colProps: { span: 24 },
  },
  {
    label: '动作',
    field: 'actionId',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'bas_action,name,id',
    },
    colProps: { span: 24 },
  },
  {
    label: '是否启用',
    field: 'isEnable',
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: { dictCode: 'is_open' },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入是否启用!' }];
    },
    colProps: { span: 24 },
  },
  {
    label: '权限代码',
    field: 'authCode',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '组件',
    field: 'component',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '页码',
    field: 'pageNumber',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入页面!' }];
    },
  },
  {
    label: '顺序',
    field: 'sequence',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入顺序!' }];
    },
  },
  {
    label: '图标',
    field: 'icon',
    component: 'IconPicker',
  },
  {
    label: '展示位置',
    field: 'location',
    component: 'JDictSelectTag',
    componentProps: { dictCode: 'workbench_command_location' },
    defaultValue: 'center',
  },
  {
    label: '宽度',
    field: 'width',
    component: 'InputNumber',
    defaultValue: 800,
  },
  {
    label: '高度',
    field: 'height',
    component: 'InputNumber',
    defaultValue: 500,
  },

  {
    label: '显示页头',
    field: 'isShowHeader',
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    show: false,
  },
  {
    label: '显示页脚',
    field: 'isShowFooter',
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    show: false,
  },
  {
    label: '自动加载',
    field: 'isAutoLoad',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    show: false,
  },
  {
    label: '状态服务',
    field: 'service',
    component: 'Input',
    colProps: { span: 24 },
  },
  {
    label: '状态JS脚本',
    field: 'script',
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
