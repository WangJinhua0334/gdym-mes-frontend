import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    sorter: true,
    dataIndex: 'code',
  },
  {
    title: '描述',
    align: 'center',
    sorter: true,
    dataIndex: 'description',
  },
  {
    title: '版本',
    align: 'center',
    sorter: true,
    dataIndex: 'version',
  },
  {
    title: '检验类型',
    align: 'center',
    sorter: true,
    dataIndex: 'type_dictText',
  },
  {
    title: '是否启用',
    align: 'center',
    sorter: true,
    dataIndex: 'isEnable_dictText',
  },
  {
    title: '抽样过程',
    align: 'center',
    dataIndex: 'samplingProcessId_dictText',
  },
  {
    title: '生效日期',
    align: 'center',
    sorter: true,
    dataIndex: 'effectDateBegin',
    customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },
  },
  {
    title: '失效日期',
    align: 'center',
    sorter: true,
    dataIndex: 'effectDateEnd',
    customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },
  },
];
//查询数据
export const searchFormSchema: FormSchema[] = [
  {
    label: '编码',
    field: 'code',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '描述',
    field: 'description',
    component: 'JInput',
    colProps: { span: 6 },
  },
  {
    label: '检验类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'insp_std_type',
    },
    colProps: { span: 6 },
  },
  {
    label: '是否启用',
    field: 'isEnable',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'is_open',
    },
    colProps: { span: 6 },
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
    label: '描述',
    field: 'description',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入描述!' }];
    },
  },
  {
    label: '版本',
    field: 'version',
    defaultValue: 'v1.0',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入版本!' }];
    },
  },
  {
    label: '检验类型',
    field: 'type',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'insp_std_type',
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择检验类型!' }];
    },
  },
  {
    label: '是否启用',
    field: 'isEnable',
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
      getPopupContainer: (node) => document.body,
    },
  },
  {
    label: '抽样过程',
    field: 'samplingProcessId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sampprocess/basSamplingProcess/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,description' },
        columns: [
          { name: '编码', code: 'code' },
          { name: '描述', code: 'description' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['description'],
        placeholder: '请选择',
        pageSize: 10,
        // multi: true,
        // maxTagCount: 5,
        getPopupContainer: (node) => document.body,
      };
    },
  },
  {
    label: '生效日期',
    field: 'effectDateBegin',
    component: 'DatePicker',
    dynamicRules: ({ model, schema, values }) => {
      return [{ required: true, message: '请输入生效日期!' }, { ...rules.startTime(model.effectDateEnd)[0] }];
    },
  },
  {
    label: '失效日期',
    field: 'effectDateEnd',
    component: 'DatePicker',
    dynamicRules: ({ model, schema, values }) => {
      return [{ ...rules.endTime(model.effectDateBegin)[0] }];
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea', //TODO 注意string转换问题
  },
  {
    label: '附件',
    field: 'attachments',
    component: 'JUpload',
    componentProps: {},
  },
  // TODO 主键隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
];

//查询数据
export const basInspStdItemSearchFormSchema: FormSchema[] = [
  {
    label: '检验编码',
    field: 'code',
    component: 'JInput',
  },
  {
    label: '检验描述',
    field: 'description',
    component: 'JInput',
  },
  {
    label: '检验类别',
    field: 'inspCategory',
    component: 'JInput',
  },
  {
    label: '检验标识',
    field: 'inspTag',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'Inspection_method',
    },
  },
  {
    label: '是否必检',
    field: 'isSuitable',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '工序',
    field: 'stationId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/station/basStation/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择',
        pageSize: 10,
        multi: true,
        maxTagCount: 2,
      };
    },
  },
];

//子表列表数据
export const basInspStdItemColumns: BasicColumn[] = [
  {
    title: '检验编码',
    align: 'center',
    dataIndex: 'code',
    sorter: true,
  },
  {
    title: '检验标识',
    align: 'center',
    sorter: true,
    dataIndex: 'inspTag_dictText',
  },
  {
    title: '是否必检',
    align: 'center',
    sorter: true,
    dataIndex: 'isSuitable_dictText',
  },
  {
    title: '工序',
    align: 'center',
    sorter: true,
    dataIndex: 'stationId_dictText',
  },
  {
    title: '检验类别',
    align: 'center',
    sorter: true,
    dataIndex: 'inspCategory',
  },
  {
    title: '检验工具',
    align: 'center',
    sorter: true,
    dataIndex: 'inspTool',
  },
  {
    title: '检验描述',
    align: 'center',
    dataIndex: 'description',
  },
  /*{
    title: '生效日期',
    align: 'center',
    sorter: true,
    dataIndex: 'effectDateBegin',
    customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },
  },
  {
    title: '失效日期',
    align: 'center',
    sorter: true,
    dataIndex: 'effectDateEnd',
    customRender: ({ text }) => {
      return !text ? '' : text.length > 10 ? text.substr(0, 10) : text;
    },
  },*/
];
//子表表单数据
export const basInspStdItemFormSchema: FormSchema[] = [
  // TODO 子表隐藏字段，目前写死为ID
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '检验编码',
    field: 'code',
    component: 'Input',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入编码!' }];
    },
  },
  {
    label: '检验标识',
    field: 'inspTag',
    component: 'JDictSelectTag',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue } = formActionType;
      return {
        dictCode: 'Inspection_method',
        onChange: () => {
          setFieldsValue({
            minOperators: null,
            limitMin: null,
            maxOperators: null,
            limitMax: null,
          });
        },
        getPopupContainer: (node) => document.body,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入检验标识!' }];
    },
  },
  {
    label: '是否必检',
    field: 'isSuitable',
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
      getPopupContainer: (node) => document.body,
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入是否必检!' }];
    },
    colProps: { span: 12 },
  },
  {
    label: '工序',
    field: 'stationId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/station/basStation/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,name' },
        columns: [
          { name: '编码', code: 'code' },
          { name: '名称', code: 'name' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择',
        pageSize: 10,
        // multi: true,
        // maxTagCount: 2,
        getPopupContainer: (node) => document.body,
      };
    },
    colProps: { span: 12 },
  },
  {
    label: '下限比较符',
    field: 'minOperators',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'lower_limit',
      getPopupContainer: (node) => document.body,
    },
    ifShow: ({ values }) => {
      return values.inspTag && values.inspTag == 'measurement';
    },
  },
  {
    label: '规格下限',
    field: 'limitMin',
    component: 'InputNumber',
    ifShow: ({ values }) => {
      return values.inspTag && values.inspTag == 'measurement';
    },
  },

  {
    label: '上限比较符',
    field: 'maxOperators',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'top_limit',
      getPopupContainer: (node) => document.body,
    },
    ifShow: ({ values }) => {
      return values.inspTag && values.inspTag == 'measurement';
    },
  },
  {
    label: '规格上限',
    field: 'limitMax',
    component: 'InputNumber',
    ifShow: ({ values }) => {
      return values.inspTag && values.inspTag == 'measurement';
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
          {
            name: '是否默认',
            code: 'isDefault_dictText',
          },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请选择',
        pageSize: 10,
        //multi: true,
        //maxTagCount: 2,
        getPopupContainer: (node) => document.body,
      };
    },
    ifShow: ({ values }) => {
      return values.inspTag && values.inspTag == 'measurement';
    },
    colProps: { span: 24 },
  },
  {
    label: '检验类别',
    field: 'inspCategory',
    component: 'Input',
  },
  {
    label: '检验工具',
    field: 'inspTool',
    component: 'Input',
  },
  {
    label: '检验描述',
    field: 'description',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '检验依据',
    field: 'inspBasis',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '技术要求',
    field: 'techRequirements',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '缺陷代码',
    field: 'defectCodeId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/defecttype/basDefect/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,description' },
        columns: [
          { name: '编码', code: 'code' },
          { name: '描述', code: 'description' },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['description'],
        placeholder: '请选择',
        pageSize: 10,
        // multi: true,
        // maxTagCount: 2,
        getPopupContainer: (node) => document.body,
      };
    },
    colProps: { span: 24 },
  },
  /*{
    label: '生效日期',
    field: 'effectDateBegin',
    component: 'DatePicker',
    dynamicRules: ({ model, schema, values }) => {
      return [{ ...rules.startTime(model.effectDateEnd)[0] }];
    },
    colProps: { span: 24 },
  },
  {
    label: '失效日期',
    field: 'effectDateEnd',
    component: 'DatePicker',
    dynamicRules: ({ model, schema, values }) => {
      return [{ ...rules.endTime(model.effectDateBegin)[0] }];
    },
    colProps: { span: 24 },
  },*/
];
