import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '改善编码',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '改善名称',
    align: 'center',
    dataIndex: 'name',
  },
  {
    title: '改善描述',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: '改善等级',
    align: 'center',
    dataIndex: 'grade_dictText',
  },
  {
    title: '部门',
    align: 'center',
    dataIndex: 'deptId_dictText',
  },
  {
    title: '计划开始时间',
    align: 'center',
    dataIndex: 'planStartTime',
  },
  {
    title: '计划完工时间',
    align: 'center',
    dataIndex: 'planCompleteTime',
  },
  {
    title: '责任人',
    align: 'center',
    dataIndex: 'responsiBy_dictText',
  },
  {
    title: '项目成员',
    align: 'center',
    dataIndex: 'memberBy_dictText',
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status_dictText',
  },
  {
    title: '改善目标',
    align: 'center',
    dataIndex: 'target',
  },
  // {
  //   title: '改善指标',
  //   align: 'center',
  //   dataIndex: 'indexes_dictText',
  // },
  {
    title: '改善奖金',
    align: 'center',
    dataIndex: 'bonus',
  },
  {
    title: '核准方式',
    align: 'center',
    dataIndex: 'approvalMethod_dictText',
  },
  {
    title: '核准人',
    align: 'center',
    dataIndex: 'approvalBy_dictText',
  },
  {
    title: '审核人',
    align: 'center',
    dataIndex: 'examineBy_dictText',
  },
  {
    title: '审核时间',
    align: 'center',
    dataIndex: 'examineTime',
  },
  // {
  //   title: '审核记录',
  //   align: 'center',
  //   dataIndex: 'InputTextArea',
  // },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
  {
    title: '实际开始时间',
    align: 'center',
    dataIndex: 'acStartTime',
  },
  {
    title: '实际完工时间',
    align: 'center',
    dataIndex: 'acCompleteTime',
  },
  {
    title: '对比方式',
    align: 'center',
    dataIndex: 'contrastMethod_dictText',
  },
  {
    title: '效果确认',
    align: 'center',
    dataIndex: 'effectConfirm',
  },
  {
    title: '项目总结',
    align: 'center',
    dataIndex: 'projectSummary',
  },
  {
    title: '项目金额测算',
    align: 'center',
    dataIndex: 'calculationMoney',
  },
  {
    title: '改善成本',
    align: 'center',
    dataIndex: 'cost',
  },
  {
    title: '跟踪月份',
    align: 'center',
    dataIndex: 'trackMonth',
  },
  {
    title: '版本',
    align: 'center',
    dataIndex: 'version',
  },
  {
    title: '是否完成',
    align: 'center',
    dataIndex: 'isComplete',
    slots: { customRender: 'switchSlot' },
  },
  {
    title: '是否继续',
    align: 'center',
    dataIndex: 'isContinue',
    slots: { customRender: 'switchSlot' },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '改善编码',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '改善名称',
    field: 'name',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '改善等级',
    field: 'grade',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'pis_grade',
    },
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
  {
    label: '状态',
    field: 'status',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'pis_status',
    },
    colProps: { span: 6 },
  },
];

//表单数据
export const formSchema: FormSchema[] = [
  // {
  //   label: '改善编码',
  //   field: 'code',
  //   component: 'Input',
  //   dynamicRules: ({ model, schema }) => {
  //     return [{ required: true, message: '请输入改善编码!' }];
  //   },
  // },
  {
    label: '改善名称',
    field: 'name',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入改善名称!' }];
    },
    colProps: { span: 12 },
  },
  {
    label: '改善等级',
    field: 'grade',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'pis_grade',
    },
    colProps: { span: 12 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入改善等级!' }];
    },
  },
  {
    label: '改善描述',
    field: 'description',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '计划开始时间',
    field: 'planStartTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入计划开始时间!' }];
    },
  },
  {
    label: '计划完工时间',
    field: 'planCompleteTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入计划完工时间!' }];
    },
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
    label: '责任人',
    field: 'responsiBy',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sys/user/list',
        params: { column: 'sorts', order: 'asc', searchFields: 'username,realname,workNo' },
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
        multi: false,
        queryBefore: (params) => {
          return params;
        },
        getPopupContainer: (node) => document.body,
      };
    },
    colProps: { span: 12 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '责任人不能为空' }];
    },
  },
  {
    label: '项目成员',
    field: 'memberBy',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sys/user/list',
        params: { column: 'sorts', order: 'asc', searchFields: 'username,realname,workNo' },
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
      return [{ required: true, message: '项目成员不能为空' }];
    },
  },
  {
    label: '改善目标',
    field: 'target',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入改善目标!' }];
    },
    colProps: { span: 24 },
  },
  // {
  //   label: '改善指标',
  //   field: 'indexes',
  //   component: 'JDictSelectTag',
  //   componentProps: {
  //     dictCode: 'pis_indexes',
  //   },
  // },
  {
    label: '改善奖金',
    field: 'bonus',
    component: 'InputNumber',
    colProps: { span: 12 },
  },
  {
    label: '核准方式',
    field: 'approvalMethod',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'pis_approval_method',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入核准方式!' }];
    },
    colProps: { span: 12 },
  },
  {
    label: '核准人',
    field: 'approvalBy',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sys/user/list',
        params: { column: 'sorts', order: 'asc', searchFields: 'username,realname,workNo' },
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
        multi: false,
        queryBefore: (params) => {
          return params;
        },
        getPopupContainer: (node) => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '核准人不能为空' }];
    },
    colProps: { span: 12 },
  },
  // {
  //   label: '审核人',
  //   field: 'examineBy',
  //   component: 'Input',
  // },
  // {
  //   label: '审核时间',
  //   field: 'examineTime',
  //   component: 'DatePicker',
  //   componentProps: {
  //     showTime: true,
  //     valueFormat: 'YYYY-MM-DD HH:mm:ss',
  //   },
  // },
  {
    label: '备注',
    field: 'remark',
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
//效果确认表单
export const confirmFormSchema: FormSchema[] = [
  {
    label: '是否完成',
    field: 'isComplete',
    component: 'JSwitch',
    componentProps: { dictCode: 'is_open' },
    colProps: { span: 12 },
  },
  {
    label: '是否继续',
    field: 'isContinue',
    component: 'JSwitch',
    componentProps: { dictCode: 'is_open' },
    colProps: { span: 12 },
  },
  {
    label: '对比方式',
    field: 'contrastMethod',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'pis_contrast_method',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入对比方式!' }];
    },
    colProps: { span: 12 },
  },
  {
    label: '项目金额测算',
    field: 'calculationMoney',
    component: 'InputNumber',
    colProps: { span: 12 },
  },
  {
    label: '效果确认',
    field: 'effectConfirm',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入效果确认!' }];
    },
    colProps: { span: 24 },
  },
  {
    label: '项目总结',
    field: 'projectSummary',
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入项目总结!' }];
    },
    colProps: { span: 24 },
  },
  {
    label: '改善成本',
    field: 'cost',
    defaultValue: 0,
    component: 'InputNumber',
    colProps: { span: 12 },
  },
  {
    label: '跟踪月份',
    field: 'trackMonth',
    defaultValue: 0,
    component: 'InputNumber',
    colProps: { span: 12 },
  },
  {
    label: '版本',
    field: 'version',
    component: 'InputNumber',
    defaultValue: 1.0,
    componentProps: { addonBefore: 'V', precision: 1 },
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
//表单数据
export const detailSchema: FormSchema[] = [
  {
    label: '改善编码',
    field: 'code',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '改善名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '改善描述',
    field: 'description',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '计划开始时间',
    field: 'planStartTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: '计划完工时间',
    field: 'planCompleteTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: '改善等级',
    field: 'grade',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'pis_grade',
    },
    colProps: { span: 12 },
  },
  {
    label: '责任部门',
    field: 'deptId_dictText',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '责任人',
    field: 'responsiBy_dictText',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '项目成员',
    field: 'memberBy_dictText',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '改善目标',
    field: 'target',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  // {
  //   label: '改善指标',
  //   field: 'indexes',
  //   component: 'JDictSelectTag',
  //   componentProps: {
  //     dictCode: 'pis_indexes',
  //   },
  // },
  {
    label: '改善奖金',
    field: 'bonus',
    component: 'InputNumber',
    colProps: { span: 12 },
  },
  {
    label: '核准方式',
    field: 'approvalMethod',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'pis_approval_method',
    },
    colProps: { span: 12 },
  },
  {
    label: '核准人',
    field: 'approvalBy_dictText',
    component: 'Input',
    colProps: { span: 12 },
  },
  {
    label: '审核人',
    field: 'examineBy_dictText',
    component: 'Input',
  },
  {
    label: '审核时间',
    field: 'examineTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '审核记录',
    field: 'examineDesc',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '效果确认内容',
    field: 'divisionLine',
    component: 'Divider',
    componentProps: {
      //是否虚线
      dashed: false,
      //分割线标题的位置（left | right | center）
      orientation: 'center',
      //文字是否显示为普通正文样式
      plain: true,
      //水平还是垂直类型（horizontal | vertical）
      type: 'horizontal',
    },
    colProps: { span: 24 },
  },
  {
    label: '是否完成',
    field: 'isComplete',
    component: 'JSwitch',
    componentProps: { dictCode: 'is_open' },
    colProps: { span: 12 },
  },
  {
    label: '是否继续',
    field: 'isContinue',
    component: 'JSwitch',
    componentProps: { dictCode: 'is_open' },
    colProps: { span: 12 },
  },
  {
    label: '对比方式',
    field: 'contrastMethod',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'pis_contrast_method',
    },
    colProps: { span: 12 },
  },
  {
    label: '项目金额测算',
    field: 'calculationMoney',
    component: 'InputNumber',
    colProps: { span: 12 },
  },
  {
    label: '效果确认',
    field: 'effectConfirm',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '项目总结',
    field: 'projectSummary',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '改善成本',
    field: 'cost',
    defaultValue: 0,
    component: 'InputNumber',
    colProps: { span: 12 },
  },
  {
    label: '跟踪月份',
    field: 'trackMonth',
    defaultValue: 0,
    component: 'InputNumber',
    colProps: { span: 12 },
  },
  {
    label: '版本',
    field: 'version',
    component: 'InputNumber',
    defaultValue: 1.0,
    componentProps: { addonBefore: 'V', precision: 1 },
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
//效果确认表单
export const auditFormSchema: FormSchema[] = [
  {
    label: '审核通过',
    field: 'isExamine',
    component: 'JSwitch',
    componentProps: { dictCode: 'is_open' },
    colProps: { span: 24 },
  },
  {
    label: '备注',
    field: 'remark',
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
//子表列表数据
export const pisProjectAnalysisColumns: BasicColumn[] = [
  {
    title: '分析方法',
    align: 'center',
    dataIndex: 'analysisMethod_dictText',
  },
  {
    title: '分析工具',
    align: 'center',
    dataIndex: 'analysisTool',
  },
  {
    title: '计划完工时间',
    align: 'center',
    dataIndex: 'planCompleteTime',
  },
  {
    title: '责任人',
    align: 'center',
    dataIndex: 'responsiBy_dictText',
  },
  {
    title: '分析详细内容',
    align: 'center',
    dataIndex: 'description',
  },
  {
    title: '分析文件',
    align: 'center',
    dataIndex: 'analysisFile',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '分析人',
    align: 'center',
    dataIndex: 'analysisBy_dictText',
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
  },
  {
    title: '实施对策',
    align: 'center',
    dataIndex: 'implement',
  },
  {
    title: '实际完工时间',
    align: 'center',
    dataIndex: 'acCompleteTime',
  },
  {
    title: '完成总结',
    align: 'center',
    dataIndex: 'completeContent',
  },
  {
    title: '完成附件',
    align: 'center',
    dataIndex: 'completeFile',
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '完成人',
    align: 'center',
    dataIndex: 'completeBy_dictText',
  },
];
