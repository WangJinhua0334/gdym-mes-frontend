import { ref } from 'vue';
import { FormSchema } from '/@/components/Table';

export const doUpEnterPress = ref();
export const doDownEnterPress = ref();

//上料
export const upFormSchema: FormSchema[] = [
  {
    label: '条码',
    field: 'sn',
    component: 'Input',
    componentProps: {
      onkeyup: function (e) {
        if (e.keyCode == 13) {
          doUpEnterPress.value = new Date().getTime();
        }
      },
    },
  },
  {
    label: '条码',
    field: 'materialSn',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '工单',
    field: 'moId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '物料',
    field: 'prodId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '物料名称',
    field: 'prodName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '数量',
    field: 'qty',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '物料批次',
    field: 'materialBatch',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '物料成本',
    field: 'materialCost',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '供应商',
    field: 'suppId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '是否提醒',
    field: 'isRemind',
    defaultValue: 'N',
    component: 'JSwitch',
    componentProps: {
      dictCode: 'is_open',
    },
    colProps: { span: 12 },
  },
  {
    label: '提醒值',
    field: 'remindQty',
    component: 'InputNumber',
    colProps: { span: 12 },
    defaultValue: 0,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '附件',
    field: 'image',
    component: 'JUploadCustom',
    componentProps: {
      uploadType: ['camera', 'uplaod'],
    },
    colProps: { span: 24 },
  },
  {
    label: '供应商id',
    field: 'suppId',
    component: 'Input',
    show: false,
  },
  {
    label: '工单id',
    field: 'moId',
    component: 'Input',
    show: false,
  },
  {
    label: '物料id',
    field: 'prodId',
    component: 'Input',
    show: false,
  },
];
//下料
export const downFormSchema: FormSchema[] = [
  {
    label: '条码',
    field: 'sn',
    component: 'Input',
    componentProps: {
      onkeyup: function (e) {
        if (e.keyCode == 13) {
          doDownEnterPress.value = new Date().getTime();
        }
      },
    },
  },
  {
    label: '条码',
    field: 'materialSn',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '工单',
    field: 'moId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '物料',
    field: 'prodId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '物料名称',
    field: 'prodName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '数量',
    field: 'qty',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '物料批次',
    field: 'materialBatch',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '供应商',
    field: 'suppId_dictText',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: { span: 12 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
  {
    label: '附件',
    field: 'image',
    component: 'JUploadCustom',
    componentProps: {
      uploadType: ['camera', 'uplaod'],
    },
    colProps: { span: 24 },
  },
  {
    label: '供应商id',
    field: 'suppId',
    component: 'Input',
    show: false,
  },
  {
    label: '工单id',
    field: 'moId',
    component: 'Input',
    show: false,
  },
  {
    label: '物料id',
    field: 'prodId',
    component: 'Input',
    show: false,
  },
];
