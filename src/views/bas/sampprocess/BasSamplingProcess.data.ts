import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';
import { defineEmits } from 'vue';
//列表数据
export const columns: BasicColumn[] = [
  {
    title: '编码',
    align: 'center',
    sorter: true,
    width: 150,
    dataIndex: 'code',
  },
  {
    title: '描述',
    align: 'center',
    sorter: true,
    dataIndex: 'description',
  },
  {
    title: '抽样方式',
    align: 'center',
    sorter: true,
    width: 150,
    dataIndex: 'samplingMode_dictText',
  },
  {
    title: '动态规则',
    align: 'center',
    sorter: true,
    width: 200,
    dataIndex: 'dynamicRuleId_dictText',
  },
  {
    title: '抽样方案',
    align: 'center',
    sorter: true,
    width: 200,
    dataIndex: 'samplingSchemaId_dictText',
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
    label: '抽样方式',
    field: 'samplingMode',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'sampling_ratio',
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
    component: 'InputTextArea',
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入描述!' }];
    },
  },
  {
    label: '抽样方式',
    field: 'samplingMode',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'sampling_ratio',
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请输入抽样方式!' }];
    },
  },
  {
    label: '样本数',
    field: 'sampleQty',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: false }, { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!' }];
    },
  },
  {
    label: '接收数',
    field: 'ac',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: false }, { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!' }];
    },
  },
  {
    label: '拒收数',
    field: 're',
    component: 'InputNumber',
    dynamicRules: ({ model, schema }) => {
      return [{ required: false }, { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!' }];
    },
  },
  {
    label: '动态规则',
    field: 'dynamicRuleId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/dyncrule/basDynamicRule/list',
        params: { column: 'code', order: 'asc', searchFields: 'code,description' /*, code: '${code}'*/ },
        columns: [
          {
            name: '编码',
            code: 'code',
          },
          {
            name: '描述',
            code: 'description',
          },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['description'],
        placeholder: '请输入',
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择动态规则编码!' }];
    },
  },
  {
    label: '抽样方案',
    field: 'samplingSchemaId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sampschema/basSamplingSchema/list',
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
            name: '描述',
            code: 'description',
          },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['name'],
        placeholder: '请输入',
        getPopContainer: (node) => document.body,
        onChange: (e) => {
          setFieldsValue({ samplingAqlId: null });
        },
      };
    },
  },
  {
    label: '初始AQL',
    field: 'samplingAqlId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/sampaql/basSamplingAql/list',
        params: { column: 'aql', order: 'asc', searchFields: 'aql', schemaId: '${samplingSchemaId}' },
        columns: [
          {
            name: 'AQL',
            code: 'aql',
          },
          {
            name: '严格度',
            code: 'stringencyId_dictText',
          },
        ],
        isShowNum: false,
        rowKey: 'id',
        labelKey: ['aql'],
        placeholder: '请输入',
        getPopContainer: (node) => document.body,
      };
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

/**
 * 流程表单调用这个方法获取formSchema
 * @param param
 */
export function getBpmFormSchema(_formData): FormSchema[] {
  // 默认和原始表单保持一致 如果流程中配置了权限数据，这里需要单独处理formSchema
  return formSchema;
}
