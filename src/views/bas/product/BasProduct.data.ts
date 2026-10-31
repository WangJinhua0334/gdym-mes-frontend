import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { render } from '/@/utils/common/renderUtils';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';

function formatMaterialText(value: unknown): string {
  return String(value ?? '').trim() || '—';
}

//列表数据
export const columns: BasicColumn[] = [
  {
    title: '物料编码',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
    width: 240,
    customRender: ({ text }) => formatMaterialText(text),
  },
  {
    title: '物料名称',
    align: 'center',
    sorter: true,
    dataIndex: 'name',
    width: 260,
    customRender: ({ text }) => formatMaterialText(text),
  },
  {
    title: '规格型号',
    align: 'center',
    sorter: true,
    // 金蝶同步的规格型号保存在 modelNumber，specification 是独立的规格字段。
    dataIndex: 'modelNumber',
    width: 200,
    customRender: ({ text }) => formatMaterialText(text),
  },
  {
    title: '打印名称',
    align: 'center',
    dataIndex: 'printName',
    width: 260,
    customRender: ({ text }) => formatMaterialText(text),
  },
  {
    title: '版本',
    align: 'center',
    dataIndex: 'version',
    width: 80,
    defaultHidden: true,
    customRender: ({ text }) => formatMaterialText(text),
  },
  {
    title: '是否默认',
    align: 'center',
    dataIndex: 'isDefault',
    width: 80,
    defaultHidden: true,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '是否关键料',
    align: 'center',
    sorter: true,
    dataIndex: 'isKey',
    width: 80,
    defaultHidden: true,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '是', value: 'Y', isChecked: true },
        { text: '否', value: 'N', isChecked: false },
      ]);
    },
  },
  {
    title: '状态',
    align: 'center',
    sorter: true,
    dataIndex: 'status',
    width: 80,
    defaultHidden: true,
    customRender: ({ text }) => {
      return render.renderSwitch(text, [
        { text: '启用', value: 'enable', isChecked: true },
        { text: '禁用', value: 'disable', isChecked: false },
      ]);
    },
  },
  {
    title: '物料组',
    align: 'center',
    sorter: true,
    dataIndex: 'prodGrId_dictText',
    width: 120,
    defaultHidden: true,
    customRender: ({ text }) => formatMaterialText(text),
  },
  {
    title: '描述',
    align: 'center',
    sorter: true,
    dataIndex: 'description',
    defaultHidden: true,
    customRender: ({ text }) => formatMaterialText(text),
  },
  {
    title: '检验方案列表',
    align: 'center',
    dataIndex: 'listSlot',
    slots: { customRender: 'listSlot' },
    width: 180,
    defaultHidden: true,
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '物料编码',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '物料名称',
    field: 'name',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '规格型号',
    field: 'modelNumber',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '打印名称',
    field: 'printName',
    component: 'JInput',
    colProps: { span: 6 },
  },
];
//表单数据
export const formSchema: FormSchema[] = [
  {
    label: '物料编码',
    field: 'code',
    component: 'Input',
    dynamicRules: () => {
      return [
        {
          required: true,
          message: '请输入料号!',
        },
      ];
    },
  },
  {
    label: '名称',
    field: 'name',
    component: 'InputTextArea',
    dynamicRules: () => {
      return [
        {
          required: true,
          message: '请输入名称!',
        },
      ];
    },
  },
  {
    label: '打印名称',
    field: 'printName',
    component: 'Input',
  },
  {
    label: '规格',
    field: 'specification',
    component: 'InputTextArea',
  },
  {
    label: '规格型号',
    field: 'modelNumber',
    component: 'Input',
    defaultValue: '',
  },
  {
    label: '物料分类',
    field: 'category',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'prod_category',
    },
  },
  {
    label: '单位',
    field: 'unitId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/unitgroup/basUnitGroup/queryBasUnitPageList',
        params: {
          column: 'code',
          order: 'asc',
          searchFields: 'code,name' /*, code: '${code}'*/,
        },
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
        //pageSize: 10,
        //multi: true,
        //maxTagCount: 2,
        getPopupContainer: () => document.body,
      };
    },
    dynamicRules: () => {
      return [
        {
          required: true,
          message: '请选择单位!',
        },
      ];
    },
  },
  {
    label: '基本单位',
    field: 'baseUnitId',
    component: 'Input',
    defaultValue: '',
  },
  {
    label: '重量单位',
    field: 'weightUnitId',
    component: 'Input',
    defaultValue: '',
  },
  {
    label: '采购单价',
    field: 'cgdj',
    component: 'Input',
    defaultValue: '',
  },
  {
    label: '销售溢价',
    field: 'xsyj',
    component: 'Input',
    defaultValue: '',
  },
  {
    label: '币别',
    field: 'bb',
    component: 'Input',
    defaultValue: '',
  },
  {
    label: '金蝶ERP ID',
    field: 'erpId',
    component: 'Input',
    defaultValue: '',
  },
  {
    label: '物料所属组织',
    field: 'useOrgId',
    component: 'Input',
    defaultValue: '',
  },
  {
    label: '星圣组织名称',
    field: 'xName',
    component: 'Input',
    defaultValue: '',
  },
  {
    label: '物料组',
    field: 'prodGrId',
    show: false,
    defaultValue: '1',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/productgroup/basProductGroup/list',
        params: {},
        columns: [
          {
            title: '物料组编码',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '物料组名称',
            align: 'center',
            dataIndex: 'name',
          },
          {
            title: '父级物料编码',
            align: 'center',
            dataIndex: 'pid_dictText',
          },
          {
            title: '父级物料名称',
            align: 'center',
            dataIndex: 'pidName_dictText',
          },
        ],
        queryInfo: [
          {
            field: 'code',
            label: '物料组编码',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'name',
            label: '物料组名称',
            mode: 'single',
            view: 'string',
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择',
      };
    },
    dynamicRules: () => {
      return [
        {
          required: true,
          message: '请选择物料组!',
        },
      ];
    },
  },
  {
    label: '版本',
    field: 'version',
    show: false,
    defaultValue: 'A0',
    component: 'Input',
    dynamicRules: () => {
      return [
        {
          required: true,
          message: '请输入版本!',
        },
      ];
    },
  },
  {
    label: '描述',
    field: 'description',
    show: false,
    component: 'InputTextArea',
  },
  {
    label: '是否默认',
    field: 'isDefault',
    show: false,
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    dynamicRules: () => {
      return [
        {
          required: true,
          message: '请输入是否默认!',
        },
      ];
    },
  },
  {
    label: '是否关键物料',
    field: 'isKey',
    show: false,
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    dynamicRules: () => {
      return [
        {
          required: false,
          message: '请输入是否关键物料!',
        },
      ];
    },
  },
  {
    label: '是否虚拟料',
    field: 'isVirtual',
    show: false,
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    dynamicRules: () => {
      return [
        {
          required: false,
          message: '请输入是否虚拟料!',
        },
      ];
    },
  },
  {
    label: '状态',
    field: 'status',
    show: false,
    defaultValue: 'enable',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'prod_status',
    },
    dynamicRules: () => {
      return [
        {
          required: true,
          message: '请输入状态!',
        },
      ];
    },
  },
  {
    label: '来源类型',
    field: 'sourceType',
    show: false,
    component: 'JSelectMultiple',
    componentProps: {
      dictCode: 'prod_src_type',
    },
  },
  {
    label: '管控方式',
    field: 'controlMode',
    show: false,
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'prod_control_mode',
    },
  },
  {
    label: '物料材质',
    field: 'physical',
    show: false,
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'prod_physical',
    },
  },
  {
    label: '图号',
    field: 'picNo',
    show: false,
    component: 'Input',
  },
  {
    label: 'PDM编码',
    field: 'pdmCode',
    show: false,
    component: 'Input',
  },
  {
    label: '最小包装数',
    field: 'minPackQty',
    show: false,
    defaultValue: 1,
    component: 'InputNumber',
  },
  {
    label: '默认仓库',
    field: 'whId',
    show: false,
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/warehouse/basWarehouse/list',
        params: {
          column: 'code',
          order: 'asc',
          searchFields: 'code,name,description' /*, code: '${code}'*/,
        },
        columns: [
          {
            name: '编码',
            code: 'code',
          },
          {
            name: '名称',
            code: 'name',
          },
          {
            name: '描述',
            code: 'description',
          },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
      };
    },
  },
  {
    label: '启用有效期',
    field: 'isValidity',
    show: false,
    component: 'JSwitch',
    componentProps: {},
  },
  {
    label: '有效期（天）',
    field: 'validityPeriod',
    show: false,
    component: 'InputNumber',
  },
  {
    label: '有效期预警（天）',
    field: 'validityAlertDays',
    show: false,
    component: 'InputNumber',
  },
  {
    label: '有效期（次）',
    field: 'validityTimes',
    show: false,
    component: 'InputNumber',
  },
  {
    label: '有效期预警（次）',
    field: 'validityAlertTimes',
    show: false,
    component: 'InputNumber',
  },
  {
    label: '模板方案',
    field: 'templateId',
    show: false,
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/template/basTemplate/list',
        params: {
          column: 'code',
          order: 'asc',
          searchFields: 'code,name' /*, code: '${code}'*/,
        },
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
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        //pageSize: 10,
        //multi: true,
        //maxTagCount: 2,
      };
    },
  },
  {
    label: '包装规则',
    field: 'packRuleId',
    show: false,
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/packrule/basPackRule/list',
        params: {
          column: 'code',
          order: 'asc',
          searchFields: 'code,name' /*, code: '${code}'*/,
        },
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
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        //pageSize: 10,
        //multi: true,
        //maxTagCount: 2,
      };
    },
  },
  {
    label: '流转卡生成规则',
    field: 'fillRuleCode',
    show: false,
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sys/fillRule/listFillRule',
        params: {
          column: 'createTime',
          order: 'desc',
          searchFields: 'ruleName',
        },
        columns: [
          {
            name: '编码',
            code: 'ruleCode',
          },
          {
            name: '名称',
            code: 'ruleName',
          },
        ],
        isShowNum: true,
        rowKey: 'ruleCode',
        labelKey: ['ruleName'],
        placeholder: '请选择',
        multi: false,
        pageSize: 10,
        queryBefore: (params) => {
          params.ruleCode = '*mo_sn*';
          return params;
        },
      };
    },
  },
  {
    label: '物料成本',
    field: 'materialCost',
    show: false,
    component: 'InputNumber',
  },
  {
    field: 'image',
    show: false,
    component: 'JImageUpload',
    label: '上传图片',
  },
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];
//子表单数据
//子表表格配置
export const basProductPropertyColumns: JVxeColumn[] = [
  {
    title: '属性',
    key: 'code',
    type: JVxeTypes.select,
    options: [],
    dictCode: 'prod_prop_code',
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
    validateRules: [{ required: true, message: '${title}不能为空' }],
  },
  {
    title: '值',
    key: 'value',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '扩展值1',
    key: 'extend1',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '扩展值2',
    key: 'extend2',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
  {
    title: '扩展值3',
    key: 'extend3',
    type: JVxeTypes.input,
    width: '200px',
    placeholder: '请输入${title}',
    defaultValue: '',
  },
];

//列表数据
export const prodSchemaColumns: BasicColumn[] = [
  {
    title: '检验方案',
    align: 'center',
    sorter: true,
    dataIndex: 'schemaId_dictText',
  },
  {
    title: '检验方案描述',
    align: 'center',
    sorter: true,
    dataIndex: 'schemaName_dictText',
  },
];
//查询数据
export const prodSchemaFormSchema: FormSchema[] = [
  {
    label: '检验方案',
    field: 'schemaQuery',
    component: 'Input',
    colProps: { span: 6 },
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
