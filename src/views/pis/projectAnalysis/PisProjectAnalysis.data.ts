import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

//子表列表数据
export const pisProjectAnalysisColumns: BasicColumn[] = [
  {
    title: '立项编码',
    align: 'center',
    dataIndex: 'projectId_dictText',
    width: 180,
  },
  {
    title: '分析方法',
    align: 'center',
    dataIndex: 'analysisMethod_dictText',
    width: 150,
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
    width: 150,
    slots: { customRender: 'fileSlot' },
  },
  {
    title: '分析人',
    align: 'center',
    width: 150,
    dataIndex: 'analysisBy_dictText',
  },
  {
    title: '备注',
    align: 'center',
    width: 250,
    dataIndex: 'remark',
  },
  {
    title: '实施对策',
    align: 'center',
    dataIndex: 'implement',
    width: 150,
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
    width: 200,
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
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '改善项目',
    field: 'projectId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/project/pisProject/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' },
        columns: [
          {
            title: '改善编码',
            align: 'center',
            code: 'code',
          },
          {
            title: '改善名称',
            align: 'center',
            code: 'name',
          },
          {
            title: '等级',
            align: 'center',
            code: 'grade_dictText',
          },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['code'],
        placeholder: '请选择改善项目',
        multi: true,
        getPopupContainer: (node) => document.body,
      };
    },
  },
  {
    label: '分析方法',
    field: 'analysisMethod',
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'pis_analysis_method',
    },
  },
];
//表单数据
export const pisProjectAnalysisFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '改善项目',
    field: 'projectId',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/project/pisProject/list',
        params: {
          status: 'reviewed,doing',
        },
        columns: [
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
            title: '描述',
            align: 'center',
            dataIndex: 'description',
          },
          {
            title: '等级',
            align: 'center',
            dataIndex: 'grade_dictText',
          },
          {
            title: '部门',
            align: 'center',
            dataIndex: 'deptId_dictText',
          },
        ],
        queryInfo: [
          {
            field: 'code',
            label: '改善编码',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'name',
            label: '改善名称',
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
      return [{ required: true, message: '请选择改善项目!' }];
    },
  },
  {
    label: '分析方法',
    field: 'analysisMethod',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'pis_analysis_method',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入分析方法!' }];
    },
  },
  {
    label: '分析工具',
    field: 'analysisTool',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入分析工具!' }];
    },
    colProps: { span: 24 },
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
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '责任人不能为空' }];
    },
    colProps: { span: 24 },
  },
  {
    label: '分析人',
    field: 'analysisBy',
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
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '分析人不能为空' }];
    },
    colProps: { span: 24 },
  },
  {
    label: '分析详细内容',
    field: 'description',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '实施对策',
    field: 'implement',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '分析文件',
    field: 'analysisFile',
    component: 'JUploadCustom',
    componentProps: {
      uploadType: ['camera', 'uplaod'],
    },
    colProps: { span: 24 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },

  {
    label: '完成总结',
    field: 'divisionLine',
    component: 'Input',
    ifShow: false,
  },
  {
    label: '完成总结',
    field: 'completeContent',
    component: 'Input',
    ifShow: false,
  },
  {
    label: '完成附件',
    field: 'completeFile',
    component: 'Input',
    ifShow: false,
  },
  {
    label: '完成人',
    field: 'completeBy',
    component: 'Input',
    ifShow: false,
  },
];
//完成表单数据
export const pisProjectAnalysisFormSchemaFinish: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '改善项目',
    field: 'projectId_dictText',
    component: 'Input',
    dynamicDisabled: true,
    colProps: { span: 12 },
  },
  {
    label: '分析方法',
    field: 'analysisMethod',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'pis_analysis_method',
    },
    dynamicDisabled: true,
    colProps: { span: 12 },
  },
  {
    label: '分析工具',
    field: 'analysisTool',
    component: 'Input',
    dynamicDisabled: true,
    colProps: { span: 24 },
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
    dynamicDisabled: true,
    colProps: { span: 12 },
  },
  {
    label: '责任人',
    field: 'responsiBy_dictText',
    component: 'Input',
    dynamicDisabled: true,
    colProps: { span: 24 },
  },
  {
    label: '分析人',
    field: 'analysisBy_dictText',
    component: 'Input',
    dynamicDisabled: true,
    colProps: { span: 24 },
  },
  {
    label: '分析详细内容',
    field: 'description',
    component: 'InputTextArea',
    dynamicDisabled: true,
    colProps: { span: 24 },
  },
  // {
  //   label: '分析文件',
  //   field: 'analysisFile',
  //   component: 'JUploadCustom',
  //   componentProps: {
  //     uploadType: ['camera', 'uplaod'],
  //   },
  //   dynamicDisabled: true,
  //   colProps: { span: 24 },
  // },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    dynamicDisabled: true,
    colProps: { span: 24 },
  },
  {
    label: '实施对策',
    field: 'implement',
    component: 'InputTextArea',
    dynamicDisabled: true,
    colProps: { span: 24 },
  },
  // {
  //   label: '实际完工时间',
  //   field: 'acCompleteTime',
  //   component: 'DatePicker',
  //   componentProps: {
  //     showTime: true,
  //     valueFormat: 'YYYY-MM-DD HH:mm:ss',
  //   },
  // },
  {
    label: '完成总结',
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
    label: '完成总结',
    field: 'completeContent',
    component: 'InputTextArea',
    colProps: { span: 24 },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '完成总结不能为空' }];
    },
  },
  {
    label: '完成附件',
    field: 'completeFile',
    component: 'JUploadCustom',
    componentProps: {
      uploadType: ['camera', 'uplaod'],
    },
    colProps: { span: 24 },
  },
  {
    label: '完成人',
    field: 'completeBy',
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
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '完成人不能为空' }];
    },
    colProps: { span: 24 },
  },
];
