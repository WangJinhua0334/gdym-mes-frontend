import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';
import { getWeekMonthQuarterYear } from '/@/utils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '保养单号',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '车间',
    align: 'center',
    dataIndex: 'workShopId_dictText',
  },
  {
    title: '模具',
    align: 'center',
    dataIndex: 'mouldId_dictText',
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    customRender: ({ text }) => {
      return render.renderDict(text, 'mod_maintain_status', true);
    },
  },
  {
    title: '计划保养日期',
    align: 'center',
    dataIndex: 'planOperateTime',
  },
  {
    title: '计划保养人',
    align: 'center',
    dataIndex: 'planOperateBy_dictText',
  },
  {
    title: '实际保养日期',
    align: 'center',
    dataIndex: 'acOperateTime',
  },
  {
    title: '实际保养人',
    align: 'center',
    dataIndex: 'acOperateBy_dictText',
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
];
//查询数据
export const searchFormSchema: FormSchema[] =  [
  {
    label: '车间',
    field: 'workShopId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workshop/basWorkShop/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' /*, code: '${code}'*/ },
        columns: [
          {
            name: '编码',
            code: 'code',
          },
          {
            name: '名称',
            code: 'name',
          },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        pageSize: 10,
        multi: true,
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    label: '模具',
    field: 'mouldQuery',
    component: 'Input',
  },
  {
    label: '状态',
    field: 'status',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'mod_maintain_status',
    },
  },
  {
    label: '保养单号',
    field: 'code',
    component: 'JInput',
  },
  {
    label: '计划点检日期',
    field: 'planOperateTimeRange',
    component: 'RangePicker',
    componentProps: {
      // 传给后端的时间格式
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      showTime: true,
      width: '100%',
      getPopupContainer: () => document.body,
    },
  },
  {
    label: '实际点检日期',
    field: 'acOperateTimeRange',
    component: 'RangePicker',
    componentProps: {
      // 传给后端的时间格式
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      showTime: true,
      width: '100%',
      getPopupContainer: () => document.body,
    },
  },
];
//表单数据
export const addFormSchema: FormSchema[] = [
  {
    label: '模具',
    field: 'mouldId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/mod/type/listModMouldByMainId',
        params: {
          isEnable: 'Y',
        },
        columns: [
          {
            title: '模具编码',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '模具描述',
            align: 'center',
            dataIndex: 'name',
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status_dictText',
          },
          {
            title: '存放位置',
            align: 'center',
            dataIndex: 'location',
          },
        ],
        queryInfo: [
          {
            field: 'code',
            label: '编码',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'name',
            label: '描述',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['code', 'name'],
        placeholder: '请选择',
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择模具!' }];
    },
  },
  {
    label: '车间',
    field: 'workShopId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/workshop/basWorkShop/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' /*, code: '${code}'*/ },
        columns: [
          {
            name: '编码',
            code: 'code',
          },
          {
            name: '名称',
            code: 'name',
          },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        pageSize: 10,
        //multi: true,
        //maxTagCount: 2,
        getPopupContainer: () => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择车间!' }];
    },
  },
  {
    label: '计划保养日期',
    field: 'planOperateTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请选择计划保养日期!' }];
    },
  },
  {
    label: '计划保养人',
    field: 'planOperateBy',
    component: 'JSelectUser',
    componentProps: {
      maxTagCount: 1,
      isRadioSelection: true,
    },
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请选择保养人!' }];
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
//子表单数据
//子表列表数据
export const modMouldMaintainRecItemColumns: BasicColumn[] = [
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
  {
    title: '结果',
    align: 'center',
    dataIndex: 'result',
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '附件',
    align: 'center',
    dataIndex: 'attachments',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
];
//子表表格配置
export const addModMouldMaintainRecItemJVxeColumns: JVxeColumn[] = [
  {
    title: '保养计划',
    key: 'planId',
    type: JVxeTypes.hidden,
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
    width: '150px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '保养位置',
    key: 'location',
    type: JVxeTypes.input,
    width: '150px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '保养方式',
    key: 'method',
    type: JVxeTypes.input,
    width: '150px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '保养标准',
    key: 'standard',
    type: JVxeTypes.input,
    width: '150px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '备注',
    key: 'remark',
    type: JVxeTypes.input,
    width: '150px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '保养单号',
    field: 'code',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '车间',
    field: 'workShopId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '模具',
    field: 'mouldId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '状态',
    field: 'status_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '计划保养日期',
    field: 'planOperateTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dynamicDisabled: true,
  },
  {
    label: '计划保养人',
    field: 'planOperateBy_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '实际保养日期',
    field: 'acOperateTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请选择实际保养日期!' }];
    },
  },
  {
    label: '实际保养人',
    field: 'acOperateBy',
    component: 'JSelectUser',
    componentProps: {
      maxTagCount: 1,
      isRadioSelection: true,
    },
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请选择点检人!' }];
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'Input',
  },
  {
    label: '',
    field: 'mouldId',
    component: 'Input',
    show: false,
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
//子表表格配置
export const modMouldMaintainRecItemJVxeColumns: JVxeColumn[] = [
  {
    title: '保养计划',
    key: 'planId',
    type: JVxeTypes.hidden,
  },
  {
    title: '编码',
    key: 'code',
    type: JVxeTypes.input,
    width: '100px',
    placeholder: '请输入${title}',
    disabled: true,
  },
  {
    title: '名称',
    key: 'name',
    type: JVxeTypes.input,
    width: '150px',
    placeholder: '请输入${title}',
    disabled: true,
  },
  {
    title: '保养位置',
    key: 'location',
    type: JVxeTypes.input,
    width: '150px',
    placeholder: '请输入${title}',
    disabled: true,
  },
  {
    title: '保养方式',
    key: 'method',
    type: JVxeTypes.input,
    width: '150px',
    placeholder: '请输入${title}',
    disabled: true,
  },
  {
    title: '保养标准',
    key: 'standard',
    type: JVxeTypes.input,
    width: '150px',
    placeholder: '请输入${title}',
    disabled: true,
  },
  {
    title: '结果',
    key: 'result',
    type: JVxeTypes.slot,
    align: 'center',
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    slotName: 'mustSwitch',
    width: '130px',
    placeholder: '请输入${title}',
  },
  {
    title: '附件',
    key: 'attachments',
    type: JVxeTypes.file,
    width: '140px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '备注',
    key: 'remark',
    type: JVxeTypes.input,
    width: '150px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
];
// 高级查询数据
export const superQuerySchema = {
  mouldId: { title: '设备', order: 0, view: 'text', type: 'string' },
  code: { title: '保养单号', order: 1, view: 'text', type: 'string' },
  status: { title: '状态', order: 2, view: 'text', type: 'string' },
  planOperateTime: { title: '计划保养日期', order: 3, view: 'datetime', type: 'string' },
  planOperateBy: { title: '计划保养人', order: 4, view: 'text', type: 'string' },
  acOperateTime: { title: '实际保养日期', order: 5, view: 'datetime', type: 'string' },
  acOperateBy: { title: '实际保养人', order: 6, view: 'text', type: 'string' },
  remark: { title: '备注', order: 7, view: 'text', type: 'string' },
  workShopId: { title: '车间', order: 8, view: 'text', type: 'string' },
  //子表高级查询
  modMouldMaintainRecItem: {
    title: '模具保养计划项目表',
    view: 'table',
    fields: {
      planId: { title: '保养计划', order: 0, view: 'text', type: 'string' },
      code: { title: '编码', order: 1, view: 'text', type: 'string' },
      name: { title: '名称', order: 2, view: 'text', type: 'string' },
      location: { title: '保养位置', order: 3, view: 'text', type: 'string' },
      method: { title: '保养方式', order: 4, view: 'text', type: 'string' },
      standard: { title: '保养标准', order: 5, view: 'text', type: 'string' },
      result: { title: '结果', order: 6, view: 'text', type: 'string' },
      attachments: { title: '附件', order: 7, view: 'text', type: 'string' },
      remark: { title: '备注', order: 8, view: 'text', type: 'string' },
    },
  },
};

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
