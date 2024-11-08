import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '指标编码',
    align: 'center',
    dataIndex: 'code',
    width: 120,
  },
  {
    title: '指标名称',
    align: 'center',
    dataIndex: 'name',
    width: 250,
  },
  {
    title: '部门',
    align: 'center',
    dataIndex: 'deptId_dictText',
    width: 150,
  },
  {
    title: '产品',
    align: 'center',
    dataIndex: 'prodId_dictText',
    width: 150,
  },
  {
    title: '产品名称',
    align: 'center',
    dataIndex: 'prodName_dictText',
    width: 150,
  },
  {
    title: '指标',
    align: 'center',
    dataIndex: 'indexes_dictText',
    width: 150,
  },
  {
    title: '周期类型',
    align: 'center',
    dataIndex: 'cycleType',
    width: 100,
    customRender: ({ text }) => {
      return render.renderDict(text, 'mes_cycle_type', true);
    },
  },
  {
    title: '周期范围',
    align: 'center',
    dataIndex: 'cycleDate',
    width: 100,
  },
  {
    title: '设定值',
    align: 'center',
    dataIndex: 'standardValue',
    width: 100,
    format(text, record, index) {
      return text ? text.toString() + record.suffix : '0' + record.suffix;
    },
  },
  {
    title: '当前值',
    align: 'center',
    dataIndex: 'nowValue',
    width: 100,
    format(text, record, index) {
      return text ? text.toString() + record.suffix : '0' + record.suffix;
    },
  },
  {
    title: '提醒规则',
    align: 'center',
    dataIndex: 'rules',
    width: 100,
    customRender: ({ text }) => {
      return render.renderDict(text, 'mes_indexs_rules', true);
    },
  },
  {
    title: '通知人',
    align: 'center',
    dataIndex: 'noticeBy_dictText',
    width: 150,
  },
  {
    title: '是否启用',
    align: 'center',
    dataIndex: 'isEnable',
    width: 120,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '是否首页展示',
    align: 'center',
    dataIndex: 'isHome',
    width: 120,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
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
    label: '指标编码',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '指标名称',
    field: 'name',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '产品',
    field: 'prodQuery',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '责任部门',
    field: 'deptId',
    component: 'JSelectDept',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue } = formActionType;
      return {
        sync: true,
        multiple: false,
      };
    },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '指标编码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入策略编码!' }];
    },
    colProps: { span: 12 },
  },
  {
    label: '指标名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入策略名称!' }];
    },
    colProps: { span: 12 },
  },
  {
    label: '责任部门',
    field: 'deptId',
    component: 'JSelectDept',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue } = formActionType;
      return {
        sync: true,
        multiple: false,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择部门!' }];
    },
    colProps: { span: 12 },
  },
  {
    label: '产品编码',
    field: 'prodId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/product/basProduct/list',
        params: {
          status: 'enable',
        },
        columns: [
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
            title: '版本',
            align: 'center',
            dataIndex: 'version',
          },
          {
            title: '规格',
            align: 'center',
            dataIndex: 'specification',
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
            label: '名称',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['code', 'version'],
        linkmap: [{ name: 'prodName_dictText' }],
        placeholder: '请选择',
      };
    },
    colProps: { span: 12 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择产品!' }];
    },
  },
  {
    label: '产品名称',
    field: 'prodName_dictText',
    component: 'Input',
    dynamicDisabled: true,
    colProps: { span: 12 },
  },
  {
    label: '指标',
    field: 'indexes',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'mes_indexes',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择指标!' }];
    },
    colProps: { span: 12 },
  },
  {
    label: '周期类型',
    field: 'cycleType',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'mes_cycle_type',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择周期类型' }];
    },
    colProps: { span: 12 },
  },
  {
    label: '周期范围',
    field: 'cycleDate',
    component: 'RangeDate',
    componentProps: {
      //是否显示时间
      showTime: false,
      //日期格式化
      format: 'YYYY-MM-DD',
      //范围文本描述用集合
      placeholder: ['请选择开始日期', '请选择结束日期'],
      getPopupContainer: (node) => document.body,
    },
    colProps: { span: 12 },
    dynamicDisabled: ({ model, schema }) => {
      return model.cycleType != 'other';
    },
  },
  {
    label: '设定值',
    field: 'standardValue',
    defaultValue: 1,
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入设定值!' }];
    },
    colProps: { span: 12 },
  },
  {
    label: '后缀',
    field: 'suffix',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入后缀!' }];
    },
    colProps: { span: 12 },
  },
  {
    label: '提醒规则',
    field: 'rules',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'mes_indexs_rules',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择提醒规则!' }];
    },
    colProps: { span: 12 },
  },
  {
    label: '通知人',
    field: 'noticeBy',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sys/user/list',
        params: { order: 'asc', searchFields: 'username,realname,workNo' },
        columns: [
          {
            name: '账号',
            code: 'username',
          },
          {
            name: '姓名',
            code: 'realname',
          },
          {
            name: '工号',
            code: 'workNo',
          },
        ],
        isShowNum: false,
        rowKey: 'username',
        labelKey: ['realname'],
        placeholder: '请输入',
        multi: true,
        queryBefore: (params) => {
          return params;
        },
        getPopupContainer: (node) => document.body,
      };
    },
    colProps: { span: 12 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '通知人不能为空' }];
    },
  },
  {
    label: '是否启用',
    field: 'isEnable',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: { dictCode: 'is_open' },
    colProps: { span: 12 },
  },
  {
    label: '是否首页展示',
    field: 'isHome',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: { dictCode: 'is_open' },
    colProps: { span: 12 },
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
