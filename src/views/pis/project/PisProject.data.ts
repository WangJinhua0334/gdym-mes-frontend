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
    width: 150,
  },
  {
    title: '改善名称',
    align: 'center',
    dataIndex: 'name',
    width: 150,
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
    width: 150,
  },
  {
    title: '部门',
    align: 'center',
    dataIndex: 'deptId_dictText',
    width: 150,
  },
  {
    title: '计划开始时间',
    align: 'center',
    dataIndex: 'planStartTime',
    width: 150,
  },
  {
    title: '计划完工时间',
    align: 'center',
    dataIndex: 'planCompleteTime',
    width: 150,
  },
  {
    title: '责任人',
    align: 'center',
    dataIndex: 'responsiBy_dictText',
    width: 150,
  },
  {
    title: '项目成员',
    align: 'center',
    dataIndex: 'memberBy_dictText',
    width: 300,
  },
  {
    title: '状态',
    align: 'center',
    dataIndex: 'status',
    width: 150,
    customRender: ({ text }) => {
      return render.renderDict(text, 'pis_status', true);
    },
  },
  {
    title: '改善目标',
    align: 'center',
    dataIndex: 'target',
    width: 150,
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
    width: 150,
  },
  {
    title: '核准方式',
    align: 'center',
    dataIndex: 'approvalMethod_dictText',
    width: 150,
  },
  {
    title: '核准人',
    align: 'center',
    dataIndex: 'approvalBy_dictText',
    width: 150,
  },
  {
    title: '审核人',
    align: 'center',
    dataIndex: 'examineBy_dictText',
    width: 150,
  },
  {
    title: '审核时间',
    align: 'center',
    dataIndex: 'examineTime',
    width: 150,
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
    width: 150,
  },
  {
    title: '实际完工时间',
    align: 'center',
    dataIndex: 'acCompleteTime',
    width: 150,
  },
  {
    title: '对比方式',
    align: 'center',
    dataIndex: 'contrastMethod_dictText',
    width: 150,
  },
  {
    title: '效果确认',
    align: 'center',
    dataIndex: 'effectConfirm',
    width: 150,
  },
  {
    title: '项目总结',
    align: 'center',
    dataIndex: 'projectSummary',
    width: 150,
  },
  {
    title: '项目金额测算',
    align: 'center',
    dataIndex: 'calculationMoney',
    width: 150,
  },
  {
    title: '改善成本',
    align: 'center',
    dataIndex: 'cost',
    width: 150,
  },
  {
    title: '跟踪月份',
    align: 'center',
    dataIndex: 'trackMonth',
    width: 150,
  },
  {
    title: '版本',
    align: 'center',
    dataIndex: 'version',
    width: 150,
  },
  {
    title: '是否完成',
    align: 'center',
    dataIndex: 'isComplete',
    width: 150,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '是否继续',
    align: 'center',
    dataIndex: 'isContinue',
    width: 150,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
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
    width: 200,
  },
  {
    title: '分析工具',
    align: 'center',
    dataIndex: 'analysisTool',
    width: 150,
  },
  {
    title: '计划完工时间',
    align: 'center',
    dataIndex: 'planCompleteTime',
    width: 150,
  },
  {
    title: '责任人',
    align: 'center',
    dataIndex: 'responsiBy_dictText',
    width: 150,
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
    width: 200,
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '分析人',
    align: 'center',
    dataIndex: 'analysisBy_dictText',
    width: 150,
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'remark',
    width: 150,
  },
  {
    title: '实施对策',
    align: 'center',
    dataIndex: 'implement',
    width: 200,
  },
  {
    title: '实际完工时间',
    align: 'center',
    dataIndex: 'acCompleteTime',
    width: 150,
  },
  {
    title: '完成总结',
    align: 'center',
    dataIndex: 'completeContent',
    width: 250,
  },
  {
    title: '完成附件',
    align: 'center',
    dataIndex: 'completeFile',
    width: 150,
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '完成人',
    align: 'center',
    width: 150,
    dataIndex: 'completeBy_dictText',
  },
];
