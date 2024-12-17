import { ref, unref } from 'vue';
import { FormSchema } from '/@/components/Table';
import { JVxeTypes, JVxeColumn } from '/@/components/jeecg/JVxeTable/types';

export const wkpId = ref<string>('');
export const samplingQty = ref();

export const formSchema: FormSchema[] = [
  {
    label: '检验单号',
    field: 'code',
    component: 'Input',
    colProps: { span: 8 },
    dynamicDisabled: true,
    ifShow: ({ values }) => {
      return !!values.id;
    },
  },
  {
    label: '来料单号',
    field: 'incomingCode',
    component: 'Input',
    colProps: { span: 8 },
    dynamicDisabled: true,
  },
  {
    label: '采购单号',
    field: 'purchaseCode',
    component: 'Input',
    colProps: { span: 8 },
    dynamicDisabled: true,
  },
  {
    label: '物料',
    field: 'prodId_dictText',
    component: 'Input',
    colProps: { span: 8 },
    dynamicDisabled: true,
  },
  {
    label: '物料名称',
    field: 'prodName',
    component: 'Input',
    colProps: { span: 8 },
    dynamicDisabled: true,
  },
  {
    label: '供应商',
    field: 'supplierId_dictText',
    component: 'Input',
    colProps: { span: 8 },
    dynamicDisabled: true,
  },
  {
    label: '数量',
    field: 'qty',
    component: 'Input',
    dynamicDisabled: true,
    colProps: { span: 8 },
  },
  {
    label: '抽样数量',
    field: 'samplingQty',
    component: 'InputNumber',
    colProps: { span: 8 },
    componentProps: {
      onkeyup: function (e) {
        samplingQty.value = e.target.value;
      },
    },
  },
  {
    label: '结果',
    field: 'result',
    defaultValue: 'Y',
    component: 'JSwitch',
    componentProps: ({ formModel, formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        dictCode: 'is_open',
      };
    },
    colProps: { span: 8 },
  },
  {
    label: '缺陷代码',
    field: 'defectIds',
    component: 'JPopupCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;

      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/defecttype/basDefect/list',
        params: {},
        columns: [
          {
            title: '缺陷类型',
            align: 'center',
            dataIndex: 'defectTypeId_dictText',
          },
          {
            title: '缺陷代码',
            align: 'center',
            dataIndex: 'code',
          },
          {
            title: '描述',
            align: 'center',
            dataIndex: 'description',
          },
        ],
        queryInfo: [
          {
            field: 'code',
            label: '缺陷代码',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'description',
            label: '描述',
            mode: 'single',
            view: 'string',
          },
          {
            field: 'type',
            label: '缺陷类型',
            mode: 'single',
            view: 'string',
            fuzzy: false,
          },
        ],
        isShowNum: true,
        rowKey: 'id',
        labelKey: ['description'],
        multi: true,
        placeholder: '请输入',
        //pageSize: 10,
        maxTagCount: 2,
        /*queryBefore: (params) => {
          return params;
        },*/
      };
    },
    ifShow: ({ values }) => {
      return !!values.result && values.result === 'N';
    },
    colProps: { span: 8 },
  },
  {
    label: '不良数量',
    field: 'ngQty',
    component: 'InputNumber',
    colProps: { span: 8 },
    ifShow: ({ values }) => {
      return !!values.result && values.result === 'N';
    },
  },
  {
    label: '附件',
    field: 'attachments',
    component: 'JUploadCustom',
    componentProps: {
      uploadType: ['camera', 'uplaod'],
    },
    colProps: { span: 16 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
];

export const judTableColums: JVxeColumn[] = [
  {
    title: '',
    key: 'id',
    type: JVxeTypes.hidden,
  },
  {
    title: '',
    key: 'stdItemId',
    type: JVxeTypes.hidden,
  },
  {
    title: '编码',
    key: 'code',
    type: JVxeTypes.input,
    disabled: true,
    width: 120,
  },
  {
    title: '描述',
    key: 'description',
    type: JVxeTypes.textarea,
    disabled: true,
  },
  {
    title: '是否必填',
    key: 'isSuitable',
    disabled: true,
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    type: JVxeTypes.slot,
    align: 'center',
    slotName: 'mustSwitch',
    width: 120,
  },
  {
    title: '检验工具',
    key: 'inspTool',
    type: JVxeTypes.textarea,
    disabled: true,
  },
  {
    title: '检验依据',
    key: 'inspBasis',
    type: JVxeTypes.textarea,
    disabled: true,
  },
  {
    title: '技术要求',
    key: 'techRequirements',
    type: JVxeTypes.textarea,
    disabled: true,
  },
];

export const meaTableColums: JVxeColumn[] = [
  {
    title: '',
    key: 'id',
    type: JVxeTypes.hidden,
  },
  {
    title: '',
    key: 'stdItemId',
    type: JVxeTypes.hidden,
  },
  {
    title: '编码',
    key: 'code',
    type: JVxeTypes.input,
    disabled: true,
    width: 120,
  },
  {
    title: '描述',
    key: 'description',
    type: JVxeTypes.textarea,
    disabled: true,
  },
  {
    title: '是否必填',
    key: 'isSuitable',
    disabled: true,
    defaultValue: 'N',
    customValue: ['Y', 'N'],
    type: JVxeTypes.slot,
    align: 'center',
    slotName: 'resultSwitch',
    width: 120,
  },
  {
    title: '检验工具',
    key: 'inspTool',
    type: JVxeTypes.textarea,
    disabled: true,
  },
  {
    title: '检验依据',
    key: 'inspBasis',
    type: JVxeTypes.textarea,
    disabled: true,
  },
  {
    title: '技术要求',
    key: 'techRequirements',
    type: JVxeTypes.textarea,
    disabled: true,
  },
  {
    title: '下限比较符',
    key: 'minOperators',
    type: JVxeTypes.select,
    dictCode: 'lower_limit',
    disabled: true,
    width: 120,
  },
  {
    title: '下限',
    key: 'limitMin',
    type: JVxeTypes.inputNumber,
    disabled: true,
    width: 100,
  },
  {
    title: '上限比较符',
    key: 'maxOperators',
    type: JVxeTypes.select,
    dictCode: 'top_limit',
    disabled: true,
    width: 120,
  },
  {
    title: '上限',
    key: 'limitMax',
    type: JVxeTypes.inputNumber,
    disabled: true,
    width: 100,
  },
  {
    title: '单位',
    key: 'unitId',
    type: JVxeTypes.selectSearch,
    width: 100,
    dictCode: 'bas_unit,name,id',
    defaultValue: '',
    disabled: true,
  },
];
