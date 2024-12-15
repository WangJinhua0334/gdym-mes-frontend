import { ref } from 'vue';
import { FormSchema } from '/@/components/Table';

export const doUpMould = ref();
export const doDownMould = ref();
//表单数据
export const upFormSchema: FormSchema[] = [
  {
    label: '模具编码',
    field: 'mouldCode',
    component: 'Input',
    componentProps: {
      onkeyup: function (e) {
        if (e.keyCode == 13) {
          doUpMould.value = new Date().getTime();
        }
      },
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请扫描模具!' }];
    },
  },
  {
    label: '模具',
    field: 'mouldId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '设备',
    field: 'equipId',
    component: 'JSearchSelectCustom',
    componentProps: ({ formActionType }) => {
      const { setFieldsValue, getFieldsValue } = formActionType;
      return {
        setFieldsValue: setFieldsValue,
        getFieldsValue: getFieldsValue,
        method: 'get',
        url: '/equipment/eamEquipment/list',
        params: {
          column: 'createTime',
          order: 'desc',
          searchFields: 'code,name',
        },
        columns: [
          {
            name: '编号',
            code: 'code',
          },
          {
            name: '名称',
            code: 'name',
          },
        ],
        isShowNum: true,
        labelKey: ['code'],
        rowKey: 'id',
        linkmap: [{ code: 'equipName' }],
        placeholder: '请扫描设备',
        multi: false,
      };
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请扫描设备或选择设备!' }];
    },
  },
  {
    label: '设备',
    field: 'equipName',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '工位',
    field: 'wkpId',
    component: 'Input',
    ifShow: false,
  },
  {
    label: '工位',
    field: 'wkpIdName',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '可用模穴数',
    field: 'cavityOk',
    component: 'InputNumber',
  },
  {
    label: '上模文件',
    field: 'upperFile',
    component: 'JUpload',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
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
//表单数据
export const downFormSchema: FormSchema[] = [
  {
    label: '模具编码',
    field: 'mouldCode',
    component: 'Input',
    componentProps: {
      onkeyup: function (e) {
        if (e.keyCode == 13) {
          doDownMould.value = new Date().getTime();
        }
      },
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请扫描模具!' }];
    },
  },
  {
    label: '模具',
    field: 'mouldId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '设备',
    field: 'equipId_dictText',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '工位',
    field: 'wkpIdName',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '可用模穴数',
    field: 'cavityOk',
    component: 'InputNumber',
    dynamicDisabled: true,
  },
  {
    label: '上模文件',
    field: 'upperFile',
    component: 'JUpload',
    dynamicDisabled: true,
  },
  {
    label: '使用次数',
    field: 'usedCount',
    component: 'InputNumber',
    defaultValue: 1,
  },
  {
    label: '产量',
    field: 'production',
    component: 'InputNumber',
    defaultValue: 1,
  },
  {
    label: '是否完好',
    field: 'isOk',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '是否保养',
    field: 'isMaintain',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '保养日期',
    field: 'maintainDate',
    component: 'DatePicker',
    componentProps: {
      showTime: false,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      getPopupContainer: (node) => document.body,
    },
    ifShow: ({ model }) => {
      return model.isMaintain == 'Y';
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择保养日期!' }];
    },
  },
  {
    label: '是否点检',
    field: 'isCheck',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
  },
  {
    label: '点检日期',
    field: 'checkDate',
    component: 'DatePicker',
    componentProps: {
      showTime: false,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      getPopupContainer: (node) => document.body,
    },
    ifShow: ({ model }) => {
      return model.isCheck == 'Y';
    },
    dynamicRules: ({ model, schema }) => {
      return [{ required: true, message: '请选择点检日期!' }];
    },
  },
  {
    label: '下模文件',
    field: 'lowerFile',
    component: 'JUpload',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
  {
    label: '模具',
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
