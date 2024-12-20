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
  },
  {
    label: '入库申请单号',
    field: 'prodInCode',
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
    dynamicDisabled: true,
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
    dynamicDisabled: true,
    colProps: { span: 8 },
  },
  {
    label: '缺陷代码',
    field: 'defectIds',
    component: 'Input',
    dynamicDisabled: true,
    ifShow: ({ values }) => {
      return !!values.result && values.result === 'N';
    },
    colProps: { span: 8 },
  },
  {
    label: '不良数量',
    field: 'ngQty',
    component: 'InputNumber',
    dynamicDisabled: true,
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
    dynamicDisabled: true,
    colProps: { span: 16 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    dynamicDisabled: true,
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
